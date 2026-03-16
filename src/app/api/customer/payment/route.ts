import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, PaymentMode } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

// POST - Process EMI payment (Full, Partial, or Interest Only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      loanId,
      customerId,
      emiScheduleId,
      paymentType, // 'FULL_EMI', 'PARTIAL', 'INTEREST_ONLY'
      amount,
      nextPaymentDate,
      remarks
    } = body;

    if (!loanId || !customerId || !emiScheduleId || !paymentType || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get EMI Schedule
    const emiSchedule = await prisma.eMISchedule.findUnique({
      where: { id: emiScheduleId },
      include: {
        loanApplication: {
          include: {
            customer: true,
            company: true,
            agent: true
          }
        }
      }
    });

    if (!emiSchedule) {
      return NextResponse.json({ error: 'EMI schedule not found' }, { status: 404 });
    }

    if (emiSchedule.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'EMI already paid' }, { status: 400 });
    }

    const loan = emiSchedule.loanApplication;
    const paymentAmount = parseFloat(amount);
    const totalAmount = emiSchedule.totalAmount;
    const principalAmount = emiSchedule.principalAmount;
    const interestAmount = emiSchedule.interestAmount;

    let updatedEmiSchedule;
    let creditTransaction;
    let remainingAmount = 0;
    let newNextPaymentDate: Date | null = null;

    // Start transaction
    await prisma.$transaction(async (tx) => {
      if (paymentType === 'FULL_EMI') {
        // Full EMI Payment
        const paidPrincipal = principalAmount;
        const paidInterest = interestAmount;

        updatedEmiSchedule = await tx.eMISchedule.update({
          where: { id: emiScheduleId },
          data: {
            paymentStatus: 'PAID',
            paidAmount: totalAmount,
            paidPrincipal: paidPrincipal,
            paidInterest: paidInterest,
            paidDate: new Date(),
            paymentMode: 'ONLINE',
            outstandingPrincipal: 0,
            outstandingInterest: 0
          }
        });

        // Create credit transaction
        creditTransaction = await tx.creditTransaction.create({
          data: {
            userId: loan.agentId || '',
            transactionType: 'CREDIT_INCREASE',
            amount: totalAmount,
            paymentMode: 'ONLINE' as PaymentMode,
            creditType: 'PERSONAL',
            sourceType: 'EMI_PAYMENT',
            loanApplicationId: loanId,
            emiScheduleId: emiScheduleId,
            customerId: customerId,
            installmentNumber: emiSchedule.installmentNumber,
            customerName: loan.customer?.name,
            customerPhone: loan.customer?.phone,
            loanApplicationNo: loan.applicationNo,
            emiDueDate: emiSchedule.dueDate,
            emiAmount: totalAmount,
            principalComponent: paidPrincipal,
            interestComponent: paidInterest,
            description: `EMI #${emiSchedule.installmentNumber} payment`,
            remarks: remarks || 'Full EMI payment',
            transactionDate: new Date()
          }
        });

      } else if (paymentType === 'PARTIAL') {
        // Partial Payment
        if (!nextPaymentDate) {
          throw new Error('Next payment date is required for partial payment');
        }

        newNextPaymentDate = new Date(nextPaymentDate);
        remainingAmount = totalAmount - paymentAmount;
        const paidPrincipal = Math.min(paymentAmount, principalAmount);
        const paidInterest = Math.max(0, paymentAmount - paidPrincipal);

        updatedEmiSchedule = await tx.eMISchedule.update({
          where: { id: emiScheduleId },
          data: {
            paymentStatus: 'PARTIALLY_PAID',
            paidAmount: { increment: paymentAmount },
            paidPrincipal: { increment: paidPrincipal },
            paidInterest: { increment: paidInterest },
            isPartialPayment: true,
            nextPaymentDate: newNextPaymentDate,
            outstandingPrincipal: principalAmount - paidPrincipal,
            outstandingInterest: interestAmount - paidInterest,
            paymentMode: 'ONLINE',
            notes: `Partial payment of ${paymentAmount}. Remaining: ${remainingAmount} due on ${newNextPaymentDate.toISOString().split('T')[0]}`
          }
        });

        // Create credit transaction for partial payment
        creditTransaction = await tx.creditTransaction.create({
          data: {
            userId: loan.agentId || '',
            transactionType: 'CREDIT_INCREASE',
            amount: paymentAmount,
            paymentMode: 'ONLINE' as PaymentMode,
            creditType: 'PERSONAL',
            sourceType: 'EMI_PAYMENT',
            loanApplicationId: loanId,
            emiScheduleId: emiScheduleId,
            customerId: customerId,
            installmentNumber: emiSchedule.installmentNumber,
            customerName: loan.customer?.name,
            customerPhone: loan.customer?.phone,
            loanApplicationNo: loan.applicationNo,
            emiDueDate: emiSchedule.dueDate,
            emiAmount: totalAmount,
            principalComponent: paidPrincipal,
            interestComponent: paidInterest,
            description: `Partial EMI #${emiSchedule.installmentNumber} payment`,
            remarks: `Partial payment. Remaining ${remainingAmount} due on ${newNextPaymentDate.toISOString().split('T')[0]}`,
            transactionDate: new Date()
          }
        });

        // Shift next EMI to the new date
        const nextEmis = await tx.eMISchedule.findMany({
          where: {
            loanApplicationId: loanId,
            installmentNumber: { gt: emiSchedule.installmentNumber }
          },
          orderBy: { installmentNumber: 'asc' }
        });

        if (nextEmis.length > 0) {
          // Update the next EMI to include the remaining amount and new date
          const nextEmi = nextEmis[0];
          await tx.eMISchedule.update({
            where: { id: nextEmi.id },
            data: {
              dueDate: newNextPaymentDate,
              originalDueDate: nextEmi.originalDueDate || nextEmi.dueDate,
              totalAmount: { increment: remainingAmount },
              principalAmount: { increment: emiSchedule.principalAmount - paidPrincipal },
              notes: `Includes deferred amount from EMI #${emiSchedule.installmentNumber}`
            }
          });
        }

      } else if (paymentType === 'INTEREST_ONLY') {
        // Interest Only Payment - defer principal to next month
        const paidInterest = interestAmount;
        const deferredPrincipal = principalAmount;

        updatedEmiSchedule = await tx.eMISchedule.update({
          where: { id: emiScheduleId },
          data: {
            paymentStatus: 'PAID',
            paidAmount: interestAmount,
            paidPrincipal: 0,
            paidInterest: paidInterest,
            isInterestOnly: true,
            principalDeferred: true,
            outstandingPrincipal: deferredPrincipal,
            outstandingInterest: 0,
            notes: 'Interest only payment - principal deferred to next EMI'
          }
        });

        // Create credit transaction for interest payment
        creditTransaction = await tx.creditTransaction.create({
          data: {
            userId: loan.agentId || '',
            transactionType: 'CREDIT_INCREASE',
            amount: interestAmount,
            paymentMode: 'ONLINE' as PaymentMode,
            creditType: 'PERSONAL',
            sourceType: 'EMI_PAYMENT',
            loanApplicationId: loanId,
            emiScheduleId: emiScheduleId,
            customerId: customerId,
            installmentNumber: emiSchedule.installmentNumber,
            customerName: loan.customer?.name,
            customerPhone: loan.customer?.phone,
            loanApplicationNo: loan.applicationNo,
            emiDueDate: emiSchedule.dueDate,
            emiAmount: interestAmount,
            principalComponent: 0,
            interestComponent: paidInterest,
            description: `Interest only payment for EMI #${emiSchedule.installmentNumber}`,
            remarks: 'Interest only - principal deferred',
            transactionDate: new Date()
          }
        });

        // Shift the EMI to next month - add principal to next EMI
        const nextEmis = await tx.eMISchedule.findMany({
          where: {
            loanApplicationId: loanId,
            paymentStatus: { in: ['PENDING', 'PARTIALLY_PAID'] }
          },
          orderBy: { installmentNumber: 'asc' }
        });

        if (nextEmis.length > 0) {
          const nextEmi = nextEmis[0];
          const nextDueDate = new Date(nextEmi.dueDate);
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);

          await tx.eMISchedule.update({
            where: { id: nextEmi.id },
            data: {
              dueDate: nextDueDate,
              originalDueDate: nextEmi.originalDueDate || nextEmi.dueDate,
              principalAmount: { increment: deferredPrincipal },
              totalAmount: { increment: deferredPrincipal },
              notes: `Includes deferred principal from EMI #${emiSchedule.installmentNumber}`
            }
          });
        } else {
          // No more EMIs - create a new one for the deferred principal
          const lastEmi = await tx.eMISchedule.findFirst({
            where: { loanApplicationId: loanId },
            orderBy: { installmentNumber: 'desc' }
          });

          const newDueDate = new Date();
          newDueDate.setMonth(newDueDate.getMonth() + 1);

          await tx.eMISchedule.create({
            data: {
              loanApplicationId: loanId,
              installmentNumber: (lastEmi?.installmentNumber || 0) + 1,
              dueDate: newDueDate,
              originalDueDate: newDueDate,
              principalAmount: deferredPrincipal,
              interestAmount: 0,
              totalAmount: deferredPrincipal,
              paymentStatus: 'PENDING',
              paidAmount: 0,
              notes: 'Deferred principal from interest-only payment'
            }
          });
        }
      }

      // Update loan's last activity
      await tx.loanApplication.update({
        where: { id: loanId },
        data: { updatedAt: new Date() }
      });
    });

    return NextResponse.json({
      success: true,
      payment: {
        id: creditTransaction?.id,
        amount: paymentAmount,
        type: paymentType,
        remainingAmount: remainingAmount > 0 ? remainingAmount : undefined,
        nextPaymentDate: newNextPaymentDate?.toISOString()
      },
      emiSchedule: updatedEmiSchedule
    });

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment processing failed' },
      { status: 500 }
    );
  }
}
