'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  X, Eye, User, Mail, Phone, MapPin, Building, Briefcase, Banknote, 
  FileText, Calendar, DollarSign, Clock, CheckCircle, XCircle, 
  CreditCard, Receipt, Upload, Download, Copy, Key, Users, 
  Loader2, AlertCircle, ChevronRight, IndianRupee, FileCheck, Wallet
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LoanDetailPanelProps {
  loanId: string | null;
  open?: boolean;  // Optional open prop for compatibility
  onClose?: () => void;  // Made optional
  onEMIPaid?: () => void;
  userRole?: string;  // Added user role for role-based features
  userId?: string;    // Added user ID for payment processing
  onPaymentSuccess?: () => void;  // Alternative callback name
}

interface LoanDetails {
  id: string;
  applicationNo: string;
  status: string;
  requestedAmount: number;
  requestedTenure?: number;
  requestedInterestRate?: number;
  loanType: string;
  purpose: string;
  createdAt: string;
  riskScore: number;
  fraudFlag: boolean;
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fatherName?: string;
  motherName?: string;
  gender?: string;
  maritalStatus?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  employmentType?: string;
  employerName?: string;
  employerAddress?: string;
  designation?: string;
  yearsInEmployment?: number;
  totalWorkExperience?: number;
  officePhone?: string;
  officeEmail?: string;
  monthlyIncome?: number;
  annualIncome?: number;
  otherIncome?: number;
  incomeSource?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
  bankBranch?: string;
  accountType?: string;
  accountHolderName?: string;
  loanAmount?: number;
  tenure?: number;
  interestRate?: number;
  emiAmount?: number;
  processingFee?: number;
  reference1Name?: string;
  reference1Phone?: string;
  reference1Relation?: string;
  reference1Address?: string;
  reference2Name?: string;
  reference2Phone?: string;
  reference2Relation?: string;
  reference2Address?: string;
  panCardDoc?: string;
  aadhaarFrontDoc?: string;
  aadhaarBackDoc?: string;
  incomeProofDoc?: string;
  addressProofDoc?: string;
  photoDoc?: string;
  bankStatementDoc?: string;
  salarySlipDoc?: string;
  otherDocs?: string;
  disbursedAmount?: number;
  disbursedAt?: string;
  disbursementMode?: string;
  disbursementRef?: string;
  disbursementProof?: string;
  rejectedById?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  submittedAt?: string;
  saApprovedAt?: string;
  companyApprovedAt?: string;
  agentApprovedAt?: string;
  loanFormCompletedAt?: string;
  sessionCreatedAt?: string;
  customerApprovedAt?: string;
  finalApprovedAt?: string;
  closedAt?: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    panNumber?: string;
    aadhaarNumber?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    employmentType?: string;
    monthlyIncome?: number;
    bankAccountNumber?: string;
    bankIfsc?: string;
    bankName?: string;
    createdAt?: string;
  };
  company?: {
    id: string;
    name: string;
    code: string;
    address?: string;
    city?: string;
    state?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
  agent?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    agentCode?: string;
  };
  sessionForm?: {
    id: string;
    approvedAmount: number;
    interestRate: number;
    tenure: number;
    emiAmount: number;
    totalAmount: number;
    totalInterest: number;
    processingFee?: number;
    moratoriumPeriod?: number;
    latePaymentPenalty?: number;
    bounceCharges?: number;
    specialConditions?: string;
    startDate?: string;
    createdAt?: string;
    agent?: {
      id: string;
      name: string;
      agentCode?: string;
    };
  };
  loanForm?: {
    id: string;
    panVerified: boolean;
    aadhaarVerified: boolean;
    bankVerified: boolean;
    employmentVerified: boolean;
    addressVerified: boolean;
    incomeVerified: boolean;
    verificationRemarks?: string;
    verificationDate?: string;
    riskScore?: number;
    riskFactors?: string;
    fraudFlag?: boolean;
    fraudReason?: string;
    internalRemarks?: string;
    visitDate?: string;
    visitAddress?: string;
    visitRemarks?: string;
    visitLatitude?: number;
    visitLongitude?: number;
    visitPhotos?: string;
  };
  disbursedBy?: {
    id: string;
    name: string;
    email?: string;
  };
  workflowLogs?: Array<{
    id: string;
    action: string;
    newStatus: string;
    previousStatus?: string;
    remarks?: string;
    createdAt: string;
    actionBy?: {
      id: string;
      name: string;
      email?: string;
      role?: string;
    };
  }>;
  payments?: Array<{
    id: string;
    amount: number;
    paymentMode?: string;
    paymentReference?: string;
    status: string;
    receiptNumber?: string;
    createdAt: string;
    cashier?: {
      id: string;
      name: string;
      cashierCode?: string;
    };
  }>;
  emiSchedules?: Array<any>;
  // Customer password for login
  plainPassword?: string;
  showPassword?: boolean;
}

interface EMISchedule {
  id: string;
  emiNumber: number;
  dueDate: string;
  emiAmount: number;
  principalAmount: number;
  interestAmount: number;
  outstandingPrincipal: number;
  status: string;
  paidAmount?: number;
  paidDate?: string;
  paymentMode?: string;
  paymentRef?: string;
  proofUrl?: string;
  lateFee?: number;
}

