
import React from 'react';

interface HeaderProps {
  onReset: () => void;
  onNavigate: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={onReset}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white text-2xl font-bold italic">M</span>
            </div>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500 uppercase tracking-tighter italic">
              MelodyGift AI
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('how-it-works')}
              className="text-slate-600 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              How it works
            </button>
            <button 
              onClick={() => onNavigate('pricing')}
              className="text-slate-600 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={onReset}
              className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
            >
              Start Free
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
