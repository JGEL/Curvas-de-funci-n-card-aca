
import React, { useState, useMemo, useCallback } from 'react';
import {  
  DEFAULT_CARDIAC_PARAMS, 
  POSITIVE_INOTROPY_CARDIAC_PARAMS, 
  INCREASED_AFTERLOAD_CARDIAC_PARAMS,
  generateCurveData, 
  calculateCardiacOutput } from '../services/cardiacModel';
import type { DataPoint, CardiacParams } from '../types';
import EDVSlider from './EDVslider.tsx';
import CardiacOutputDisplay from './CardiacOutputDisplay';
import FrankStarlingChart from './FrankStarlingChart.tsx';

const MIN_EDV_SLIDER = 50; // mL
const MAX_EDV_SLIDER = 280; // mL
const INITIAL_EDV = 120; // mL

const CardiacFunctionSimulator: React.FC = () => {
  const [edv, setEdv] = useState<number>(INITIAL_EDV);
  
  const [baselineParams] = useState<CardiacParams>(DEFAULT_CARDIAC_PARAMS);
  const [inotropyParams] = useState<CardiacParams>(POSITIVE_INOTROPY_CARDIAC_PARAMS);
  const [afterloadParams] = useState<CardiacParams>(INCREASED_AFTERLOAD_CARDIAC_PARAMS);

  const baselineCurveData = useMemo(() => {
    return generateCurveData(baselineParams, MIN_EDV_SLIDER, MAX_EDV_SLIDER, 100);
  }, [baselineParams]);

  const inotropyCurveData = useMemo(() => {
    return generateCurveData(inotropyParams, MIN_EDV_SLIDER, MAX_EDV_SLIDER, 100);
  }, [inotropyParams]);

  const afterloadCurveData = useMemo(() => {
    return generateCurveData(afterloadParams, MIN_EDV_SLIDER, MAX_EDV_SLIDER, 100);
  }, [afterloadParams]);

  const currentBaselineValues = useMemo(() => {
    return calculateCardiacOutput(edv, baselineParams);
  }, [edv, baselineParams]);

  const currentInotropyValues = useMemo(() => {
    return calculateCardiacOutput(edv, inotropyParams);
  }, [edv, inotropyParams]);

  const currentAfterloadValues = useMemo(() => {
    return calculateCardiacOutput(edv, afterloadParams);
  }, [edv, afterloadParams]);

  const currentBaselinePointForChart: DataPoint = useMemo(() => ({
    edv: parseFloat(edv.toFixed(1)),
    co: parseFloat(currentBaselineValues.co.toFixed(2)),
    sv: parseFloat(currentBaselineValues.sv.toFixed(1)),
  }), [edv, currentBaselineValues]);

  const currentInotropyPointForChart: DataPoint = useMemo(() => ({
    edv: parseFloat(edv.toFixed(1)),
    co: parseFloat(currentInotropyValues.co.toFixed(2)),
    sv: parseFloat(currentInotropyValues.sv.toFixed(1)),
  }), [edv, currentInotropyValues]);
  
  const currentAfterloadPointForChart: DataPoint = useMemo(() => ({
    edv: parseFloat(edv.toFixed(1)),
    co: parseFloat(currentAfterloadValues.co.toFixed(2)),
    sv: parseFloat(currentAfterloadValues.sv.toFixed(1)),
  }), [edv, currentAfterloadValues]);

  const handleEdvChange = useCallback((newEdv: number) => {
    setEdv(newEdv);
  }, []);

  return (
    <div className="bg-slate-800 shadow-2xl rounded-xl p-6 md:p-8 space-y-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6 bg-slate-700 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-sky-400 border-b border-slate-600 pb-2">Controles de Simulación</h2>
          <EDVSlider
            label="Volumen Fin de Diástole (EDV)"
            unit="mL"
            min={MIN_EDV_SLIDER}
            max={MAX_EDV_SLIDER}
            step={1}
            value={edv}
            onChange={handleEdvChange}
          />
          <CardiacOutputDisplay
            co={currentBaselineValues.co}
            sv={currentBaselineValues.sv}
            hr={baselineParams.heartRate}
          />
        </div>
        <div className="bg-slate-700 p-6 rounded-lg shadow-md min-h-[300px]">
           <h2 className="text-2xl font-semibold text-sky-400 border-b border-slate-600 pb-2 mb-4">Curva de Frank-Starling</h2>
          <FrankStarlingChart
            baselineCurveData={baselineCurveData}
            baselineCurrentPoint={currentBaselinePointForChart}
            inotropyCurveData={inotropyCurveData}
            inotropyCurrentPoint={currentInotropyPointForChart}
            afterloadCurveData={afterloadCurveData}
            afterloadCurrentPoint={currentAfterloadPointForChart}
          />
        </div>
      </div>
       <div className="mt-8 p-6 bg-slate-700 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-sky-400 mb-2">Información</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Esta simulación ilustra la <strong>Ley de Frank-Starling</strong>. La curva azul (Curva Basal) representa la función cardíaca normal. La curva verde (Inotropismo Positivo) muestra el efecto de un aumento de la contractilidad cardíaca, desplazando la curva hacia arriba y a la izquierda. La curva roja (Poscarga Aumentada) ilustra cómo un aumento en la resistencia contra la que el corazón eyecta sangre (poscarga) disminuye el gasto cardíaco para un EDV dado, desplazando la curva hacia abajo y a la derecha.
        </p>
         <p className="text-slate-300 text-sm mt-2">Gasto Cardíaco (CO) = Volumen Sistólico (SV) × Frecuencia Cardíaca (HR)</p>
      </div>
    </div>
  );
};

export default CardiacFunctionSimulator;