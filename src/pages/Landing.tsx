import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Car, 
  Sparkles, 
  Zap, 
  Shield, 
  Clock, 
  TrendingUp, 
  Brain,
  MapPin,
  CreditCard,
  ChevronRight,
  Star,
  CheckCircle2,
  Crown,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001
  });

  const opacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.15], [1, 0.9]);
  const heroY = useTransform(smoothProgress, [0, 0.25], [0, -150]);
  const featuresY = useTransform(smoothProgress, [0.1, 0.35], [80, 0]);
  const statsY = useTransform(smoothProgress, [0.3, 0.55], [80, 0]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Smart predictions and real-time analytics for optimal parking management",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Live parking availability and instant notifications for seamless experience",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "End-to-end encryption and secure payment processing for your peace of mind",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Detailed insights and predictive analytics to maximize efficiency",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: MapPin,
      title: "3D Visualization",
      description: "Interactive 3D parking lot maps for easy navigation and spot selection",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: CreditCard,
      title: "Easy Payments",
      description: "Multiple payment options with instant confirmation and digital receipts",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const stats = [
    { value: "99.9%", label: "Uptime", icon: Zap },
    { value: "50K+", label: "Active Users", icon: Star },
    { value: "1M+", label: "Parking Sessions", icon: Car },
    { value: "4.9/5", label: "User Rating", icon: CheckCircle2 }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* 3D Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950" />
        
        {/* 3D Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center center',
          }} />
        </div>

        {/* Animated Gradient Orbs */}
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-2xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-2xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* 3D Floating Particles - Reduced count */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* 3D Geometric Shapes - Simplified */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-24 h-24 border-2 border-purple-500/20 rounded-lg"
          animate={{
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Animated Gradient Waves - Optimized */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)"
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY, opacity, scale }}
        className="relative min-h-screen flex items-center justify-center px-4"
      >
        {/* Simplified 3D Floating Elements */}
        <div className="absolute inset-0 overflow-hidden" style={{ perspective: "1000px" }}>
          {/* Reduced floating cards */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`card-${i}`}
              className="absolute"
              style={{
                left: `${20 + i * 30}%`,
                top: `${25 + i * 20}%`,
              }}
              animate={{
                y: [0, -30, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30" />
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            {/* Simplified Car Icon */}
            <div className="relative inline-block mb-4">
              {/* Outer Glow Ring */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-lg opacity-50"
                style={{ width: "120%", height: "120%", left: "-10%", top: "-10%" }}
              />
              
              {/* Main Icon Container */}
              <motion.div
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="relative"
              >
                <div className="p-4 bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 rounded-2xl shadow-2xl relative z-10">
                  <Car className="w-12 h-12 text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Park AI Zen
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto"
          >
            Experience the future of parking management with AI-powered insights,
            real-time analytics, and seamless user experience
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
          >
            {/* Premium Super Admin Button */}
            <Button
              size="lg"
              onClick={() => navigate("/super-admin/login")}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white px-10 py-7 text-lg font-bold rounded-2xl shadow-2xl shadow-purple-500/60 transition-all duration-500 hover:shadow-purple-500/90 hover:scale-110 border-2 border-purple-300/50 hover:border-purple-200"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 animate-pulse opacity-20"></span>
              <span className="absolute -top-1 -right-1 w-4 h-4">
                <span className="absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75 animate-ping"></span>
                <span className="absolute inline-flex rounded-full h-4 w-4 bg-purple-400"></span>
              </span>
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform animate-pulse" />
                Super Admin
                <Sparkles className="w-6 h-6 group-hover:-rotate-12 transition-transform animate-pulse" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
            </Button>

            {/* Premium Admin Login Button */}
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="group relative overflow-hidden bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-slate-900 px-10 py-7 text-lg font-bold rounded-2xl shadow-2xl shadow-amber-500/60 transition-all duration-500 hover:shadow-amber-500/90 hover:scale-110 border-2 border-amber-300/50 hover:border-amber-200"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 animate-pulse opacity-20"></span>
              <span className="absolute -top-1 -right-1 w-4 h-4">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75 animate-ping"></span>
                <span className="absolute inline-flex rounded-full h-4 w-4 bg-amber-300"></span>
              </span>
              <span className="relative z-10 flex items-center gap-3">
                <Crown className="w-6 h-6 group-hover:rotate-12 transition-transform animate-pulse" />
                Admin Portal
                <Crown className="w-6 h-6 group-hover:-rotate-12 transition-transform animate-pulse" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
            </Button>

            {/* Employee Login Button */}
            <Button
              size="lg"
              onClick={() => navigate("/employee/login")}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:shadow-blue-500/70 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                <User className="w-5 h-5" />
                Employee Login
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-4 justify-center items-center text-sm text-slate-400"
          >
            <span>New employee?</span>
            <button
              onClick={() => navigate("/employee/register")}
              className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors"
            >
              Register here
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex justify-center gap-8"
          >
            {[1, 2, 3, 4, 5].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-purple-400 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-purple-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        style={{ y: featuresY }}
        className="relative py-32 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Cutting-edge technology meets seamless user experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <Card className="p-6 bg-slate-900/50 border-slate-800 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm h-full relative overflow-hidden">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 mb-4 transition-all duration-300`}
                      whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <feature.icon className="w-full h-full text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        style={{ y: statsY }}
        className="relative py-32 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-3xl p-12 backdrop-blur-sm border border-purple-500/20 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(45deg, rgba(139, 92, 246, 0.2) 25%, transparent 25%),
                  linear-gradient(-45deg, rgba(139, 92, 246, 0.2) 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, rgba(139, 92, 246, 0.2) 75%),
                  linear-gradient(-45deg, transparent 75%, rgba(139, 92, 246, 0.2) 75%)
                `,
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
              }} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="text-center group"
                >
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-purple-400 group-hover:text-pink-400 transition-colors" />
                  <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-lg">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative py-32 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-50" />
            <div className="relative bg-slate-900/80 border border-purple-500/30 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ready to Transform Your Parking Experience?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already experiencing the future of smart parking
              </p>
              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/user")}
                  className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-xl rounded-full shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:shadow-purple-500/70"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Your Journey
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Car className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Park AI Zen
            </span>
          </div>
          <p className="text-slate-400">
            © 2025 Park AI Zen. All rights reserved. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
