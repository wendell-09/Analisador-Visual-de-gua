import React from 'react';
import { WaterDropIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/60 backdrop-blur-xl border-b border-sky-400/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center text-center">
        <WaterDropIcon className="w-10 h-10 text-cyan-400 mr-4" />
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">
                Analisador Visual de Água
            </h1>
            <p className="text-sm text-slate-400 font-medium">BETA EXPERIMENTAL</p>
        </div>
      </div>
    </header>
  );
};

export default Header;