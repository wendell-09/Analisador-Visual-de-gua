import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleDrag = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragIn = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
        className={`w-full p-8 md:p-12 border-4 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300 bg-slate-800/50 relative overflow-hidden group animate-fade-in-up
        ${isDragging 
          ? 'border-cyan-400 bg-slate-700/70 shadow-[0_0_25px_rgba(45,212,191,0.5)]' 
          : 'border-slate-700 hover:border-sky-500 hover:bg-slate-800'}`
        }
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
    >
      <div className={`absolute -inset-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 blur-2xl opacity-0 transition-opacity duration-500 ${isDragging ? 'opacity-30' : 'group-hover:opacity-10'}`}></div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpeg,.jpg,.png,.webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center relative z-10">
        <UploadIcon className="w-20 h-20 text-sky-500/70 group-hover:text-sky-400 transition-colors duration-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-100">Arraste e solte uma imagem aqui</h2>
        <p className="text-slate-400 my-2">ou</p>
        <button
            type="button"
            className="px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/40 transition-all transform hover:scale-105"
        >
          Selecione um Arquivo
        </button>
        <p className="text-xs text-slate-500 mt-6 max-w-xs">Tire uma foto nítida de um copo ou amostra de água contra um fundo neutro para melhores resultados.</p>
      </div>
    </div>
  );
};

export default ImageUploader;