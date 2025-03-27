import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-white text-lg">Carregando...</div>
      </div>
    </div>
  );
};

export default LoadingScreen;