import React from 'react';
import { WaterDropIcon } from './icons';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="flex flex-col items-center">
        <div className="animate-breathe">
            <WaterDropIcon className="w-24 h-24 text-cyan-400 mx-auto" />
        </div>
        <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">
              Analisador Visual de Água
            </h1>
        </div>
        <div className="mt-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <p className="text-slate-400">Inicializando sistema de IA...</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;