export default function LoanDetailPanel({ loanId, open, onClose, onEMIPaid, userRole, userId, onPaymentSuccess }: LoanDetailPanelProps) {
  const { user } = useAuth();
  // Use provided props or fall back to useAuth values
  const currentUserRole = userRole || user?.role || '';
  const currentUserId = userId || user?.id || '';
  const [loading, setLoading] = useState(false);
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [emiSchedules, setEmiSchedules] = useState<EMISchedule[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // EMI Payment State
  const [showEMIPaymentDialog, setShowEMIPaymentDialog] = useState(false);
  const [selectedEMI, setSelectedEMI] = useState<EMISchedule | null>(null);
  const [emiPaymentForm, setEmiPaymentForm] = useState({
    amount: 0,
    paymentMode: 'CASH',
    paymentRef: '',
    creditType: 'PERSONAL',
    remarks: '',
    proofFile: null as File | null
  });
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [payingEMI, setPayingEMI] = useState(false);

  // Credit info
  const [personalCredit, setPersonalCredit] = useState(0);
  const [companyCredit, setCompanyCredit] = useState(0);

  // Helper function for clipboard copy
  const handleCopy = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      toast({ title: 'Copied', description: 'Copied to clipboard' });
    } catch {
      toast({ title: 'Error', description: 'Failed to copy', variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (loanId) {
      fetchLoanDetails();
      fetchEMISchedules();
      fetchCreditInfo();
    }
  }, [loanId]);

  const fetchLoanDetails = async () => {
    if (!loanId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/loan/details?loanId=${loanId}`);
      const data = await response.json();
      if (data.success && data.loan) {
        setLoanDetails(data.loan);
        // Also set EMI schedules from loan data if available
        if (data.loan.emiSchedules) {
          setEmiSchedules(data.loan.emiSchedules.map((s: any) => ({
            id: s.id,
            emiNumber: s.installmentNumber,
            dueDate: s.dueDate,
            emiAmount: s.totalAmount,
            principalAmount: s.principalAmount,
            interestAmount: s.interestAmount,
            outstandingPrincipal: s.outstandingPrincipal,
            status: s.paymentStatus,
            paidAmount: s.paidAmount,
            paidDate: s.paidDate,
            paymentMode: s.paymentMode,
            paymentRef: s.paymentReference,
            proofUrl: s.proofUrl,
            lateFee: s.penaltyAmount
          })));
        }
        console.log('Loan details loaded:', data.loan);
      } else {
        console.error('Failed to load loan details:', data);
      }
    } catch (error) {
      console.error('Error fetching loan details:', error);
      toast({ title: 'Error', description: 'Failed to fetch loan details', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchEMISchedules = async () => {
    if (!loanId) return;
    try {
      const response = await fetch(`/api/emi?loanId=${loanId}`);
      const data = await response.json();
      if (data.success) {
        setEmiSchedules(data.schedules || []);
      }
    } catch (error) {
      console.error('Error fetching EMI schedules:', error);
    }
  };

  const fetchCreditInfo = async () => {
    if (!currentUserId) return;
    try {
      const response = await fetch(`/api/credit?userId=${currentUserId}`);
      const data = await response.json();
      if (data.success) {
        setPersonalCredit(data.user?.personalCredit || 0);
        setCompanyCredit(data.user?.companyCredit || 0);
      }
    } catch (error) {
      console.error('Error fetching credit info:', error);
    }
  };

  const openEMIPaymentDialog = (emi: EMISchedule) => {
    setSelectedEMI(emi);
    // Default: CASH payment uses COMPANY credit (no proof required for CASH+COMPANY)
    // Other payment modes use PERSONAL credit and require proof
    setEmiPaymentForm({
      amount: emi.emiAmount + (emi.lateFee || 0),
      paymentMode: 'CASH',
      paymentRef: '',
      creditType: 'COMPANY', // Default to COMPANY for CASH (no proof required)
      remarks: '',
      proofFile: null
    });
    setProofPreview(null);
    setShowEMIPaymentDialog(true);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: 'File Too Large', description: 'Maximum file size is 10MB', variant: 'destructive' });
        return;
      }
      setEmiPaymentForm({ ...emiPaymentForm, proofFile: file });
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setProofPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setProofPreview(null);
      }
    }
  };

  const handleEMIPayment = async () => {
    if (!selectedEMI || !loanDetails) return;
    
    // CREDIT SYSTEM LOGIC:
    // When role pays EMI for customer, they COLLECT money from customer
    // Their credit INCREASES by the payment amount
    // CASH → Company Credit (no proof required)
    // Non-CASH → Personal Credit (proof required)
    
    // Determine credit type based on payment mode
    const actualCreditType = emiPaymentForm.paymentMode === 'CASH' ? 'COMPANY' : 'PERSONAL';
    
    // Proof requirement:
    // Personal Credit ALWAYS requires proof
    // Company Credit (CASH only) doesn't require proof
    const requiresProof = actualCreditType === 'PERSONAL';
    
    if (requiresProof && !emiPaymentForm.proofFile) {
      toast({ 
        title: 'Proof Required', 
        description: 'Personal credit transactions require payment proof. Please upload a proof document.', 
        variant: 'destructive' 
      });
      return;
    }

    // NO credit balance check needed - credit will INCREASE
    // The role is COLLECTING money from customer, not paying from their credit

    setPayingEMI(true);
    try {
      let proofUrl = '';
      
      // Upload proof only if required
      if (requiresProof && emiPaymentForm.proofFile) {
        const proofFormData = new FormData();
        proofFormData.append('file', emiPaymentForm.proofFile);
        proofFormData.append('documentType', 'emi_proof');
        proofFormData.append('loanId', loanDetails.id);
        proofFormData.append('uploadedBy', user?.id || '');

        const uploadResponse = await fetch('/api/upload/document', {
          method: 'POST',
          body: proofFormData
        });
        const uploadData = await uploadResponse.json();
        
        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || 'Failed to upload proof');
        }
        proofUrl = uploadData.url;
      }

      // Process EMI payment
      const response = await fetch('/api/emi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emiId: selectedEMI.id,
          loanId: loanDetails.id,
          paidAmount: emiPaymentForm.amount,
          paymentMode: emiPaymentForm.paymentMode,
          paymentRef: emiPaymentForm.paymentRef,
          creditType: emiPaymentForm.creditType,
          remarks: emiPaymentForm.remarks,
          proofUrl: proofUrl,
          userId: user?.id
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({ 
          title: 'EMI Collected Successfully', 
          description: `₹${formatCurrency(emiPaymentForm.amount)} collected for EMI #${selectedEMI.emiNumber}. Your ${actualCreditType.toLowerCase()} credit increased.` 
        });
        setShowEMIPaymentDialog(false);
        fetchEMISchedules();
        fetchCreditInfo();
        if (onEMIPaid) onEMIPaid();
        if (onPaymentSuccess) onPaymentSuccess();
      } else {
        throw new Error(data.error || 'Failed to process payment');
      }
    } catch (error) {
      console.error('Error processing EMI payment:', error);
      toast({ 
        title: 'Payment Failed', 
        description: error instanceof Error ? error.message : 'Failed to process EMI payment', 
        variant: 'destructive' 
      });
    } finally {
      setPayingEMI(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { className: string; label: string }> = {
      PENDING: { className: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
      PAID: { className: 'bg-green-100 text-green-700', label: 'Paid' },
      OVERDUE: { className: 'bg-red-100 text-red-700', label: 'Overdue' },
      PARTIALLY_PAID: { className: 'bg-orange-100 text-orange-700', label: 'Partial' },
      ACTIVE: { className: 'bg-green-100 text-green-700', label: 'Active' },
      DISBURSED: { className: 'bg-blue-100 text-blue-700', label: 'Disbursed' },
    };
    const c = config[status] || { className: 'bg-gray-100 text-gray-700', label: status };
    return <Badge className={c.className}>{c.label}</Badge>;
  };

  // Don't render if not open or no loanId
  if (!open || !loanId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Loan Details</h2>
              <p className="text-sm text-white/80">{loanDetails?.applicationNo || 'Loading...'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loanDetails && getStatusBadge(loanDetails.status)}
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Credit Info Bar */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Personal: ₹{formatCurrency(personalCredit)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Company: ₹{formatCurrency(companyCredit)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-emerald-600" />
              <p className="text-gray-500">Loading loan details...</p>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-5 mx-4 mt-2">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="customer" className="text-xs">Customer</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
              <TabsTrigger value="emi" className="text-xs">EMI</TabsTrigger>
              <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              {/* Overview Tab */}
              <TabsContent value="overview" className="p-4 space-y-4 m-0">
                {/* Application Info */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Application Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Application No</p>
                        <p className="font-semibold">{loanDetails?.applicationNo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Applied On</p>
                        <p className="font-semibold">{formatDate(loanDetails?.submittedAt || loanDetails?.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Loan Type</p>
                        <p className="font-semibold">{loanDetails?.loanType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Purpose</p>
                        <p className="font-semibold">{loanDetails?.purpose || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Requested vs Approved */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      Loan Amount
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg text-center">
                        <p className="text-xs text-gray-500">Requested</p>
                        <p className="font-bold text-lg">{formatCurrency(loanDetails?.requestedAmount || 0)}</p>
                        <p className="text-xs text-gray-400">{loanDetails?.requestedTenure} months @ {loanDetails?.requestedInterestRate}%</p>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-lg text-center">
                        <p className="text-xs text-emerald-600">Approved</p>
                        <p className="font-bold text-lg text-emerald-700">{formatCurrency(loanDetails?.sessionForm?.approvedAmount || 0)}</p>
                        <p className="text-xs text-emerald-500">{loanDetails?.sessionForm?.tenure} months @ {loanDetails?.sessionForm?.interestRate}%</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg text-center">
                        <p className="text-xs text-purple-600">Disbursed</p>
                        <p className="font-bold text-lg text-purple-700">{formatCurrency(loanDetails?.disbursedAmount || 0)}</p>
                        <p className="text-xs text-purple-500">{loanDetails?.disbursementMode || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Session Details */}
                {loanDetails?.sessionForm && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        Session / EMI Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Interest Rate</p>
                          <p className="font-semibold">{loanDetails.sessionForm.interestRate}% p.a.</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tenure</p>
                          <p className="font-semibold">{loanDetails.sessionForm.tenure} months</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">EMI Amount</p>
                          <p className="font-semibold text-emerald-600">{formatCurrency(loanDetails.sessionForm.emiAmount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Interest</p>
                          <p className="font-semibold">{formatCurrency(loanDetails.sessionForm.totalInterest)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="font-semibold">{formatCurrency(loanDetails.sessionForm.totalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Processing Fee</p>
                          <p className="font-semibold">{formatCurrency(loanDetails.sessionForm.processingFee || 0)}</p>
                        </div>
                        {loanDetails.sessionForm.startDate && (
                          <div>
                            <p className="text-xs text-gray-500">Start Date</p>
                            <p className="font-semibold">{formatDate(loanDetails.sessionForm.startDate)}</p>
                          </div>
                        )}
                        {loanDetails.sessionForm.moratoriumPeriod && loanDetails.sessionForm.moratoriumPeriod > 0 && (
                          <div>
                            <p className="text-xs text-gray-500">Moratorium</p>
                            <p className="font-semibold">{loanDetails.sessionForm.moratoriumPeriod} months</p>
                          </div>
                        )}
                        {loanDetails.sessionForm.latePaymentPenalty && (
                          <div>
                            <p className="text-xs text-gray-500">Late Fee</p>
                            <p className="font-semibold">{loanDetails.sessionForm.latePaymentPenalty}%</p>
                          </div>
                        )}
                      </div>
                      {loanDetails.sessionForm.specialConditions && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                          <p className="text-xs text-amber-600 font-medium">Special Conditions</p>
                          <p className="text-sm mt-1">{loanDetails.sessionForm.specialConditions}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Verification Status */}
                {loanDetails?.loanForm && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Verification Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-3">
                        <div className={`p-2 rounded-lg text-center ${loanDetails.loanForm.panVerified ? 'bg-green-50' : 'bg-gray-50'}`}>
                          <p className="text-xs text-gray-500">PAN</p>
                          {loanDetails.loanForm.panVerified ? 
                            <CheckCircle className="h-5 w-5 mx-auto text-green-600" /> :
                            <XCircle className="h-5 w-5 mx-auto text-gray-400" />
                          }
                        </div>
                        <div className={`p-2 rounded-lg text-center ${loanDetails.loanForm.aadhaarVerified ? 'bg-green-50' : 'bg-gray-50'}`}>
                          <p className="text-xs text-gray-500">Aadhaar</p>
                          {loanDetails.loanForm.aadhaarVerified ? 
                            <CheckCircle className="h-5 w-5 mx-auto text-green-600" /> :
                            <XCircle className="h-5 w-5 mx-auto text-gray-400" />
                          }
                        </div>
                        <div className={`p-2 rounded-lg text-center ${loanDetails.loanForm.bankVerified ? 'bg-green-50' : 'bg-gray-50'}`}>
                          <p className="text-xs text-gray-500">Bank</p>
                          {loanDetails.loanForm.bankVerified ? 
                            <CheckCircle className="h-5 w-5 mx-auto text-green-600" /> :
                            <XCircle className="h-5 w-5 mx-auto text-gray-400" />
                          }
                        </div>
                        <div className={`p-2 rounded-lg text-center ${loanDetails.loanForm.employmentVerified ? 'bg-green-50' : 'bg-gray-50'}`}>
                          <p className="text-xs text-gray-500">Employment</p>
                          {loanDetails.loanForm.employmentVerified ? 
                            <CheckCircle className="h-5 w-5 mx-auto text-green-600" /> :
                            <XCircle className="h-5 w-5 mx-auto text-gray-400" />
                          }
                        </div>
                        <div className={`p-2 rounded-lg text-center ${loanDetails.loanForm.addressVerified ? 'bg-green-50' : 'bg-gray-50'}`}>
                          <p className="text-xs text-gray-500">Address</p>
                          {loanDetails.loanForm.addressVerified ? 
                            <CheckCircle className="h-5 w-5 mx-auto text-green-600" /> :
                            <XCircle className="h-5 w-5 mx-auto text-gray-400" />
                          }
                        </div>
                        <div className={`p-2 rounded-lg text-center ${loanDetails.loanForm.incomeVerified ? 'bg-green-50' : 'bg-gray-50'}`}>
                          <p className="text-xs text-gray-500">Income</p>
                          {loanDetails.loanForm.incomeVerified ? 
                            <CheckCircle className="h-5 w-5 mx-auto text-green-600" /> :
                            <XCircle className="h-5 w-5 mx-auto text-gray-400" />
                          }
                        </div>
                      </div>
                      {loanDetails.loanForm.riskScore && loanDetails.loanForm.riskScore > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Risk Score</span>
                            <span className={`font-bold ${loanDetails.loanForm.riskScore > 50 ? 'text-red-600' : 'text-green-600'}`}>
                              {loanDetails.loanForm.riskScore}/100
                            </span>
                          </div>
                          {loanDetails.loanForm.riskFactors && (
                            <p className="text-xs text-gray-500 mt-1">{loanDetails.loanForm.riskFactors}</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Disbursement Details */}
                {loanDetails?.disbursedAmount && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-purple-600" />
                        Disbursement Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Disbursed Amount</p>
                          <p className="font-semibold text-purple-600">{formatCurrency(loanDetails.disbursedAmount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Disbursed On</p>
                          <p className="font-semibold">{formatDate(loanDetails.disbursedAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Payment Mode</p>
                          <p className="font-semibold">{loanDetails.disbursementMode || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Reference</p>
                          <p className="font-semibold">{loanDetails.disbursementRef || 'N/A'}</p>
                        </div>
                        {loanDetails.disbursedBy && (
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500">Disbursed By</p>
                            <p className="font-semibold">{loanDetails.disbursedBy.name} ({loanDetails.disbursedBy.email})</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Assignment Details */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building className="h-4 w-4 text-orange-600" />
                      Assignment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Company</p>
                        <p className="font-semibold">{loanDetails?.company?.name || 'N/A'}</p>
                        {loanDetails?.company?.code && <p className="text-xs text-gray-400">Code: {loanDetails.company.code}</p>}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Agent</p>
                        <p className="font-semibold">{loanDetails?.agent?.name || loanDetails?.sessionForm?.agent?.name || 'N/A'}</p>
                        {loanDetails?.agent?.agentCode && <p className="text-xs text-gray-400">Code: {loanDetails.agent.agentCode}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk & Fraud */}
                {(loanDetails?.riskScore || loanDetails?.fraudFlag) && (
                  <Card className={`border-0 shadow-sm ${loanDetails?.fraudFlag ? 'bg-red-50' : ''}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertCircle className={`h-4 w-4 ${loanDetails?.fraudFlag ? 'text-red-600' : 'text-amber-600'}`} />
                        Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loanDetails?.riskScore && (
                        <div className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Risk Score</span>
                            <span className={`font-bold ${loanDetails.riskScore > 50 ? 'text-red-600' : 'text-green-600'}`}>
                              {loanDetails.riskScore}/100
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${loanDetails.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${loanDetails.riskScore}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {loanDetails?.fraudFlag && (
                        <div className="p-3 bg-red-100 rounded-lg">
                          <p className="text-red-800 font-medium">⚠️ Fraud Flag Detected</p>
                          {loanDetails.fraudReason && <p className="text-red-600 text-sm mt-1">{loanDetails.fraudReason}</p>}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Rejection Info */}
                {loanDetails?.rejectedAt && (
                  <Card className="border-0 shadow-sm bg-red-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        Rejection Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Rejected On</p>
                          <p className="font-semibold">{formatDate(loanDetails.rejectedAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Rejected By</p>
                          <p className="font-semibold">{loanDetails.rejectedBy?.name || 'N/A'}</p>
                        </div>
                        {loanDetails.rejectionReason && (
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500">Reason</p>
                            <p className="font-semibold">{loanDetails.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Customer Tab */}
              <TabsContent value="customer" className="p-4 space-y-4 m-0">
                {/* Customer Header */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                  <Avatar className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-teal-600">
                    <AvatarFallback className="bg-transparent text-white text-xl font-bold">
                      {loanDetails?.customer?.name?.charAt(0) || loanDetails?.firstName?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">{loanDetails?.customer?.name || [loanDetails?.title, loanDetails?.firstName, loanDetails?.middleName, loanDetails?.lastName].filter(Boolean).join(' ')}</h3>
                    <p className="text-gray-500">{loanDetails?.customer?.email}</p>
                    <p className="text-gray-500">{loanDetails?.customer?.phone || loanDetails?.phone}</p>
                  </div>
                </div>

                {/* Login Credentials */}
                {loanDetails?.plainPassword && (
                  <Card className="border-amber-200 bg-amber-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Key className="h-4 w-4 text-amber-600" />
                        Login Credentials
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{loanDetails.customer?.email}</p>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-6 w-6"
                              onClick={() => handleCopy(loanDetails.customer?.email || '')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Password</p>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{loanDetails.plainPassword}</p>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-6 w-6"
                              onClick={() => handleCopy(loanDetails.plainPassword || '')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Personal Info */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4 text-emerald-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="font-semibold">{[loanDetails?.title, loanDetails?.firstName, loanDetails?.middleName, loanDetails?.lastName].filter(Boolean).join(' ') || loanDetails?.customer?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Father's Name</p>
                        <p className="font-semibold">{loanDetails?.fatherName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Mother's Name</p>
                        <p className="font-semibold">{loanDetails?.motherName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date of Birth</p>
                        <p className="font-semibold">{loanDetails?.dateOfBirth || loanDetails?.customer?.dateOfBirth ? formatDate(loanDetails?.dateOfBirth || loanDetails?.customer?.dateOfBirth) : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Gender</p>
                        <p className="font-semibold">{loanDetails?.gender || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Marital Status</p>
                        <p className="font-semibold">{loanDetails?.maritalStatus || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Nationality</p>
                        <p className="font-semibold">{loanDetails?.nationality || 'Indian'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* KYC Documents */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-blue-600" />
                      KYC Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">PAN Number</p>
                        <p className="font-semibold">{loanDetails?.panNumber || loanDetails?.customer?.panNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Aadhaar Number</p>
                        <p className="font-semibold">
                          {loanDetails?.aadhaarNumber || loanDetails?.customer?.aadhaarNumber 
                            ? `XXXX-XXXX-${(loanDetails?.aadhaarNumber || loanDetails?.customer?.aadhaarNumber)?.slice(-4)}` 
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="font-semibold">{loanDetails?.phone || loanDetails?.customer?.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-semibold">{loanDetails?.customer?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div>
                          <p className="text-xs text-gray-500">Address</p>
                          <p className="font-semibold">{loanDetails?.address || loanDetails?.customer?.address}</p>
                          <p className="text-sm text-gray-500">
                            {[loanDetails?.city || loanDetails?.customer?.city, 
                              loanDetails?.state || loanDetails?.customer?.state, 
                              loanDetails?.pincode || loanDetails?.customer?.pincode]
                              .filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Employment Info */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-purple-600" />
                      Employment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Employment Type</p>
                        <p className="font-semibold">{loanDetails?.employmentType || loanDetails?.customer?.employmentType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Employer</p>
                        <p className="font-semibold">{loanDetails?.employerName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Designation</p>
                        <p className="font-semibold">{loanDetails?.designation || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Years in Employment</p>
                        <p className="font-semibold">{loanDetails?.yearsInEmployment ? `${loanDetails.yearsInEmployment} years` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Experience</p>
                        <p className="font-semibold">{loanDetails?.totalWorkExperience ? `${loanDetails.totalWorkExperience} years` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Monthly Income</p>
                        <p className="font-semibold">{formatCurrency(loanDetails?.monthlyIncome || loanDetails?.customer?.monthlyIncome || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Annual Income</p>
                        <p className="font-semibold">{formatCurrency(loanDetails?.annualIncome || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Other Income</p>
                        <p className="font-semibold">{formatCurrency(loanDetails?.otherIncome || 0)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Income Source</p>
                        <p className="font-semibold">{loanDetails?.incomeSource || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Office Phone</p>
                        <p className="font-semibold">{loanDetails?.officePhone || 'N/A'}</p>
                      </div>
                      {loanDetails?.employerAddress && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Employer Address</p>
                          <p className="font-semibold">{loanDetails.employerAddress}</p>
                        </div>
                      )}
                      {loanDetails?.officeEmail && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Office Email</p>
                          <p className="font-semibold">{loanDetails.officeEmail}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Bank Details */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-green-600" />
                      Bank Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Account Holder</p>
                        <p className="font-semibold">{loanDetails?.accountHolderName || loanDetails?.customer?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bank Name</p>
                        <p className="font-semibold">{loanDetails?.bankName || loanDetails?.customer?.bankName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Account Number</p>
                        <p className="font-semibold">{loanDetails?.bankAccountNumber || loanDetails?.customer?.bankAccountNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">IFSC Code</p>
                        <p className="font-semibold">{loanDetails?.bankIfsc || loanDetails?.customer?.bankIfsc || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Branch</p>
                        <p className="font-semibold">{loanDetails?.bankBranch || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Account Type</p>
                        <p className="font-semibold">{loanDetails?.accountType || 'Savings'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* References */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4 text-orange-600" />
                      References
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!loanDetails?.reference1Name && !loanDetails?.reference2Name) ? (
                      <p className="text-gray-500 text-center py-4">No references provided</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {loanDetails?.reference1Name && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-2">Reference 1</p>
                            <p className="font-semibold">{loanDetails.reference1Name}</p>
                            <p className="text-sm text-gray-500">{loanDetails.reference1Phone}</p>
                            <p className="text-xs text-gray-400">{loanDetails.reference1Relation}</p>
                            {loanDetails.reference1Address && (
                              <p className="text-xs text-gray-400 mt-1">{loanDetails.reference1Address}</p>
                            )}
                          </div>
                        )}
                        {loanDetails?.reference2Name && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-2">Reference 2</p>
                            <p className="font-semibold">{loanDetails.reference2Name}</p>
                            <p className="text-sm text-gray-500">{loanDetails.reference2Phone}</p>
                            <p className="text-xs text-gray-400">{loanDetails.reference2Relation}</p>
                            {loanDetails.reference2Address && (
                              <p className="text-xs text-gray-400 mt-1">{loanDetails.reference2Address}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="p-4 m-0">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-emerald-600" />
                      Uploaded Documents
                    </CardTitle>
                    <CardDescription>Click to view or download documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: 'PAN Card', url: loanDetails?.panCardDoc },
                        { name: 'Aadhaar Front', url: loanDetails?.aadhaarFrontDoc },
                        { name: 'Aadhaar Back', url: loanDetails?.aadhaarBackDoc },
                        { name: 'Income Proof', url: loanDetails?.incomeProofDoc },
                        { name: 'Address Proof', url: loanDetails?.addressProofDoc },
                        { name: 'Photo', url: loanDetails?.photoDoc },
                        { name: 'Bank Statement', url: loanDetails?.bankStatementDoc },
                        { name: 'Salary Slip', url: loanDetails?.salarySlipDoc },
                        { name: 'Other Documents', url: loanDetails?.otherDocs },
                      ].filter(doc => doc.url).map((doc) => (
                        <a 
                          key={doc.name} 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 border rounded-lg flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{doc.name}</p>
                            <p className="text-xs text-gray-500">Click to view</p>
                          </div>
                          <Eye className="h-4 w-4 text-gray-400" />
                        </a>
                      ))}
                      {loanDetails?.disbursementProof && (
                        <a 
                          href={loanDetails.disbursementProof} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 border rounded-lg flex items-center gap-3 hover:bg-purple-50 cursor-pointer transition-colors border-purple-200"
                        >
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Banknote className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">Disbursement Proof</p>
                            <p className="text-xs text-purple-500">View proof</p>
                          </div>
                          <Eye className="h-4 w-4 text-purple-400" />
                        </a>
                      )}
                    </div>
                    {![loanDetails?.panCardDoc, loanDetails?.aadhaarFrontDoc, loanDetails?.aadhaarBackDoc, 
                       loanDetails?.incomeProofDoc, loanDetails?.addressProofDoc, loanDetails?.photoDoc,
                       loanDetails?.bankStatementDoc, loanDetails?.salarySlipDoc, loanDetails?.otherDocs,
                       loanDetails?.disbursementProof].some(Boolean) && (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No documents uploaded yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* EMI Tab */}
              <TabsContent value="emi" className="p-4 m-0">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-emerald-600" />
                      EMI Schedule
                    </CardTitle>
                    <CardDescription>
                      {emiSchedules.filter(e => e.status === 'PAID').length} of {emiSchedules.length} EMIs paid
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {emiSchedules.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Receipt className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                        <p>No EMI schedule found</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {emiSchedules.map((emi) => (
                          <motion.div 
                            key={emi.id}
                            className={`p-4 border rounded-xl ${
                              emi.status === 'PAID' ? 'bg-green-50 border-green-200' :
                              emi.status === 'OVERDUE' ? 'bg-red-50 border-red-200' :
                              'bg-white'
                            }`}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  emi.status === 'PAID' ? 'bg-green-200' :
                                  emi.status === 'OVERDUE' ? 'bg-red-200' :
                                  'bg-gray-100'
                                }`}>
                                  {emi.status === 'PAID' ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <span className="font-semibold text-sm">{emi.emiNumber}</span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">EMI #{emi.emiNumber}</p>
                                  <p className="text-sm text-gray-500">Due: {formatDate(emi.dueDate)}</p>
                                  {emi.lateFee && emi.lateFee > 0 && (
                                    <p className="text-xs text-red-600">Late Fee: ₹{formatCurrency(emi.lateFee)}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{formatCurrency(emi.emiAmount)}</p>
                                {emi.status !== 'PAID' && (
                                  <Button 
                                    size="sm" 
                                    className="mt-2 bg-emerald-500 hover:bg-emerald-600"
                                    onClick={() => openEMIPaymentDialog(emi)}
                                  >
                                    <IndianRupee className="h-4 w-4 mr-1" /> Pay
                                  </Button>
                                )}
                                {emi.status === 'PAID' && (
                                  <div className="text-xs text-green-600">
                                    <p>Paid: {formatDate(emi.paidDate!)}</p>
                                    {emi.proofUrl && (
                                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                        View Proof
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="p-4 m-0">
                {/* Workflow Timeline */}
                <Card className="border-0 shadow-sm mb-4">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      Workflow Timeline
                    </CardTitle>
                    <CardDescription>Complete journey of this loan application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {loanDetails?.workflowLogs && loanDetails.workflowLogs.length > 0 ? (
                        <div className="space-y-4">
                          {loanDetails.workflowLogs.map((log, i) => (
                            <div key={log.id} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  i === 0 ? 'bg-emerald-100' : 'bg-gray-100'
                                }`}>
                                  {i === 0 ? (
                                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                                  )}
                                </div>
                                {i < (loanDetails.workflowLogs?.length || 0) - 1 && (
                                  <div className="w-0.5 h-8 bg-gray-200" />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{log.action}</p>
                                  <span className="text-xs text-gray-500">{formatDate(log.createdAt)}</span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Status: {log.previousStatus} → {log.newStatus}
                                </p>
                                {log.actionBy && (
                                  <p className="text-xs text-gray-400">
                                    By: {log.actionBy.name} ({log.actionBy.role})
                                  </p>
                                )}
                                {log.remarks && (
                                  <p className="text-xs text-gray-500 mt-1 italic">"{log.remarks}"</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {[
                            { date: loanDetails?.submittedAt || loanDetails?.createdAt, event: 'Application Submitted', status: 'SUBMITTED' },
                            { date: loanDetails?.saApprovedAt, event: 'Super Admin Approved', status: 'SA_APPROVED' },
                            { date: loanDetails?.companyApprovedAt, event: 'Company Approved', status: 'COMPANY_APPROVED' },
                            { date: loanDetails?.agentApprovedAt, event: 'Agent Approved', status: 'AGENT_APPROVED_STAGE1' },
                            { date: loanDetails?.loanFormCompletedAt, event: 'Form Completed', status: 'LOAN_FORM_COMPLETED' },
                            { date: loanDetails?.sessionCreatedAt, event: 'Sanction Created', status: 'SESSION_CREATED' },
                            { date: loanDetails?.customerApprovedAt, event: 'Customer Approved Session', status: 'CUSTOMER_SESSION_APPROVED' },
                            { date: loanDetails?.finalApprovedAt, event: 'Final Approved', status: 'FINAL_APPROVED' },
                            { date: loanDetails?.disbursedAt, event: 'Loan Disbursed', status: 'DISBURSED' },
                            { date: loanDetails?.rejectedAt, event: 'Rejected', status: loanDetails?.status },
                          ].filter(item => item.date).map((item, idx, arr) => (
                            <div key={item.status + '-' + idx} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  idx === arr.length - 1 && !loanDetails?.rejectedAt ? 'bg-emerald-100' : 'bg-gray-100'
                                }`}>
                                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                                </div>
                                {idx < arr.length - 1 && (
                                  <div className="w-0.5 h-8 bg-gray-200" />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{item.event}</p>
                                  <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
                                </div>
                                <p className="text-sm text-gray-500">Status: {item.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment History */}
                {loanDetails?.payments && loanDetails.payments.length > 0 && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-green-600" />
                        Payment History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {loanDetails.payments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                              <p className="text-xs text-gray-500">
                                {payment.paymentMode} • {formatDate(payment.createdAt)}
                              </p>
                              {payment.cashier && (
                                <p className="text-xs text-gray-400">
                                  Collected by: {payment.cashier.name}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge className={payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                {payment.status}
                              </Badge>
                              {payment.receiptNumber && (
                                <p className="text-xs text-gray-400 mt-1">{payment.receiptNumber}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}

        {/* EMI Payment Dialog */}
        <Dialog open={showEMIPaymentDialog} onOpenChange={setShowEMIPaymentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-emerald-600" />
                Pay EMI #{selectedEMI?.emiNumber}
              </DialogTitle>
              <DialogDescription>
                Due Amount: ₹{formatCurrency(selectedEMI?.emiAmount || 0)}
                {selectedEMI?.lateFee && selectedEMI.lateFee > 0 && (
                  <span className="text-red-600"> + Late Fee: ₹{formatCurrency(selectedEMI.lateFee)}</span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Credit Rules Info */}
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-start gap-2">
                  <Wallet className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <div className="text-xs text-emerald-700">
                    <p className="font-semibold">You are collecting payment from customer:</p>
                    <ul className="mt-1 space-y-0.5 list-disc list-inside">
                      <li><strong>CASH payment:</strong> Increases Company Credit (no proof required)</li>
                      <li><strong>UPI/Bank/Cheque:</strong> Increases Personal Credit (proof required)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payment Mode */}
              <div>
                <Label>Payment Mode *</Label>
                <Select 
                  value={emiPaymentForm.paymentMode} 
                  onValueChange={(v) => {
                    // Auto-switch credit type based on payment mode
                    // CASH → COMPANY (no proof required)
                    // Other modes → PERSONAL (proof required)
                    const newCreditType = v === 'CASH' ? 'COMPANY' : 'PERSONAL';
                    setEmiPaymentForm({ 
                      ...emiPaymentForm, 
                      paymentMode: v,
                      creditType: newCreditType,
                      proofFile: v === 'CASH' ? null : emiPaymentForm.proofFile
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash (→ Company Credit)</SelectItem>
                    <SelectItem value="UPI">UPI (→ Personal Credit)</SelectItem>
                    <SelectItem value="BANK_TRANSFER">Bank Transfer (→ Personal Credit)</SelectItem>
                    <SelectItem value="CHEQUE">Cheque (→ Personal Credit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Credit Selection */}
              <div className={`p-4 rounded-lg border ${emiPaymentForm.creditType === 'PERSONAL' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                <Label className={`${emiPaymentForm.creditType === 'PERSONAL' ? 'text-amber-800' : 'text-blue-800'} font-semibold mb-2 block`}>
                  Credit Will Increase To (Auto-selected based on payment mode)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={emiPaymentForm.creditType === 'PERSONAL' ? 'default' : 'outline'}
                    className={emiPaymentForm.creditType === 'PERSONAL' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                    onClick={() => setEmiPaymentForm({ ...emiPaymentForm, creditType: 'PERSONAL' })}
                    disabled={emiPaymentForm.paymentMode === 'CASH'}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Personal
                    <span className="ml-2 text-xs">₹{formatCurrency(personalCredit + (emiPaymentForm.creditType === 'PERSONAL' ? emiPaymentForm.amount : 0))}</span>
                  </Button>
                  <Button
                    type="button"
                    variant={emiPaymentForm.creditType === 'COMPANY' ? 'default' : 'outline'}
                    className={emiPaymentForm.creditType === 'COMPANY' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                    onClick={() => setEmiPaymentForm({ ...emiPaymentForm, creditType: 'COMPANY' })}
                    disabled={emiPaymentForm.paymentMode !== 'CASH'}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Company
                    <span className="ml-2 text-xs">₹{formatCurrency(companyCredit + (emiPaymentForm.creditType === 'COMPANY' ? emiPaymentForm.amount : 0))}</span>
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Current: Personal ₹{formatCurrency(personalCredit)} | Company ₹{formatCurrency(companyCredit)}
                </p>
                {emiPaymentForm.paymentMode === 'CASH' && emiPaymentForm.creditType === 'COMPANY' && (
                  <p className="text-xs text-green-600 mt-1">+₹{formatCurrency(emiPaymentForm.amount)} will be added to Company Credit (no proof required)</p>
                )}
                {emiPaymentForm.creditType === 'PERSONAL' && (
                  <p className="text-xs text-amber-600 mt-1">+₹{formatCurrency(emiPaymentForm.amount)} will be added to Personal Credit (proof required)</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <Label>Payment Amount (₹) *</Label>
                <Input
                  type="number"
                  value={emiPaymentForm.amount}
                  onChange={(e) => setEmiPaymentForm({ ...emiPaymentForm, amount: parseFloat(e.target.value) || 0 })}
                />
              </div>

              {/* Reference */}
              <div>
                <Label>Transaction Reference</Label>
                <Input
                  value={emiPaymentForm.paymentRef}
                  onChange={(e) => setEmiPaymentForm({ ...emiPaymentForm, paymentRef: e.target.value })}
                  placeholder="UTR/Transaction ID"
                />
              </div>

              {/* Proof Upload - Only required for PERSONAL credit or non-CASH payments */}
              {(emiPaymentForm.creditType === 'PERSONAL' || (emiPaymentForm.creditType === 'COMPANY' && emiPaymentForm.paymentMode !== 'CASH')) && (
                <div>
                  <Label className="flex items-center gap-1">
                    Payment Proof *
                    <span className="text-xs text-gray-500">(Required for {emiPaymentForm.creditType === 'PERSONAL' ? 'Personal Credit' : 'non-CASH payments'})</span>
                  </Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="proof-upload"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleProofUpload}
                    />
                    <label htmlFor="proof-upload" className="cursor-pointer">
                      {proofPreview ? (
                        <img src={proofPreview} alt="Proof Preview" className="max-h-32 mx-auto rounded" />
                      ) : emiPaymentForm.proofFile ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <FileCheck className="h-8 w-8" />
                          <p>{emiPaymentForm.proofFile.name}</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload proof</p>
                          <p className="text-xs text-gray-400">Image or PDF (max 10MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* No proof needed message for CASH + COMPANY */}
              {emiPaymentForm.paymentMode === 'CASH' && emiPaymentForm.creditType === 'COMPANY' && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">No proof required for CASH payment with Company Credit</span>
                  </div>
                </div>
              )}

              {/* Remarks */}
              <div>
                <Label>Remarks</Label>
                <Textarea
                  value={emiPaymentForm.remarks}
                  onChange={(e) => setEmiPaymentForm({ ...emiPaymentForm, remarks: e.target.value })}
                  placeholder="Any additional notes..."
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEMIPaymentDialog(false)}>Cancel</Button>
              <Button 
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={handleEMIPayment}
                disabled={payingEMI}
              >
                {payingEMI ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Pay ₹{formatCurrency(emiPaymentForm.amount)}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AnimatePresence>
  );
}
