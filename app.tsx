
import React from 'react';
import CardiacFunctionSimulator from './components/CardiacFunctionSimulator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-gray-100 flex flex-col items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400">
          Simulador de Curva de Función Cardíaca
        </h1>
        <p className="mt-2 text-lg text-slate-300">
          Explora la Ley de Frank-Starling de forma interactiva.
        </p>
      </header>
      <main className="w-full max-w-4xl">
        <CardiacFunctionSimulator />
      </main>
      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Simulación Fisiológica Interactiva. Inspirado en la fisiología cardíaca.</p>
      </footer>
    </div>
  );
};

export default App;
