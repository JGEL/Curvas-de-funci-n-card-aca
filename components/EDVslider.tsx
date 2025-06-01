
import React from 'react';

interface EDVSliderProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

const EDVSlider: React.FC<EDVSliderProps> = ({ label, unit, min, max, step, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  return (
    <div className="space-y-2">
      <label htmlFor="edv-slider" className="block text-sm font-medium text-slate-300">
        {label}: <span className="font-bold text-sky-400">{value.toFixed(0)} {unit}</span>
      </label>
      <input
        id="edv-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};

export default EDVSlider;
