'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, Shield, Clock, Users, TrendingUp, Phone, Mail, MapPin, ArrowRight, 
  Building2, FileText, User, Lock, ChevronDown, ChevronUp, Sparkles, 
  Zap, Target, Award, CheckCircle, Play, Star, ArrowRightLeft,
  Calculator, Percent, IndianRupee, Calendar, Globe, Cpu, Database,
  Menu, X, Send, MessageSquare, HeartHandshake, Rocket, Brain
} from 'lucide-react';
import { formatCurrency, calculateEMI } from '@/utils/helpers';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import StaffLoginPage from '@/components/auth/StaffLoginPage';
import CustomerLoginPage from '@/components/auth/CustomerLoginPage';

type AuthView = 'landing' | 'staff-login' | 'customer-login';

// Animated Particle Background Component
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      radius: number; opacity: number; color: string;
    }> = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Create particles
    const colors = ['#00f5ff', '#8b5cf6', '#06b6d4', '#a855f7', '#0ea5e9'];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Draw connections
        particles.slice(i + 1).forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (1 - distance / 150) * 0.2;
            ctx.stroke();
          }
        });
      });
      
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// Floating 3D Elements
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/3 left-[10%]"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-20 h-20 border-2 border-cyan-500/30 rounded-lg backdrop-blur-sm" />
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 right-[15%]"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-16 h-16 border-2 border-purple-500/30 rounded-full backdrop-blur-sm" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/3 left-[20%]"
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg backdrop-blur-sm transform rotate-45" />
      </motion.div>
    </div>
  );
}

