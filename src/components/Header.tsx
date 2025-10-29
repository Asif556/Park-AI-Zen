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
    <header className="bg-card/95 border-b border-border shadow-sm sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
            <div className="p-1.5 sm:p-2 bg-primary rounded-lg flex-shrink-0">
              <Car className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 lg:flex-none min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground truncate">
                AI Smart Parking System
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block truncate">
                Automated parking management using AI and IoT
              </p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-center lg:justify-end">
            {/* Panel Navigation */}
            <div className="flex gap-1 sm:gap-2 bg-secondary p-0.5 sm:p-1 rounded-lg overflow-x-auto scrollbar-hide">
              <Button
                variant={activePanel === 'user' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPanelChange('user')}
                className="transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 whitespace-nowrap"
              >
                <span className="hidden sm:inline">User View</span>
                <span className="sm:hidden">User</span>
              </Button>
              <Button
                variant={activePanel === 'slotmap' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPanelChange('slotmap')}
                className="transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 whitespace-nowrap"
              >
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden md:inline">Slot Map</span>
                <span className="md:hidden">Slots</span>
              </Button>
              <Button
                variant={activePanel === 'admin' ? 'default' : 'ghost'}
                size="sm"
                onClick={handleAdminViewClick}
                className="transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 whitespace-nowrap"
              >
                <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden md:inline">Admin View</span>
                <span className="md:hidden">Admin</span>
              </Button>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="transition-all duration-300 hover:scale-110 hover:rotate-180 relative overflow-hidden group h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 flex-shrink-0"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {theme === 'light' ? (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5 relative z-10" />
              ) : (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5 relative z-10" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
