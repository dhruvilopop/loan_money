'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Wallet, Shield, Clock, Users, TrendingUp, Phone, Mail, MapPin, ArrowRight, 
  Building2, FileText, User, ChevronDown, ChevronUp, CheckCircle, 
  Calculator, Percent, IndianRupee, Calendar, Menu, X, Send, Award, 
  HeartHandshake, Target, Zap, Star, Sparkles, ArrowRightLeft, 
  PiggyBank, Landmark, CreditCard, BadgeCheck, Globe2, Heart, 
  Handshake, Lightbulb, LineChart, PieChart, BarChart3, Coins,
  Home, Briefcase, GraduationCap, Gem, Car, Laptop
} from 'lucide-react';
import { formatCurrency, calculateEMI } from '@/utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import StaffLoginPage from '@/components/auth/StaffLoginPage';
import CustomerLoginPage from '@/components/auth/CustomerLoginPage';
import Image from 'next/image';

type AuthView = 'landing' | 'staff-login' | 'customer-login';

// Soft Brand Colors - Money Mitra
const colors = {
  primary: '#4CAF50',      // Soft Green
  primaryLight: '#81C784',
  primaryLighter: '#C8E6C9',
  accent: '#FFB74D',       // Soft Amber
  accentLight: '#FFE0B2',
  secondary: '#64B5F6',    // Soft Blue
  secondaryLight: '#BBDEFB',
};

