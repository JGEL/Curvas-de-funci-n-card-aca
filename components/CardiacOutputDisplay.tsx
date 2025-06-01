
import React from 'react';

interface CardiacOutputDisplayProps {
  co: number;
  sv: number;
  hr: number;
}

const CardiacOutputDisplay: React.FC<CardiacOutputDisplayProps> = ({ co, sv, hr }) => {
  return (
    <div className="space-y-3 p-4 bg-slate-600/50 rounded-lg">
      <div>
        <h3 className="text-sm font-medium text-slate-300">Gasto Cardíaco (CO):</h3>
        <p className="text-2xl font-bold text-sky-400">
          {co.toFixed(2)} <span className="text-lg font-normal text-slate-300">L/min</span>
        </p>
      </div>
       <div>
        <h3 className="text-sm font-medium text-slate-300">Volumen Sistólico (SV):</h3>
        <p className="text-lg font-bold text-sky-400">
          {sv.toFixed(1)} <span className="text-base font-normal text-slate-300">mL/latido</span>
        </p>
      </div>
       <div>
        <h3 className="text-sm font-medium text-slate-300">Frecuencia Cardíaca (HR):</h3>
        <p className="text-lg font-bold text-sky-400">
          {hr.toFixed(0)} <span className="text-base font-normal text-slate-300">latidos/min</span>
        </p>
      </div>
    </div>
  );
};

export default CardiacOutputDisplay;
