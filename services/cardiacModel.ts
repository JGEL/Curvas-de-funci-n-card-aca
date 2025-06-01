
import { CardiacParams, DataPoint } from '../types';

export const DEFAULT_CARDIAC_PARAMS: CardiacParams = {
  minEDVForEjection: 50, // mL
  svMax: 180,            // mL, max possible stroke volume
  kmEffective: 90,       // mL, (EDV - minEDVForEjection) value for 50% svMax. Actual EDV = 90+50 = 140mL
  hillCoefficient: 2.8,  // Determines steepness
  heartRate: 72,         // beats per minute
};

export const POSITIVE_INOTROPY_CARDIAC_PARAMS: CardiacParams = {
  ...DEFAULT_CARDIAC_PARAMS,
  svMax: 220,            // Increased max stroke volume
  kmEffective: 70,       // Achieves 50% of new svMax at a lower effective EDV (70+50 = 120mL)
};

export const INCREASED_AFTERLOAD_CARDIAC_PARAMS: CardiacParams = {
  ...DEFAULT_CARDIAC_PARAMS,
  svMax: 150,             // Reduced max stroke volume due to increased resistance
  kmEffective: 100,       // Higher EDV needed to reach 50% of the new, lower svMax. (100+50 = 150mL)
  // minEDVForEjection could also be slightly increased, or hillCoefficient decreased for a flatter curve.
  // For simplicity, focusing on svMax and kmEffective demonstrates the downward/rightward shift.
};


export const calculateStrokeVolume = (edv: number, params: CardiacParams): number => {
  if (edv <= params.minEDVForEjection) {
    return 0;
  }
  const effectiveEDV = edv - params.minEDVForEjection;
  if (effectiveEDV <= 0) return 0; // Ensure effectiveEDV is positive

  const numerator = Math.pow(effectiveEDV, params.hillCoefficient);
  const denominator = Math.pow(params.kmEffective, params.hillCoefficient) + numerator;
  
  if (denominator === 0) return 0; 

  const sv = params.svMax * (numerator / denominator);
  return sv;
};

export const calculateCardiacOutput = (edv: number, params: CardiacParams): { co: number; sv: number } => {
  const sv = calculateStrokeVolume(edv, params);
  const coLitersPerMinute = (sv * params.heartRate) / 1000;
  return { co: coLitersPerMinute, sv };
};

export const generateCurveData = (
  params: CardiacParams,
  minEdvRange: number,
  maxEdvRange: number,
  steps: number
): DataPoint[] => {
  const data: DataPoint[] = [];
  const stepSize = (maxEdvRange - minEdvRange) / steps;

  for (let i = 0; i <= steps; i++) {
    const edv = minEdvRange + i * stepSize;
    const { co, sv } = calculateCardiacOutput(edv, params);
    data.push({ 
      edv: parseFloat(edv.toFixed(1)), 
      co: parseFloat(co.toFixed(2)),
      sv: parseFloat(sv.toFixed(1))
    });
  }
  return data;
};
