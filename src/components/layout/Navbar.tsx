import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, User } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';
import AuthModal from '../auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  showDemoWarning?: boolean;
  variant?: 'app' | 'landing';
}

const Navbar: React.FC<NavbarProps> = ({ 
  showDemoWarning = false,
  variant = 'app'
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut, loading, isGuest } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    // Only handle scroll on landing page
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <>
      <nav className={`bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 ${variant === 'landing' ? 'bg-white/80 backdrop-blur-md' : ''} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            
            <div className="flex items-center space-x-4">
              {variant === 'landing' && (
                <div className="hidden md:flex items-center space-x-8">
                  <a 
                    href="#features" 
                    onClick={(e) => handleNavClick(e, 'features')}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Features
                  </a>
                  <Link 
                    to="/pricing"
                    onClick={(e) => {
                      if (location.pathname === '/pricing') {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Pricing
                  </Link>
                  <a 
                    href="#how-it-works" 
                    onClick={(e) => handleNavClick(e, 'how-it-works')}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    How it Works
                  </a>
                </div>
              )}

              {showDemoWarning && (
                <div className="flex items-center text-amber-600 bg-amber-50 px-4 py-2 rounded-lg transition-all duration-300">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <span className="text-sm">Demo Mode: API key not set</span>
                </div>
              )}

              {!loading && (
                user || isGuest ? (
                  <div className="flex items-center space-x-4">
                    {isGuest && (
                      <span className="text-sm text-gray-600">Guest Mode</span>
                    )}
                    {!isDashboard && (
                      <Link to="/dashboard">
                        <Button variant="secondary" size="sm">
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    {isDashboard && (
                      <Link to="/app">
                        <Button variant="secondary" size="sm">
                          Generate Message
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      icon={User}
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Sign In
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
