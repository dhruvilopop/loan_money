'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Eye, EyeOff, Lock, Mail, Loader2, ArrowLeft, User, Phone, UserPlus, LogIn } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithGoogle } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface CustomerLoginPageProps {
  onBack: () => void;
}

export default function CustomerLoginPage({ onBack }: CustomerLoginPageProps) {
  const { customerLogin, customerRegister } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    if (isSignUp && !name) {
      toast({ title: 'Error', description: 'Please enter your name', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const result = await customerRegister({ email, password, name, phone });
        if (result.success) {
          toast({ title: 'Success', description: 'Account created successfully!' });
          window.location.reload();
        } else {
          toast({ title: 'Error', description: result.error || 'Sign up failed', variant: 'destructive' });
        }
      } else {
        const result = await customerLogin(email, password);
        if (result.success) {
          toast({ title: 'Success', description: 'Login successful!' });
          window.location.reload();
        } else {
          toast({ title: 'Error', description: result.error || 'Login failed', variant: 'destructive' });
        }
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    if (result.success) {
      toast({ title: 'Success', description: 'Login successful!' });
      window.location.reload();
    } else {
      toast({ title: 'Error', description: result.error || 'Google login failed', variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-orange-900/85 to-rose-900/90" />
        
        {/* Animated Pattern Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        {/* Floating Orbs */}
        <motion.div
          animate={{ 
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -70, 0],
            y: [0, 70, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-3xl"
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
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl blur-lg opacity-30" />
            
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-8 pb-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <Wallet className="h-8 w-8 text-white" />
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-1">Customer Portal</h1>
                <p className="text-white/60 text-sm">SMFC Finance</p>
              </div>

              {/* Slider Tabs */}
              <div className="px-8">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      !isSignUp 
                        ? 'bg-white/20 text-white shadow-md' 
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSignUp 
                        ? 'bg-white/20 text-white shadow-md' 
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="px-8 py-6">
                <AnimatePresence mode="wait">
                  <motion.form
                    key={isSignUp ? 'signup' : 'signin'}
                    initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label className="text-white/70 text-sm">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                          <Input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-400/50 focus:ring-amber-400/20 rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-400/50 focus:ring-amber-400/20 rounded-xl"
                        />
                      </div>
                    </div>

                    {isSignUp && (
                      <div className="space-y-2">
                        <Label className="text-white/70 text-sm">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                          <Input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-400/50 focus:ring-amber-400/20 rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-amber-400/50 focus:ring-amber-400/20 rounded-xl"
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

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : isSignUp ? (
                        'Create Account'
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </motion.form>
                </AnimatePresence>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-transparent text-white/40 text-sm">or continue with</span>
                  </div>
                </div>

                {/* Google Button */}
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                {/* Terms */}
                {isSignUp && (
                  <p className="mt-4 text-xs text-center text-white/40">
                    By creating an account, you agree to our{' '}
                    <span className="text-amber-400 hover:underline cursor-pointer">Terms</span>
                    {' '}and{' '}
                    <span className="text-amber-400 hover:underline cursor-pointer">Privacy Policy</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
