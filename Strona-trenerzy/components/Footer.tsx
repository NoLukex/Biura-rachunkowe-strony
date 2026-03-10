import React from 'react';
import { Instagram, Facebook, Globe, Dumbbell, ArrowUp } from 'lucide-react';
import currentTrainer from '../data/currentTrainer';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12 relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="flex items-center gap-2">
            <div className="bg-zinc-900 p-1.5 rounded-lg">
                <Dumbbell className="text-brand-500 w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white">
            {currentTrainer.brandName.toUpperCase()}
            </span>
        </div>

        <div className="text-zinc-500 text-sm text-center md:text-right flex flex-col md:flex-row items-center gap-6">
            <p>&copy; {year} {currentTrainer.brandName}. Wszelkie prawa zastrzezone.</p>
            <div className="flex justify-center md:justify-end gap-6">
                {currentTrainer.instagram && <a href={currentTrainer.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white transition-colors"><Instagram size={20} /></a>}
                {currentTrainer.facebook && <a href={currentTrainer.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white transition-colors"><Facebook size={20} /></a>}
                {currentTrainer.website && <a href={currentTrainer.website} target="_blank" rel="noreferrer" aria-label="Strona internetowa" className="hover:text-white transition-colors"><Globe size={20} /></a>}
                <a href="/polityka-prywatnosci.html" className="hover:text-white transition-colors">Polityka prywatnosci</a>
            </div>
            
            <button 
                onClick={scrollToTop}
                className="bg-zinc-900 hover:bg-brand-500 hover:text-black text-white p-3 rounded-full transition-all duration-300 border border-zinc-800"
                aria-label="Wróć na górę"
            >
                <ArrowUp size={20} />
            </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
