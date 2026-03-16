'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Eye, EyeOff, Lock, Mail, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-900/85 to-slate-900/90" />
        
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        {/* Floating Orbs */}
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl"
        />
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 transition-all"
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
          {/* Glass Card */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-lg opacity-30" />
            
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-8 pb-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Wallet className="h-8 w-8 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-1">Staff Portal</h1>
                <p className="text-white/60 text-sm">SMFC Finance</p>
              </div>

              {/* Form */}
              <div className="px-8 pb-8">
                <form onSubmit={handleLogin} className="space-y-5">
                  {!requires2FA ? (
                    <>
                      {/* Email */}
                      <div className="space-y-2">
                        <Label className="text-white/70 text-sm">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                          <Input
                            type="email"
                            placeholder="name@smfc.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-400/50 focus:ring-emerald-400/20 rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <Label className="text-white/70 text-sm">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-400/50 focus:ring-emerald-400/20 rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* 2FA */
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-400" />
                        Verification Code
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        className="h-14 text-center text-2xl tracking-widest bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-400/50 focus:ring-emerald-400/20 rounded-xl"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
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
                <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-xs text-white/50 font-medium mb-2">Demo Credentials:</p>
                  <div className="text-xs text-white/60 space-y-1">
                    <p><span className="text-white/80">Super Admin:</span> superadmin@smfc.com</p>
                    <p><span className="text-white/80">Password:</span> password123</p>
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
