import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Crown, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8011/api/super-admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store super admin token and data
        localStorage.setItem('super_admin_token', data.token);
        localStorage.setItem('super_admin_data', JSON.stringify(data.super_admin));

        // Check if password needs to be changed
        if (!data.super_admin.password_changed) {
          alert('⚠️ You are using the default password. Please change it immediately for security!');
          navigate('/super-admin/change-password');
        } else {
          navigate('/super-admin/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <Card className="w-full max-w-md relative border-purple-500/50 shadow-2xl shadow-purple-500/20 bg-gradient-to-br from-slate-900 to-slate-800">
        <CardHeader className="space-y-4">
          <div className="mx-auto bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 p-4 rounded-2xl shadow-lg animate-pulse">
            <Crown className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Super Admin Portal
              <Sparkles className="w-6 h-6 text-purple-400" />
            </CardTitle>
            <CardDescription className="text-slate-400">
              Supreme access to parking management system
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-500/50 bg-red-950/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="superadmin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-slate-800/50 border-purple-500/30 text-white placeholder:text-slate-500 focus:border-purple-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-500/50 transition-all duration-300 hover:shadow-purple-500/70 hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚡</span>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Access Supreme Control
                </span>
              )}
            </Button>

            <div className="text-center text-sm space-y-2 pt-2">
              <Link
                to="/"
                className="text-purple-400 hover:text-purple-300 transition-colors underline"
              >
                ← Back to Landing Page
              </Link>
            </div>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col gap-2 text-xs text-slate-500 border-t border-slate-700/50">
          <p className="flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Super Admin • Full System Control
          </p>
          <p className="text-center">
            Default credentials: <code className="text-purple-400">super123</code> (Change immediately!)
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
