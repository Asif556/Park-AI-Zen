import { Car, MapPin, Moon, Sun, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { isAuthenticated } from "@/lib/auth";
interface HeaderProps {
  activePanel: 'user' | 'admin' | 'slotmap';
  onPanelChange: (panel: 'user' | 'admin' | 'slotmap') => void;
}
const Header = ({ activePanel, onPanelChange }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const handleAdminViewClick = () => {
    navigate('/login');
  };
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Smart Parking System</h1>
              <p className="text-sm text-muted-foreground">Automated parking management using AI and IoT</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 bg-secondary p-1 rounded-lg">
              <Button
                variant={activePanel === 'user' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPanelChange('user')}
                className="transition-all duration-200"
              >
                User View
              </Button>
              <Button
                variant={activePanel === 'slotmap' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPanelChange('slotmap')}
                className="transition-all duration-200"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Slot Map
              </Button>
              <Button
                variant={activePanel === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={handleAdminViewClick}
                className="transition-all duration-200"
              >
                <ShieldCheck className="h-4 w-4 mr-1" />
                Admin View
              </Button>
            </div>
            {}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="transition-all duration-300 hover:scale-110 hover:rotate-180 relative overflow-hidden group"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {theme === 'light' ? (
                <Moon className="h-5 w-5 relative z-10" />
              ) : (
                <Sun className="h-5 w-5 relative z-10" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
