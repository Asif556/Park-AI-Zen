import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PredictionSettingsProvider } from "@/contexts/PredictionSettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "@/components/AdminPanel";
import EditInfo from "./pages/EditInfo";
import NotFound from "./pages/NotFound";
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
              <Route path="/user" element={<Index />} />
              <Route path="/login" element={<AdminLogin />} />
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
