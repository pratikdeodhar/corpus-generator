import React, { useState } from 'react';
import {
  calculateCorpus,
  calculateRequiredMonthly,
  formatCurrency,
  generateChartData
} from '../utils/calculator';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ResultsDisplayProps {
  mode: 'projection' | 'goal';
  currency: 'INR' | 'USD';
  monthlyAmount: number;
  years: number;
  existingAmount: number;
  inflation: number;
  targetCorpus: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  mode,
  currency,
  monthlyAmount,
  years,
  existingAmount,
  inflation,
  targetCorpus,
}) => {
  const [customRate, setCustomRate] = useState<number>(10);
  const [showRealValue, setShowRealValue] = useState<boolean>(true);
  
  const selectedRate = customRate / 100;
  const chartData = generateChartData(monthlyAmount, existingAmount, years, inflation / 100);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">Year {label}</p>
          <div className="tooltip-items">
            {payload.map((item: any) => (
              <div key={item.dataKey} className="tooltip-item" style={{ color: item.color }}>
                <span className="dot" style={{ backgroundColor: item.color }}></span>
                <span className="name">{item.name}:</span>
                <span className="val">{formatCurrency(item.value, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="results-display">
      <div className="results-header">
        <h3>{mode === 'projection' ? 'Growth Projections' : 'Required Investments'}</h3>
        {mode === 'projection' && inflation > 0 && (
          <div className="inflation-toggle">
            <label className="switch-label">Adjust for Inflation</label>
            <input 
              type="checkbox" 
              checked={showRealValue}
              onChange={(e) => setShowRealValue(e.target.checked)}
              className="toggle-input"
            />
          </div>
        )}
      </div>

      <div className="custom-rate-control">
        <div className="rate-info">
          <label>Expected Annual Return (%)</label>
          <span className="rate-value">{customRate}%</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="30" 
          step="0.5"
          value={customRate}
          onChange={(e) => setCustomRate(Number(e.target.value))}
          className="rate-slider"
        />
        <div className="preset-badges">
          {[8, 10, 12].map(p => (
            <button 
              key={p} 
              className={`preset-btn ${customRate === p ? 'active' : ''}`}
              onClick={() => setCustomRate(p)}
            >
              {p}%
            </button>
          ))}
        </div>
      </div>
      
      <div className="results-grid single-row">
        {mode === 'projection' ? (
          <>
            <div className="result-card primary">
              <span className="rate-label">Nominal Corpus (@ {customRate}%)</span>
              <span className="corpus-value">{formatCurrency(calculateCorpus(monthlyAmount, existingAmount, years, selectedRate).nominalValue, currency)}</span>
            </div>
            {inflation > 0 && showRealValue && (
              <div className="result-card real">
                <span className="rate-label">Real Value (Inflation Adjusted)</span>
                <span className="corpus-value">{formatCurrency(calculateCorpus(monthlyAmount, existingAmount, years, selectedRate, inflation / 100).realValue, currency)}</span>
              </div>
            )}
          </>
        ) : (
          <div className="result-card primary">
            <span className="rate-label">Monthly Needed (@ {customRate}%)</span>
            <span className="corpus-value">{formatCurrency(calculateRequiredMonthly(targetCorpus, existingAmount, years, selectedRate), currency)}</span>
          </div>
        )}
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h4>Visualizing the Compounding Gap</h4>
        </div>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="color8" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="color10" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="color12" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => currency === 'INR' ? `₹${(value/10000000).toFixed(1)}Cr` : `$${(value/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36}/>
              
              <Area 
                name="8% Return"
                type="monotone" 
                dataKey="rate_8" 
                stroke="#94a3b8" 
                fill="url(#color8)" 
                strokeWidth={1}
                dot={false}
              />
              <Area 
                name="10% Return"
                type="monotone" 
                dataKey="rate_10" 
                stroke="#818cf8" 
                fill="url(#color10)" 
                strokeWidth={2}
                dot={false}
              />
              <Area 
                name="12% Return"
                type="monotone" 
                dataKey="rate_12" 
                stroke="#4f46e5" 
                fill="url(#color12)" 
                strokeWidth={3}
                dot={false}
              />
              {inflation > 0 && showRealValue && (
                <Area 
                  name="Real Value (10%)"
                  type="monotone" 
                  dataKey="real_10" 
                  stroke="#10b981" 
                  fill="url(#colorReal)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
