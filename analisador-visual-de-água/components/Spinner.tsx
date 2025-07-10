import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-slate-700/50 border-t-cyan-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;