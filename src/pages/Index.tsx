import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import UserPanel from "@/components/UserPanel";
import AdminPanel from "@/components/AdminPanel";
import SlotMap from "@/components/SlotMap";
const Index = () => {
  const [activePanel, setActivePanel] = useState<'user' | 'admin' | 'slotmap'>('user');
  const navigate = useNavigate();
  const handleChatbotClick = () => {
    toast.info('Login Required', {
      description: 'Please login to access the AI Assistant...',
      duration: 2000,
    });
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>
      <Header activePanel={activePanel} onPanelChange={setActivePanel} />
      <main className="transition-all duration-300 ease-in-out animate-fade-in">
        {activePanel === 'user' && <UserPanel onNavigateToChatbot={handleChatbotClick} />}
        {activePanel === 'admin' && <AdminPanel />}
        {activePanel === 'slotmap' && <SlotMap onNavigateToChatbot={handleChatbotClick} />}
      </main>
    </div>
  );
};
export default Index;
