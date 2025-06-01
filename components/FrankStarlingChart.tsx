
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';
import type { DataPoint } from '../types';

interface FrankStarlingChartProps {
  baselineCurveData: DataPoint[];
  baselineCurrentPoint: DataPoint | null;
  inotropyCurveData: DataPoint[];
  inotropyCurrentPoint: DataPoint | null;
  afterloadCurveData: DataPoint[];
  afterloadCurrentPoint: DataPoint | null;
}

const FrankStarlingChart: React.FC<FrankStarlingChartProps> = ({ 
  baselineCurveData, 
  baselineCurrentPoint,
  inotropyCurveData,
  inotropyCurrentPoint,
  afterloadCurveData,
  afterloadCurrentPoint
}) => {
  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Determine which line's data to show based on payload name
      // This logic might need refinement if multiple lines have data for the same X (label)
      let pointData = payload[0]; // Default
      if (payload.some(p => p.dataKey === 'coBaseline')) {
        pointData = payload.find(p => p.dataKey === 'coBaseline') || pointData;
      } else if (payload.some(p => p.dataKey === 'coInotropy')) {
        pointData = payload.find(p => p.dataKey === 'coInotropy') || pointData;
      } else if (payload.some(p => p.dataKey === 'coAfterload')) {
         pointData = payload.find(p => p.dataKey === 'coAfterload') || pointData;
      }
      
      const name = pointData.name;
      let svKey = 'sv'; // generic sv, specific one is better
      if (pointData.dataKey === 'coBaseline') svKey = 'svBaseline';
      else if (pointData.dataKey === 'coInotropy') svKey = 'svInotropy';
      else if (pointData.dataKey === 'coAfterload') svKey = 'svAfterload';

      const svValue = pointData.payload[svKey];
      
      return (
        <div className="bg-slate-800/80 backdrop-blur-sm text-white p-3 rounded shadow-lg border border-slate-600">
          <p className="font-semibold" style={{ color: pointData.stroke }}>{`${name} (EDV: ${label} mL)`}</p>
          <p className="text-sm">{`Gasto Cardíaco: ${pointData.value.toFixed(2)} L/min`}</p>
          {svValue !== undefined && <p className="text-sm">{`Vol. Sistólico: ${svValue.toFixed(1)} mL`}</p>}
        </div>
      );
    }
    return null;
  };
  
  const allCoValues = [
    ...baselineCurveData.map(p => p.co),
    ...inotropyCurveData.map(p => p.co),
    ...afterloadCurveData.map(p => p.co),
    baselineCurrentPoint?.co ?? 0,
    inotropyCurrentPoint?.co ?? 0,
    afterloadCurrentPoint?.co ?? 0,
  ];
  const maxYDomain = Math.max(0, ...allCoValues) * 1.1; // Add 10% padding, ensure not negative
  const minYDomain = 0;

  // Combine data for easier tooltip handling and aligned X-axis points.
  // Assumes all curveData arrays have the same EDV points in the same order.
  const combinedData = baselineCurveData.map((basePoint, index) => ({
    edv: basePoint.edv,
    coBaseline: basePoint.co,
    svBaseline: basePoint.sv,
    coInotropy: inotropyCurveData[index]?.co,
    svInotropy: inotropyCurveData[index]?.sv,
    coAfterload: afterloadCurveData[index]?.co,
    svAfterload: afterloadCurveData[index]?.sv,
  }));


  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={combinedData}
        margin={{
          top: 5,
          right: 20,
          left: 10,
          bottom: 25,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis 
          dataKey="edv" 
          type="number"
          stroke="#94a3b8"
          tick={{ fontSize: 12 }}
          label={{ value: 'Volumen Fin de Diástole (EDV mL)', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 12 }}
          domain={['dataMin', 'dataMax']}
        />
        <YAxis 
          stroke="#94a3b8"
          tick={{ fontSize: 12 }}
          label={{ value: 'Gasto Cardíaco (L/min)', angle: -90, position: 'insideLeft', offset: 0, fill: '#94a3b8', fontSize: 12, dy: 40 }}
          domain={[minYDomain, parseFloat(maxYDomain.toFixed(1))]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#38bdf8', strokeWidth: 1, strokeDasharray: '3 3' }} />
        <Legend verticalAlign="top" height={36} wrapperStyle={{color: '#e2e8f0'}} iconSize={10}/>
        
        <Line 
          type="monotone" 
          dataKey="coBaseline"
          name="Curva Basal" 
          stroke="#0ea5e9" // Sky blue
          strokeWidth={3} 
          dot={false} 
          activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#f0f9ff' }}
        />
        {baselineCurrentPoint && (
          <ReferenceDot 
            x={baselineCurrentPoint.edv} 
            y={baselineCurrentPoint.co} 
            r={6} 
            fill="#0ea5e9"
            stroke="#fff" 
            strokeWidth={2}
            isFront={true} 
            ifOverflow="extendDomain"
          />
        )}

        <Line 
          type="monotone" 
          dataKey="coInotropy"
          name="Inotropismo Positivo" 
          stroke="#22c55e" // Green
          strokeWidth={3} 
          dot={false} 
          activeDot={{ r: 6, fill: '#22c55e', stroke: '#f0fdf4' }}
        />
        {inotropyCurrentPoint && (
          <ReferenceDot 
            x={inotropyCurrentPoint.edv} 
            y={inotropyCurrentPoint.co} 
            r={6} 
            fill="#22c55e"
            stroke="#fff" 
            strokeWidth={2}
            isFront={true}
            ifOverflow="extendDomain"
          />
        )}

        <Line 
          type="monotone" 
          dataKey="coAfterload"
          name="Poscarga Aumentada" 
          stroke="#ef4444" // Red
          strokeWidth={3} 
          dot={false} 
          activeDot={{ r: 6, fill: '#ef4444', stroke: '#fef2f2' }}
        />
        {afterloadCurrentPoint && (
          <ReferenceDot 
            x={afterloadCurrentPoint.edv} 
            y={afterloadCurrentPoint.co} 
            r={6} 
            fill="#ef4444" // Red
            stroke="#fff" 
            strokeWidth={2}
            isFront={true}
            ifOverflow="extendDomain"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FrankStarlingChart;
