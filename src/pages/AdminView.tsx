import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  Car,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Activity,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logout, getToken } from '@/lib/auth';
const SYSTEM_NAME = import.meta.env.VITE_SYSTEM_NAME || 'AI Smart Parking System';
export default function AdminView() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState<string>('');
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAdminEmail(payload.email || 'Admin');
      } catch (error) {
        setAdminEmail('Admin');
      }
    }
  }, []);
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };
  const stats = [
    {
      title: 'Total Vehicles',
      value: '1,247',
      change: '+12.5%',
      icon: Car,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Users',
      value: '892',
      change: '+8.2%',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      change: '+5.4%',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Revenue',
      value: '$45,230',
      change: '+15.3%',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
    },
  ];
  const quickActions = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Analytics', icon: BarChart3, path: '/analytics' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/5 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-xl font-bold text-white">{SYSTEM_NAME}</h1>
                <p className="text-purple-300/70 text-sm">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-medium">{adminEmail}</p>
                <p className="text-purple-300/70 text-xs">Administrator</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-purple-300 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </motion.header>
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">
                Welcome back, {adminEmail.split('@')[0]}!
              </h2>
            </div>
            <p className="text-purple-300/70">
              Here's what's happening with your parking system today.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-green-400 text-sm font-medium">
                      {stat.change}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-white text-2xl mb-1">
                    {stat.value}
                  </CardTitle>
                  <CardDescription className="text-purple-300/70">
                    {stat.title}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => navigate(action.path)}
                  className="w-full h-24 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 text-white flex flex-col gap-2 transition-all group"
                  variant="ghost"
                >
                  <action.icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <span className="font-medium">{action.title}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-purple-300/70">
                Latest system events and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New vehicle registered', time: '2 minutes ago', type: 'success' },
                  { action: 'Parking slot A-23 occupied', time: '15 minutes ago', type: 'info' },
                  { action: 'Payment received: $25.00', time: '1 hour ago', type: 'success' },
                  { action: 'System maintenance completed', time: '3 hours ago', type: 'info' },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                        }`}
                      />
                      <span className="text-white text-sm">{activity.action}</span>
                    </div>
                    <span className="text-purple-300/50 text-xs">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
