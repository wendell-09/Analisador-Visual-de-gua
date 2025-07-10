import React from 'react';
import { type AnalysisData, type AnalysisDetail } from '../types';
import { AlgaeIcon, ColorIcon, ResidueIcon, TurbidityIcon, CheckCircleIcon, WarningIcon, ExclamationTriangleIcon, QuoteIcon } from './icons';

interface AnalysisResultProps {
  result: AnalysisData;
  imageUrl: string;
  onReset: () => void;
}

const getLevelStyles = (level: AnalysisDetail['nivel']): { border: string, text: string, icon: React.ReactNode } => {
    switch (level) {
        case 'Baixo':
        case 'Normal':
            return { 
                border: 'border-t-green-500', 
                text: 'text-green-400', 
                icon: <CheckCircleIcon className="w-5 h-5 text-green-500" /> 
            };
        case 'Médio':
            return { 
                border: 'border-t-yellow-500', 
                text: 'text-yellow-400',
                icon: <WarningIcon className="w-5 h-5 text-yellow-500" /> 
            };
        case 'Alto':
            return { 
                border: 'border-t-red-500', 
                text: 'text-red-400',
                icon: <ExclamationTriangleIcon className="w-5 h-5 text-red-500" /> 
            };
        default:
            return { 
                border: 'border-t-slate-600', 
                text: 'text-slate-300', 
                icon: null 
            };
    }
};

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    detail: AnalysisDetail;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, detail }) => {
    const { border, text, icon: levelIcon } = getLevelStyles(detail.nivel);
    return (
        <div className={`bg-slate-800/70 p-4 rounded-lg shadow-md border border-slate-700 border-t-4 transition-all hover:bg-slate-800 hover:shadow-lg hover:border-slate-600 ${border}`}>
            <div className="flex items-center mb-3">
                {icon}
                <h4 className="font-bold text-slate-100 ml-3">{title}</h4>
            </div>
            <div className="flex items-center mb-2">
                {levelIcon}
                <p className={`font-semibold ml-2 ${text}`}>{detail.nivel}</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{detail.descricao}</p>
        </div>
    );
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, imageUrl, onReset }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl shadow-black/30 w-full animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            <div className="lg:col-span-2 flex flex-col items-center">
                <h3 className="text-xl font-bold text-slate-100 mb-4 text-center">Sua Amostra</h3>
                <div className="w-full aspect-square rounded-lg shadow-lg shadow-black/30 overflow-hidden border-2 border-slate-700">
                    <img src={imageUrl} alt="Amostra de água analisada" className="w-full h-full object-cover" />
                </div>
            </div>
            <div className="lg:col-span-3 flex flex-col">
                <h3 className="text-xl font-bold text-slate-100 mb-4 text-center lg:text-left">Resultado da Análise Visual</h3>
                
                <div className="bg-gradient-to-tr from-sky-900/50 to-sky-800/40 p-4 rounded-lg mb-6 border border-sky-700/50 shadow-inner shadow-black/20 relative">
                    <QuoteIcon className="absolute top-2 left-2 w-8 h-8 text-sky-600/50" />
                    <h4 className="font-semibold text-sky-300 mb-1 pl-2">Sumário da IA</h4>
                    <p className="text-base text-sky-200/90 leading-relaxed italic">{result.sumario}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoCard icon={<TurbidityIcon className="w-7 h-7 text-sky-400" />} title="Turbidez" detail={result.turbidez} />
                    <InfoCard icon={<AlgaeIcon className="w-7 h-7 text-green-400" />} title="Algas" detail={result.algas} />
                    <InfoCard icon={<ColorIcon className="w-7 h-7 text-amber-400" />} title="Cor" detail={result.cor} />
                    <InfoCard icon={<ResidueIcon className="w-7 h-7 text-slate-400" />} title="Resíduos" detail={result.residuos} />
                </div>
            </div>
        </div>
        <div className="text-center mt-10">
            <button
                onClick={onReset}
                className="px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/40 transition-all transform hover:scale-105"
            >
                Analisar Outra Amostra
            </button>
        </div>
    </div>
  );
};

export default AnalysisResult;