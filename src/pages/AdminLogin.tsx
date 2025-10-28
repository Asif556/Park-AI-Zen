import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, Lock, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendOTP, verifyOTP, saveToken, isAuthenticated } from '@/lib/auth';
const SYSTEM_NAME = import.meta.env.VITE_SYSTEM_NAME || 'AI Smart Parking System';
export default function AdminLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      const response = await sendOTP(email);
      if (response.success) {
        toast.success(response.message || 'OTP sent successfully!');
        setStep('otp');
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP code');
      return;
    }
    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }
    setLoading(true);
    try {
      const response = await verifyOTP(email, otp);
      if (response.success && response.token) {
        saveToken(response.token);
        toast.success(response.message || 'Login successful!');
        setTimeout(() => {
          navigate('/admin-view', { replace: true });
        }, 500);
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    setStep('email');
    setOtp('');
  };
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center justify-center gap-2 mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ShieldCheck className="w-12 h-12 text-purple-400" />
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% auto',
              }}
            >
              {SYSTEM_NAME}
            </motion.h1>
            <p className="text-purple-300/70 text-sm">
              Secure Admin Access Portal
            </p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-xl" />
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {step === 'email' ? (
                    <motion.form
                      key="email-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleSendOTP}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                          Admin Email
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 group-focus-within:text-purple-300 transition-colors" />
                          <Input
                            type="email"
                            placeholder="abc@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-purple-300/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 hover:scale-[1.02]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-5 w-5" />
                            Send OTP
                          </>
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="otp-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleVerifyOTP}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                          Enter OTP
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 group-focus-within:text-purple-300 transition-colors" />
                          <Input
                            type="text"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            disabled={loading}
                            maxLength={6}
                            className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-purple-300/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all text-center tracking-widest text-2xl font-mono"
                          />
                        </div>
                        <p className="text-purple-300/60 text-xs mt-2 text-center">
                          OTP sent to {email}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 hover:scale-[1.02]"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-2 h-5 w-5" />
                              Verify & Login
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleBack}
                          disabled={loading}
                          className="w-full text-purple-300 hover:text-white hover:bg-white/5"
                        >
                          Back to Email
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-purple-300/50 text-xs mt-6"
          >
            Secured with MongoDB Session-Based Authentication
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
