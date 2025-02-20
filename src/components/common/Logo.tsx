import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket } from 'lucide-react';

interface LogoProps {
  showSubtitle?: boolean;
}

const Logo: React.FC<LogoProps> = ({ showSubtitle = true }) => {
  const location = useLocation();
  
  const handleLogoClick = (e: React.MouseEvent) => {
    // Only handle scroll on landing page
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Link 
      to="/"
      onClick={handleLogoClick}
      className="flex items-center space-x-3 group hover:opacity-80 transition-opacity"
    >
      <Rocket className="w-8 h-8 text-secondary-600" />
      <div>
        <span className="text-2xl font-bold bg-gradient-to-r from-secondary-600 via-secondary-500 to-accent-500 text-transparent bg-clip-text">
          Propel
        </span>
        {showSubtitle && (
          <p className="text-sm text-gray-600">AI Career Assistant</p>
        )}
      </div>
    </Link>
  );
};

export default Logo;