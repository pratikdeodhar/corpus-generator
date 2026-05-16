import React from 'react';

interface InputFormProps {
  mode: 'projection' | 'goal';
  currency: 'INR' | 'USD';
  status: 'starting' | 'invested';
  setStatus: (status: 'starting' | 'invested') => void;
  age: number;
  monthlyAmount: number;
  years: number;
  existingAmount: number;
  inflation: number;
  stepUp: number;
  targetCorpus: number;
  onChange: (field: string, value: any) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  mode,
  currency,
  status,
  setStatus,
  age,
  monthlyAmount,
  years,
  existingAmount,
  inflation,
  stepUp,
  targetCorpus,
  onChange,
}) => {
  return (
    <div className="input-form">
      <div className="form-group prominent-toggle">
        <label>Investment Starting Point</label>
        <div className="buttons full-width">
          <button 
            className={status === 'starting' ? 'active' : ''} 
            onClick={() => setStatus('starting')}
          >
            Fresh Start (Monthly SIP)
          </button>
          <button 
            className={status === 'invested' ? 'active' : ''} 
            onClick={() => setStatus('invested')}
          >
            I Already Have Savings
          </button>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label>Current Age</label>
          <input
            type="number"
            value={age || ''}
            onChange={(e) => onChange('age', Number(e.target.value))}
            placeholder="e.g. 25"
          />
        </div>

        <div className="form-group">
          <label>Time Horizon (Years)</label>
          <input
            type="number"
            value={years || ''}
            onChange={(e) => onChange('years', Number(e.target.value))}
            placeholder="e.g. 20"
          />
        </div>
      </div>

      {mode === 'projection' ? (
        <div className="form-group">
          <label>Monthly Investment ({currency})</label>
          <input
            type="number"
            value={monthlyAmount || ''}
            onChange={(e) => onChange('monthlyAmount', Number(e.target.value))}
            placeholder="0.00"
          />
        </div>
      ) : (
        <div className="form-group">
          <label>Target Corpus ({currency})</label>
          <input
            type="number"
            value={targetCorpus || ''}
            onChange={(e) => onChange('targetCorpus', Number(e.target.value))}
            placeholder="0.00"
          />
        </div>
      )}

      <div className="form-group">
        <div className="label-with-value">
          <label>Annual Step-up SIP (%)</label>
          <span className="inline-value">{stepUp}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          step="1"
          value={stepUp}
          onChange={(e) => onChange('stepUp', Number(e.target.value))}
          className="step-up-slider"
        />
        <p className="input-hint">Increase your investment by this % every year.</p>
      </div>

      {status === 'invested' && (
        <div className="form-group highlight-input">
          <label>Current Savings / Lump Sum ({currency})</label>
          <input
            type="number"
            value={existingAmount || ''}
            onChange={(e) => onChange('existingAmount', Number(e.target.value))}
            placeholder="Enter amount already invested"
          />
        </div>
      )}

      <div className="form-group">
        <label>Expected Annual Inflation (%)</label>
        <input
          type="number"
          step="0.1"
          value={inflation || ''}
          onChange={(e) => onChange('inflation', Number(e.target.value))}
          placeholder="Standard is ~6%"
        />
      </div>
    </div>
  );
};

export default InputForm;