// Animated Counter
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView) {
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
    }
  }, [isInView, value]);
  
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Glowing Button
function GlowButton({ children, primary = true, onClick, className = '' }: { 
  children: React.ReactNode; primary?: boolean; onClick?: () => void; className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden group
        ${primary 
          ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white' 
          : 'bg-white/5 border border-white/20 text-white backdrop-blur-sm'
        }
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${primary ? 'opacity-0 group-hover:opacity-100' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 blur-xl opacity-50" />
      </div>
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

// Glass Card Component
function GlassCard({ children, className = '', hover = true }: { 
  children: React.ReactNode; className?: string; hover?: boolean;
}) {
  return (
    <motion.div
      className={`
        relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl
        ${hover ? 'hover:border-white/20 hover:bg-white/10' : ''}
        transition-all duration-300
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -5 } : undefined}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Section Wrapper with scroll animation
function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.section>
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
  const [calcTenure, setCalcTenure] =(24);
  const [calcRate, setCalcRate] =(12);
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  
  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
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
  
  // Features data
  const features = [
    { icon: Zap, title: 'Instant Approval', description: 'AI-powered approval in minutes', color: 'from-yellow-500 to-orange-500' },
    { icon: Shield, title: 'Bank-Grade Security', description: '256-bit encryption protection', color: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, title: 'Low Interest Rates', description: 'Starting from just 8.5% p.a.', color: 'from-cyan-500 to-blue-500' },
    { icon: Clock, title: '24/7 Support', description: 'Always here to help you', color: 'from-purple-500 to-pink-500' },
  ];

  // Services data
  const displayServices = services.length > 0 ? services : [
    { id: '1', title: 'Personal Loan', description: 'Quick approval for your dreams', icon: User, minInterestRate: 10, maxInterestRate: 18, minTenure: 6, maxTenure: 60, minAmount: 50000, maxAmount: 5000000, color: 'from-cyan-500 to-blue-500' },
    { id: '2', title: 'Business Loan', description: 'Fuel your business growth', icon: Building2, minInterestRate: 12, maxInterestRate: 20, minTenure: 12, maxTenure: 84, minAmount: 100000, maxAmount: 10000000, color: 'from-purple-500 to-pink-500' },
    { id: '3', title: 'Instant Loan', description: 'Get funds in 5 minutes', icon: Zap, minInterestRate: 15, maxInterestRate: 24, minTenure: 3, maxTenure: 36, minAmount: 10000, maxAmount: 500000, color: 'from-yellow-500 to-orange-500' },
  ];

  // How it works steps
  const steps = [
    { icon: FileText, title: 'Apply Online', description: 'Fill our simple 2-minute application form', step: '01' },
    { icon: Brain, title: 'AI Processing', description: 'Our AI analyzes your profile instantly', step: '02' },
    { icon: Wallet, title: 'Get Funds', description: 'Money in your account within 24 hours', step: '03' },
  ];

  // Testimonials
  const testimonials = [
    { name: 'Rahul Sharma', role: 'Business Owner', content: 'Got my business loan approved in just 2 hours. The AI-powered process is incredibly fast!', rating: 5 },
    { name: 'Priya Patel', role: 'Software Engineer', content: 'Best interest rates I found. The entire process was digital and paperless.', rating: 5 },
    { name: 'Amit Kumar', role: 'Entrepreneur', content: 'The support team helped me understand all options. Highly recommend!', rating: 5 },
  ];

  // FAQs
  const faqs = [
    { question: 'How quickly can I get a loan approved?', answer: 'Our AI-powered system can approve loans in as little as 5 minutes for pre-qualified customers. Most loans are approved within 24 hours.' },
    { question: 'What documents do I need to apply?', answer: 'You only need your PAN card, Aadhaar card, and bank statements for the last 3 months. Our digital process makes it completely paperless.' },
    { question: 'Can I prepay my loan without penalties?', answer: 'Yes! We offer zero prepayment charges after 6 months of regular EMI payments. You can save on interest by paying early.' },
    { question: 'How is the interest rate determined?', answer: 'Our AI analyzes your credit profile, income stability, and repayment capacity to offer you the best personalized rate.' },
  ];

  // Contact form submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitting(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
    // Show success message (you can add toast here)
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <ParticleBackground />
        <FloatingElements />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-900/20 to-transparent" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-50" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">SMFC Finance</h1>
                <p className="text-xs text-gray-500">Future of Lending</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-400 hover:text-white transition-colors text-sm">Services</a>
              <a href="#calculator" className="text-gray-400 hover:text-white transition-colors text-sm">Calculator</a>
              <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm">Testimonials</a>
              <a href="#faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <motion.button
                onClick={() => setAuthView('staff-login')}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/20 rounded-lg hover:bg-white/5 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Staff Login
              </motion.button>
              <motion.button
                onClick={() => setAuthView('customer-login')}
                className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Customer Login
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#services" className="block text-gray-300 hover:text-white py-2">Services</a>
                <a href="#calculator" className="block text-gray-300 hover:text-white py-2">Calculator</a>
                <a href="#testimonials" className="block text-gray-300 hover:text-white py-2">Testimonials</a>
                <a href="#faq" className="block text-gray-300 hover:text-white py-2">FAQ</a>
                <a href="#contact" className="block text-gray-300 hover:text-white py-2">Contact</a>
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <button
                    onClick={() => setAuthView('staff-login')}
                    className="w-full py-3 text-gray-300 border border-white/20 rounded-lg"
                  >
                    Staff Login
                  </button>
                  <button
                    onClick={() => setAuthView('customer-login')}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium"
                  >
                    Customer Login
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-gray-300">AI-Powered Digital Lending Platform</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">Fast & Smart</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Loans for the Future</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10"
              >
                Experience the next generation of lending with instant approvals, 
                AI-powered processing, and rates personalized just for you.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <GlowButton onClick={() => setAuthView('customer-login')}>
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </GlowButton>
                <GlowButton primary={false} onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Calculator className="mr-2 h-5 w-5" /> Calculate EMI
                </GlowButton>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-16 flex flex-wrap justify-center gap-8 text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cyan-500" />
                  <span className="text-sm">24hr Approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">RBI Registered</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
              <motion.div
                className="w-1 h-3 bg-white/50 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <AnimatedSection className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: stats.totalLoans || 10000, label: 'Loans Disbursed', icon: FileText, suffix: '+' },
                { value: stats.totalDisbursed || 500, label: 'Cr+ Disbursed', icon: IndianRupee },
                { value: stats.activeCustomers || 50000, label: 'Happy Customers', icon: Users, suffix: '+' },
                { value: stats.companies || 100, label: 'Partner Companies', icon: Building2, suffix: '+' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                    <stat.icon className="h-8 w-8 text-cyan-400" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-gray-500 text-sm mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Features Section */}
        <AnimatedSection className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
              >
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Why Choose Us</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Future-Ready Features
                </span>
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full group cursor-pointer">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Loan Services Section */}
        <AnimatedSection id="services" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
              >
                <Target className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-300">Our Products</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold"
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Loan Services
                </span>
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {displayServices.map((product, index) => {
                const Icon = product.icon || Wallet;
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <GlassCard className="p-8 h-full group cursor-pointer" onClick={() => setAuthView('customer-login')}>
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${product.color || 'from-cyan-500 to-blue-500'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                      <p className="text-gray-400 mb-6">{product.description}</p>
                      
                      {/* Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-500 text-sm">Interest Rate</span>
                          <span className="text-cyan-400 font-medium">{product.minInterestRate || 8}% - {product.maxInterestRate || 24}%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-gray-500 text-sm">Tenure</span>
                          <span className="text-white">{product.minTenure || 6} - {product.maxTenure || 60} months</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-500 text-sm">Amount</span>
                          <span className="text-white">₹{(product.minAmount || 10000).toLocaleString()} - ₹{(product.maxAmount || 10000000).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* CTA */}
                      <button className="w-full py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10 rounded-xl font-medium hover:from-cyan-500/30 hover:to-purple-500/30 transition-all flex items-center justify-center gap-2">
                        Apply Now <ArrowRight className="h-4 w-4" />
                      </button>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* How It Works Section */}
        <AnimatedSection className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
              >
                <Rocket className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-gray-300">Simple Process</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold"
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  How It Works
                </span>
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 -translate-y-1/2" />
              
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <GlassCard className="p-8 text-center relative z-10">
                    {/* Step number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6">
                      <step.icon className="h-10 w-10 text-cyan-400" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* EMI Calculator Section */}
        <AnimatedSection id="calculator" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Calculator */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Calculator className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">EMI Calculator</h3>
                      <p className="text-gray-400 text-sm">Calculate your monthly payments</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Loan Amount */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-300">Loan Amount</label>
                        <span className="text-cyan-400 font-bold">₹{calcAmount.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="10000"
                        max="10000000"
                        step="10000"
                        value={calcAmount}
                        onChange={(e) => setCalcAmount(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹10,000</span>
                        <span>₹1,00,00,000</span>
                      </div>
                    </div>

                    {/* Tenure */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-300">Tenure (Months)</label>
                        <span className="text-cyan-400 font-bold">{calcTenure} months</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="84"
                        value={calcTenure}
                        onChange={(e) => setCalcTenure(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>3 months</span>
                        <span>84 months</span>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-gray-300">Interest Rate (% p.a.)</label>
                        <span className="text-cyan-400 font-bold">{calcRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="0.5"
                        value={calcRate}
                        onChange={(e) => setCalcRate(Number(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5%</span>
                        <span>30%</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Right - Results */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Your Monthly EMI
                  </span>
                </h2>
                <p className="text-gray-400 mb-8">
                  See how much you'll pay each month based on your loan amount, tenure, and interest rate.
                </p>

                <div className="space-y-4">
                  {/* EMI Amount */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                    <p className="text-gray-400 text-sm mb-1">Monthly EMI</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      ₹{calculatedEMI?.emi?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}
                    </p>
                  </div>

                  {/* Total Interest & Amount */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-gray-500 text-xs mb-1">Total Interest</p>
                      <p className="text-xl font-bold text-purple-400">
                        ₹{calculatedEMI?.totalInterest?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-gray-500 text-xs mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-cyan-400">
                        ₹{calculatedEMI?.totalAmount?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}
                      </p>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => setAuthView('customer-login')}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-6"
                  >
                    Apply for this Loan <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Testimonials Section */}
        <AnimatedSection id="testimonials" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
              >
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">Customer Stories</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold"
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  What Our Customers Say
                </span>
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    
                    {/* Content */}
                    <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-lg font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Trust Partners */}
        <AnimatedSection className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-gray-500 text-sm uppercase tracking-wider">Trusted by Leading Organizations</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
              {['RBI Registered', 'ISO 27001', 'SSL Secured', 'PCI DSS', 'GDPR Compliant'].map((partner, i) => (
                <motion.div
                  key={partner}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="px-6 py-3 border border-white/10 rounded-lg text-gray-400 text-sm"
                >
                  {partner}
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* FAQ Section */}
        <AnimatedSection id="faq" className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
              >
                <MessageSquare className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-gray-300">FAQ</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold"
              >
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </span>
              </motion.h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full p-6 bg-white/5 border border-white/10 rounded-xl text-left hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: activeFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {activeFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-400 pt-4 border-t border-white/10 mt-4">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection id="contact" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Get in Touch
                  </span>
                </h2>
                <p className="text-gray-400 mb-8">
                  Have questions? We're here to help. Reach out to our team for personalized assistance.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: Phone, label: 'Phone', value: '+91 1800-123-4567' },
                    { icon: Mail, label: 'Email', value: 'support@smfc.com' },
                    { icon: MapPin, label: 'Address', value: '123 Finance Street, Mumbai, MH 400001' },
                    { icon: Clock, label: 'Hours', value: '24/7 Customer Support' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">{item.label}</p>
                        <p className="font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-8">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Full Name</Label>
                      <Input
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 mb-2 block">Email</Label>
                        <Input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2 block">Phone</Label>
                        <Input
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Message</Label>
                      <Textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[120px]"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <RefreshCw className="h-5 w-5" />
                          </motion.div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <GlassCard className="p-12 text-center relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Ready to Transform Your
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Financial Future?</span>
                  </h2>
                  <p className="text-gray-400 text-lg mb-8">
                    Join thousands of satisfied customers who chose SMFC Finance for their lending needs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <GlowButton onClick={() => setAuthView('customer-login')}>
                      Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                    </GlowButton>
                    <GlowButton primary={false} onClick={() => setAuthView('staff-login')}>
                      Staff Portal
                    </GlowButton>
                  </div>
                </motion.div>
              </div>
            </GlassCard>
          </div>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">SMFC Finance</span>
              </div>
              <p className="text-gray-500 text-sm">
                The future of digital lending. Fast, secure, and intelligent loan solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#calculator" className="hover:text-white transition-colors">EMI Calculator</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Personal Loan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business Loan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instant Loan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Home Loan</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Grievance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 SMFC Finance. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Import RefreshCw for loading spinner
import { RefreshCw } from 'lucide-react';
