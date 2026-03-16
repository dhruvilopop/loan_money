'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Eye, EyeOff, Lock, Mail, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface StaffLoginPageProps {
  onBack: () => void;
}

export default function StaffLoginPage({ onBack }: StaffLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({ title: 'Error', description: 'Please enter email and password', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, verificationCode: requires2FA ? verificationCode : undefined })
      });

      const data = await response.json();

      if (data.requiresCode) {
        setRequires2FA(true);
        setLoading(false);
        toast({ title: '2FA Required', description: 'Please enter your verification code' });
        return;
      }

      if (response.ok && data.success) {
        localStorage.setItem('demoUser', JSON.stringify(data.user));
        toast({ title: 'Success', description: 'Login successful!' });
        window.location.reload();
      } else {
        toast({ title: 'Error', description: data.error || 'Login failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-teal-100/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-emerald-200 hover:shadow-md transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="p-8 pb-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="w-16 h-16 mx-auto mb-4 relative rounded-2xl overflow-hidden shadow-lg ring-2 ring-emerald-100"
                >
                  <Image
                    src="/upload/mmsquare.png"
                    alt="Money Mitra Logo"
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Staff Portal</h1>
                <p className="text-gray-500 text-sm">Money Mitra Financial Advisor</p>
              </div>

              {/* Form */}
              <div className="px-8 pb-8">
                <form onSubmit={handleLogin} className="space-y-5">
                  {!requires2FA ? (
                    <>
                      {/* Email */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 text-sm">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="name@smfc.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12 h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 text-sm">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12 pr-12 h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* 2FA */
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        Verification Code
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        className="h-14 text-center text-2xl tracking-widest bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200/50 transition-all"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : requires2FA ? (
                      'Verify & Sign In'
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-2">Demo Credentials:</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><span className="text-gray-800">Super Admin:</span> superadmin@smfc.com</p>
                    <p><span className="text-gray-800">Password:</span> password123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
