import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PredictionSettingsProvider } from "@/contexts/PredictionSettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EmployeeProtectedRoute } from "@/components/EmployeeProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminPasswordLogin from "./pages/AdminPasswordLogin";
import AdminChangePassword from "./pages/AdminChangePassword";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminResetPassword from "./pages/AdminResetPassword";
import AdminPanel from "@/components/AdminPanel";
import EditInfo from "./pages/EditInfo";
import NotFound from "./pages/NotFound";
import EmployeeRegister from "./pages/EmployeeRegister";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminChangePassword from "./pages/SuperAdminChangePassword";
const queryClient = new QueryClient();
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <PredictionSettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route 
                path="/user/:areaId" 
                element={
                  <EmployeeProtectedRoute>
                    <Index />
                  </EmployeeProtectedRoute>
                } 
              />
              <Route 
                path="/user" 
                element={
                  <EmployeeProtectedRoute>
                    <Index />
                  </EmployeeProtectedRoute>
                } 
              />
              <Route path="/login" element={<AdminPasswordLogin />} />
              <Route path="/login-otp" element={<AdminLogin />} />
              <Route path="/admin/change-password" element={<AdminChangePassword />} />
              <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
              <Route path="/admin/reset-password" element={<AdminResetPassword />} />
              <Route path="/super-admin/login" element={<SuperAdminLogin />} />
              <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
              <Route path="/super-admin/change-password" element={<SuperAdminChangePassword />} />
              <Route path="/employee/register" element={<EmployeeRegister />} />
              <Route path="/employee/login" element={<EmployeeLogin />} />
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/change-password" element={<ChangePassword />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/admin-view/:areaId"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-view"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-info"
                element={
                  <ProtectedRoute>
                    <EditInfo />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PredictionSettingsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
export default App;