// Animated Counter
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Floating Animation Component
function FloatingElement({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

// Gradient Text Component
function GradientText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  const [stats, setStats] = useState({ totalLoans: 0, totalDisbursed: 0, activeCustomers: 0, companies: 0 });
  const [services, setServices] = useState<any[]>([]);
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Loan Calculator State
  const [calcAmount, setCalcAmount] = useState(500000);
  const [calcTenure, setCalcTenure] = useState(24);
  const [calcRate, setCalcRate] = useState(12);
  const [calcType, setCalcType] = useState<'personal' | 'home' | 'business'>('personal');
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch CMS data
  useEffect(() => {
    if (authView !== 'landing') return;
    
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        const [productsRes, statsRes] = await Promise.all([
          fetch('/api/cms/product?isActive=true', { signal: controller.signal }),
          fetch('/api/cms/service?type=all', { signal: controller.signal })
        ]);
        
        const productsData = await productsRes.json();
        const statsData = await statsRes.json();
        
        setServices(productsData.products || []);
        setStats(statsData.stats || { totalLoans: 0, totalDisbursed: 0, activeCustomers: 0, companies: 0 });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error fetching CMS data:', error);
        }
      }
    };
    
    fetchData();
    
    return () => controller.abort();
  }, [authView]);

  // Show login pages
  if (authView === 'staff-login') {
    return <StaffLoginPage onBack={() => setAuthView('landing')} />;
  }

  if (authView === 'customer-login') {
    return <CustomerLoginPage onBack={() => setAuthView('landing')} />;
  }

  // Calculate EMI
  const calculatedEMI = calculateEMI(calcAmount, calcRate, calcTenure);
  
  // Loan type presets
  const loanPresets = {
    personal: { maxAmount: 5000000, maxTenure: 60, rate: 12, icon: User, color: 'from-rose-400 to-pink-500' },
    home: { maxAmount: 50000000, maxTenure: 360, rate: 8.5, icon: Home, color: 'from-sky-400 to-blue-500' },
    business: { maxAmount: 10000000, maxTenure: 84, rate: 14, icon: Briefcase, color: 'from-violet-400 to-purple-500' },
  };

  // Features data
  const features = [
    { icon: Zap, title: 'Quick Approval', description: 'Get approved in hours', bgColor: 'bg-amber-50', iconColor: 'text-amber-500' },
    { icon: Shield, title: 'Secure Process', description: 'Your data is safe', bgColor: 'bg-green-50', iconColor: 'text-green-500' },
    { icon: TrendingUp, title: 'Best Rates', description: 'Competitive pricing', bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
    { icon: HeartHandshake, title: 'Dedicated Support', description: 'We are here for you', bgColor: 'bg-rose-50', iconColor: 'text-rose-500' },
  ];

  // What We Offer
  const offerings = [
    { icon: User, title: 'Personal Loans', description: 'For your personal needs - weddings, travel, medical emergencies', amount: 'Up to ₹50 Lakhs', rate: 'From 10% p.a.' },
    { icon: Home, title: 'Home Loans', description: 'Make your dream home a reality with flexible EMI options', amount: 'Up to ₹5 Crores', rate: 'From 8% p.a.' },
    { icon: Briefcase, title: 'Business Loans', description: 'Fuel your business growth with quick working capital', amount: 'Up to ₹1 Crore', rate: 'From 12% p.a.' },
    { icon: Gem, title: 'Gold Loans', description: 'Instant funds against your gold with minimal documentation', amount: 'Up to ₹50 Lakhs', rate: 'From 7% p.a.' },
    { icon: GraduationCap, title: 'Education Loans', description: 'Invest in your future with easy education financing', amount: 'Up to ₹1 Crore', rate: 'From 9% p.a.' },
    { icon: Car, title: 'Vehicle Loans', description: 'Drive your dream car home with affordable EMIs', amount: 'Up to ₹50 Lakhs', rate: 'From 9.5% p.a.' },
  ];

  // Services data
  const displayServices = services.length > 0 ? services : [
    { id: '1', title: 'Personal Loan', description: 'Quick approval for personal needs', icon: User, minInterestRate: 10, maxInterestRate: 18, minTenure: 6, maxTenure: 60, minAmount: 50000, maxAmount: 5000000 },
    { id: '2', title: 'Business Loan', description: 'Fuel your business growth', icon: Building2, minInterestRate: 12, maxInterestRate: 20, minTenure: 12, maxTenure: 84, minAmount: 100000, maxAmount: 10000000 },
    { id: '3', title: 'Home Loan', description: 'Make your dream home reality', icon: Landmark, minInterestRate: 8, maxInterestRate: 14, minTenure: 60, maxTenure: 360, minAmount: 500000, maxAmount: 50000000 },
    { id: '4', title: 'Gold Loan', description: 'Quick funds against gold', icon: Sparkles, minInterestRate: 7, maxInterestRate: 15, minTenure: 6, maxTenure: 36, minAmount: 10000, maxAmount: 5000000 },
  ];

  // About Us - Values
  const values = [
    { icon: Heart, title: 'Customer First', description: 'Your dreams and needs are our priority. We listen, understand, and deliver.' },
    { icon: Shield, title: 'Trust & Transparency', description: 'No hidden charges. Clear terms. What you see is what you get.' },
    { icon: Lightbulb, title: 'Innovation', description: 'We leverage technology to make borrowing simple and fast.' },
    { icon: Handshake, title: 'Integrity', description: 'Ethical practices and honest guidance in every interaction.' },
  ];

  // Team/Stats for About
  const aboutStats = [
    { value: '10+', label: 'Years Experience' },
    { value: '50,000+', label: 'Happy Customers' },
    { value: '₹500Cr+', label: 'Loans Disbursed' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  // Steps
  const steps = [
    { icon: FileText, title: 'Apply Online', description: 'Fill our simple application form', step: '01', color: 'bg-rose-100 text-rose-600' },
    { icon: BadgeCheck, title: 'Quick Verification', description: 'Fast document processing', step: '02', color: 'bg-sky-100 text-sky-600' },
    { icon: Wallet, title: 'Get Disbursed', description: 'Money in your account quickly', step: '03', color: 'bg-emerald-100 text-emerald-600' },
  ];

  // Testimonials
  const testimonials = [
    { name: 'Rahul Sharma', role: 'Business Owner', content: 'Got my business loan approved quickly. The team was very supportive throughout the process!', rating: 5 },
    { name: 'Priya Patel', role: 'Software Engineer', content: 'Best interest rates I found. The entire process was smooth and completed from home.', rating: 5 },
    { name: 'Amit Kumar', role: 'Entrepreneur', content: 'The support team guided me at every step. Highly recommend Money Mitra!', rating: 5 },
  ];

  // FAQs
  const faqs = [
    { question: 'How quickly can I get a loan approved?', answer: 'Our digital process can approve loans within hours for pre-qualified customers. Most loans are approved within 24 hours.' },
    { question: 'What documents do I need to apply?', answer: 'You need your PAN card, Aadhaar card, and bank statements for the last 3-6 months. Our process is completely digital.' },
    { question: 'Can I prepay my loan without penalties?', answer: 'Yes! We offer zero prepayment charges after 6 months of regular EMI payments. Save on interest by paying early.' },
    { question: 'How is the interest rate determined?', answer: 'We analyze your credit profile, income stability, and repayment capacity to offer you personalized competitive rates.' },
  ];

  // Contact form submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitting(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
    alert('Thank you for contacting us! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-green-100/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/40 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shadow-md ring-1 ring-amber-200/50">
                <Image
                  src="/upload/mmsquare.png"
                  alt="Money Mitra Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-semibold text-slate-800">Money Mitra</h1>
                <p className="text-[10px] md:text-xs text-amber-600 font-medium">Financial Advisor</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {['About', 'Services', 'Calculator', 'FAQ', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-slate-500 hover:text-green-600 transition-colors text-sm font-medium"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                onClick={() => setAuthView('staff-login')}
                className="px-4 py-2 text-sm text-slate-600 hover:text-green-600 border border-slate-200 rounded-full hover:border-green-200 hover:bg-green-50/50 transition-all font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Staff Portal
              </motion.button>
              <motion.button
                onClick={() => setAuthView('customer-login')}
                className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium shadow-md shadow-green-200/50 hover:shadow-green-300/50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-green-600"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100"
            >
              <div className="px-4 py-5 space-y-3">
                {['About', 'Services', 'Calculator', 'FAQ', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-slate-600 hover:text-green-600 py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => setAuthView('staff-login')}
                    className="w-full py-2.5 text-slate-600 border border-slate-200 rounded-full text-sm"
                  >
                    Staff Portal
                  </button>
                  <button
                    onClick={() => setAuthView('customer-login')}
                    className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="min-h-[85vh] md:min-h-[90vh] flex items-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-amber-50 border border-green-100 mb-6"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-xs font-medium text-green-700">Trusted by 10,000+ Customers</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-5 leading-tight"
                >
                  Your Trusted Partner for<br />
                  <GradientText>Smart Financial Solutions</GradientText>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-base md:text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
                >
                  Money Mitra makes borrowing simple with competitive rates, 
                  quick approvals, and personalized support for all your financial needs.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                >
                  <motion.button
                    onClick={() => setAuthView('customer-login')}
                    className="group px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-green-200/50 hover:shadow-green-300/50 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply Now
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                  <motion.button
                    onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:border-green-200 hover:bg-green-50/50 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Calculator className="h-4 w-4 text-green-500" />
                    Calculate EMI
                  </motion.button>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-5"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-xs text-slate-500">RBI Registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Award className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="text-xs text-slate-500">Award Winning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                      <Globe2 className="h-4 w-4 text-sky-500" />
                    </div>
                    <span className="text-xs text-slate-500">Pan India</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Content - Stats */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative"
              >
                <div className="relative">
                  <div className="absolute -inset-3 bg-gradient-to-r from-green-100/50 to-amber-100/50 rounded-2xl blur-xl" />
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100/50">
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                      <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-green-50/50 to-white">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Users className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-slate-800">
                          <AnimatedCounter value={stats.activeCustomers || 10000} suffix="+" />
                        </p>
                        <p className="text-slate-400 text-xs md:text-sm mt-1">Happy Customers</p>
                      </div>
                      <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-amber-50/50 to-white">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <IndianRupee className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-slate-800">
                          <AnimatedCounter value={100} suffix="Cr+" />
                        </p>
                        <p className="text-slate-400 text-xs md:text-sm mt-1">Loans Disbursed</p>
                      </div>
                      <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-sky-50/50 to-white">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-sky-100 to-sky-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Target className="h-5 w-5 md:h-6 md:w-6 text-sky-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-slate-800">98.5%</p>
                        <p className="text-slate-400 text-xs md:text-sm mt-1">Approval Rate</p>
                      </div>
                      <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-violet-50/50 to-white">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-violet-100 to-violet-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Clock className="h-5 w-5 md:h-6 md:w-6 text-violet-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-slate-800">24hrs</p>
                        <p className="text-slate-400 text-xs md:text-sm mt-1">Quick Approval</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <FloatingElement delay={0}>
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    Quick Approval
                  </div>
                </FloatingElement>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <span className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium mb-3">
                About Us
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                Why Choose <GradientText>Money Mitra</GradientText>?
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                We are committed to making financial services accessible, transparent, and customer-friendly
              </p>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
              {aboutStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 md:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm"
                >
                  <p className="text-2xl md:text-3xl font-bold text-green-600">{stat.value}</p>
                  <p className="text-slate-500 text-xs md:text-sm mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Values */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-5 md:p-6 bg-white rounded-2xl border border-slate-100 hover:border-green-100 hover:shadow-lg hover:shadow-green-50/50 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{value.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16 md:py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium mb-3">
                What We Offer
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                Loan <GradientText>Solutions</GradientText> for Every Dream
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base">
                Choose from our wide range of financial products designed to meet your unique requirements
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {offerings.map((offering, index) => (
                <motion.div
                  key={offering.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-5 md:p-6 bg-gradient-to-b from-white to-slate-50/50 rounded-2xl border border-slate-100 hover:border-green-100 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setAuthView('customer-login')}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <offering.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">{offering.title}</h3>
                      <p className="text-slate-500 text-sm mb-3 line-clamp-2">{offering.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs font-medium">{offering.amount}</span>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-xs font-medium">{offering.rate}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Unique EMI Calculator Section */}
        <section id="calculator" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 md:mb-12"
            >
              <span className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium mb-3">
                EMI Calculator
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                Plan Your <GradientText>Monthly Payments</GradientText>
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base">
                Calculate your EMI instantly and plan your finances better
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Decorative */}
              <div className="absolute -inset-4 bg-gradient-to-r from-green-100/30 via-amber-100/20 to-sky-100/30 rounded-3xl blur-2xl" />
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                {/* Loan Type Selector */}
                <div className="flex border-b border-slate-100">
                  {Object.entries(loanPresets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setCalcType(key as any);
                        setCalcRate(preset.rate);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-all ${
                        calcType === key 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-b-2 border-green-400' 
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <preset.icon className="h-4 w-4" />
                      <span className="capitalize">{key} Loan</span>
                    </button>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6 p-6 md:p-8">
                  {/* Calculator Inputs */}
                  <div className="space-y-6">
                    {/* Loan Amount */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <Label className="text-slate-600 font-medium">Loan Amount</Label>
                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-lg">
                          <IndianRupee className="h-3.5 w-3.5 text-green-500" />
                          <span className="font-semibold text-slate-800">{calcAmount.toLocaleString()}</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="10000"
                        max={loanPresets[calcType].maxAmount}
                        value={calcAmount}
                        onChange={(e) => setCalcAmount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-green-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>₹10,000</span>
                        <span>₹{(loanPresets[calcType].maxAmount / 10000000).toFixed(0)}Cr</span>
                      </div>
                    </div>

                    {/* Tenure */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <Label className="text-slate-600 font-medium">Tenure</Label>
                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-lg">
                          <Calendar className="h-3.5 w-3.5 text-sky-500" />
                          <span className="font-semibold text-slate-800">{calcTenure} months</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max={loanPresets[calcType].maxTenure}
                        value={calcTenure}
                        onChange={(e) => setCalcTenure(Number(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-sky-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>3 months</span>
                        <span>{loanPresets[calcType].maxTenure} months</span>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <Label className="text-slate-600 font-medium">Interest Rate</Label>
                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-lg">
                          <Percent className="h-3.5 w-3.5 text-amber-500" />
                          <span className="font-semibold text-slate-800">{calcRate}% p.a.</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="0.25"
                        value={calcRate}
                        onChange={(e) => setCalcRate(Number(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>5%</span>
                        <span>30%</span>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="flex flex-col justify-center">
                    {/* EMI Display */}
                    <div className="text-center mb-6">
                      <p className="text-slate-400 text-sm mb-1">Your Monthly EMI</p>
                      <div className="flex items-center justify-center gap-1">
                        <IndianRupee className="h-6 w-6 text-green-500" />
                        <span className="text-4xl md:text-5xl font-bold text-slate-800">{formatCurrency(calculatedEMI.emi).replace('₹', '')}</span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 border border-slate-100">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">Principal Amount</span>
                          <span className="font-medium text-slate-700">{formatCurrency(calcAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100">
                          <span className="text-slate-500 text-sm">Total Interest</span>
                          <span className="font-medium text-amber-600">{formatCurrency(calculatedEMI.totalInterest)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-500 text-sm font-medium">Total Amount</span>
                          <span className="font-bold text-green-600 text-lg">{formatCurrency(calculatedEMI.totalAmount)}</span>
                        </div>
                      </div>

                      {/* Visual Breakdown */}
                      <div className="mt-5">
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-500 h-full transition-all duration-500"
                            style={{ width: `${(calcAmount / calculatedEMI.totalAmount) * 100}%` }}
                          />
                          <div 
                            className="bg-gradient-to-r from-amber-400 to-amber-500 h-full transition-all duration-500"
                            style={{ width: `${(calculatedEMI.totalInterest / calculatedEMI.totalAmount) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-slate-400">Principal</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-slate-400">Interest</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => setAuthView('customer-login')}
                      className="mt-6 w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-green-200/50 hover:shadow-green-300/50 transition-all flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Apply for This Loan <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <span className="inline-block px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-medium mb-3">
                Our Services
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                Popular <GradientText>Loan Products</GradientText>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {displayServices.map((service, index) => {
                const IconComponent = typeof service.icon === 'string' ? Wallet : (service.icon || Wallet);
                return (
                  <motion.div
                    key={service.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group p-5 bg-gradient-to-b from-white to-slate-50/50 rounded-2xl border border-slate-100 hover:border-green-100 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setAuthView('customer-login')}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">{service.title}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.description}</p>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rate</span>
                        <span className="text-green-600 font-medium">{service.minInterestRate || 8}% - {service.maxInterestRate || 24}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Tenure</span>
                        <span className="text-slate-600">{service.minTenure || 6} - {service.maxTenure || 60} mo</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-green-500 font-medium text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                        Learn More <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <span className="inline-block px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-medium mb-3">
                Simple Process
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                How It <GradientText>Works</GradientText>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-rose-200 via-sky-200 to-emerald-200" />
              
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative text-center"
                >
                  <div className="relative inline-block">
                    <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm`}>
                      <step.icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-100">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-slate-500 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-white relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-medium mb-3">
                Testimonials
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                What Our <GradientText>Customers Say</GradientText>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5 md:gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 md:p-6 bg-gradient-to-b from-white to-slate-50/50 rounded-2xl border border-slate-100"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm mb-5 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white relative">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <span className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium mb-3">
                FAQ
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                Frequently Asked <GradientText>Questions</GradientText>
              </h2>
            </motion.div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-slate-100 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-700 pr-4 text-sm md:text-base">{faq.question}</span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${activeFaq === index ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {activeFaq === index ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 md:px-5 pb-4 md:pb-5 text-slate-500 text-sm leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 bg-white relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-xs font-medium mb-3">
                  Contact Us
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                  Get In <GradientText>Touch</GradientText>
                </h2>
                <p className="text-slate-500 mb-8 text-sm md:text-base">Have questions? We&apos;re here to help you 24/7</p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Call Us</p>
                      <p className="font-medium text-slate-700">+91 1800-123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-11 h-11 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                      <Mail className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Email Us</p>
                      <p className="font-medium text-slate-700">support@moneymitra.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-11 h-11 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Visit Us</p>
                      <p className="font-medium text-slate-700">Mumbai, Maharashtra, India</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-b from-slate-50 to-white p-5 md:p-6 rounded-2xl border border-slate-100"
              >
                <h3 className="font-semibold text-slate-800 mb-5">Send us a message</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label className="text-slate-600 mb-1.5 block text-sm">Full Name</Label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Enter your name"
                      className="h-11 border-slate-200 rounded-xl bg-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-600 mb-1.5 block text-sm">Email</Label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="Enter your email"
                      className="h-11 border-slate-200 rounded-xl bg-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-600 mb-1.5 block text-sm">Phone</Label>
                    <Input
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="Enter your phone"
                      className="h-11 border-slate-200 rounded-xl bg-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-slate-600 mb-1.5 block text-sm">Message</Label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Enter your message"
                      className="border-slate-200 rounded-xl min-h-[100px] bg-white"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-green-200/50 hover:shadow-green-300/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-green-50 text-sm md:text-base mb-8 max-w-xl mx-auto">
                Apply now and get your loan approved within 24 hours. Quick, easy, and hassle-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={() => setAuthView('customer-login')}
                  className="px-8 py-3.5 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all shadow-lg"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply for Loan
                </motion.button>
                <motion.button
                  onClick={() => setAuthView('staff-login')}
                  className="px-8 py-3.5 bg-white/15 border border-white/25 text-white rounded-xl font-semibold hover:bg-white/25 transition-all backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Staff Portal
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white pt-12 md:pt-16 pb-6 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden ring-1 ring-amber-300/30">
                  <Image
                    src="/upload/mmsquare.png"
                    alt="Money Mitra Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Money Mitra</h3>
                  <p className="text-[10px] text-amber-400">Financial Advisor</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your trusted partner for all financial needs. Quick, easy, and affordable loan solutions.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2.5 text-slate-400 text-sm">
                <li><a href="#about" className="hover:text-amber-400 transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-amber-400 transition-colors">Services</a></li>
                <li><a href="#calculator" className="hover:text-amber-400 transition-colors">EMI Calculator</a></li>
                <li><a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a></li>
                <li><a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4 text-sm">Our Services</h4>
              <ul className="space-y-2.5 text-slate-400 text-sm">
                <li>Personal Loan</li>
                <li>Business Loan</li>
                <li>Home Loan</li>
                <li>Gold Loan</li>
                <li>Education Loan</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-4 text-sm">Contact Info</h4>
              <ul className="space-y-2.5 text-slate-400 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-amber-400" />
                  +91 1800-123-4567
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-amber-400" />
                  support@moneymitra.com
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-amber-400 mt-0.5" />
                  Mumbai, Maharashtra, India
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} Money Mitra Financial Advisor. All rights reserved.
            </p>
            <div className="flex gap-6 text-slate-500 text-xs md:text-sm">
              <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
