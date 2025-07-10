import React, { useState, useCallback, useEffect } from 'react';
import { AppState, type AnalysisData } from './types';
import { analyzeWaterImage } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import Spinner from './components/Spinner';
import SplashScreen from './components/SplashScreen';
import { ErrorIcon } from './components/icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIALIZING);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appState === AppState.INITIALIZING) {
      const timer = setTimeout(() => {
        setAppState(AppState.IDLE);
      }, 3000); // Splash screen for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [appState]);


  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return;

    setAppState(AppState.ANALYZING);
    setImageFile(file);
    setError(null);
    setAnalysisResult(null);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const result = await analyzeWaterImage(file);
      setAnalysisResult(result);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
      setError(`Falha na análise. ${errorMessage}`);
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setAppState(AppState.IDLE);
    setImageFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.ANALYZING:
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center animate-fade-in">
             {previewUrl && (
                <img src={previewUrl} alt="Amostra de água" className="max-h-60 w-auto rounded-lg shadow-lg mb-8 shadow-black/30" />
            )}
            <Spinner />
            <p className="text-lg text-slate-300 mt-6">Analisando a imagem... Por favor, aguarde.</p>
            <p className="text-sm text-slate-500 mt-1">A IA está processando os detalhes visuais.</p>
          </div>
        );
      case AppState.RESULT:
        return analysisResult && previewUrl && (
          <AnalysisResult result={analysisResult} imageUrl={previewUrl} onReset={handleReset} />
        );
      case AppState.ERROR:
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl shadow-xl shadow-black/30 animate-fade-in">
            <ErrorIcon className="w-16 h-16 text-red-400 mb-4" />
            <h3 className="text-2xl font-bold text-red-300 mb-2">Ocorreu um Erro</h3>
            <p className="text-slate-300 mb-6 max-w-md">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-md hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105"
            >
              Tentar Novamente
            </button>
          </div>
        );
      case AppState.IDLE:
      default:
        return <ImageUploader onImageUpload={handleImageUpload} />;
    }
  };

  if (appState === AppState.INITIALIZING) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-slate-500/80">
        <p>Aviso: Esta é uma ferramenta experimental. A análise é uma estimativa visual e não substitui testes laboratoriais profissionais.</p>
      </footer>
    </div>
  );
};

export default App;