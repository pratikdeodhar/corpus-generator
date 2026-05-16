import React from 'react';

interface InputFormProps {
  mode: 'projection' | 'goal';
  currency: 'INR' | 'USD';
  status: 'starting' | 'invested';
  age: number;
  monthlyAmount: number;
  years: number;
  existingAmount: number;
  inflation: number;
  targetCorpus: number;
  onChange: (field: string, value: any) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  mode,
  currency,
  status,
  age,
  monthlyAmount,
  years,
  existingAmount,
  inflation,
  targetCorpus,
  onChange,
}) => {
  return (
    <div className="input-form">
      <div className="form-group">
        <label>Current Age</label>
        <input
          type="number"
          value={age || ''}
          onChange={(e) => onChange('age', Number(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>Time Horizon (Years)</label>
        <input
          type="number"
          value={years || ''}
          onChange={(e) => onChange('years', Number(e.target.value))}
        />
      </div>

      {mode === 'projection' ? (
        <div className="form-group">
          <label>Monthly Investment ({currency})</label>
          <input
            type="number"
            value={monthlyAmount || ''}
            onChange={(e) => onChange('monthlyAmount', Number(e.target.value))}
          />
        </div>
      ) : (
        <div className="form-group">
          <label>Target Corpus ({currency})</label>
          <input
            type="number"
            value={targetCorpus || ''}
            onChange={(e) => onChange('targetCorpus', Number(e.target.value))}
          />
        </div>
      )}

      {status === 'invested' && (
        <div className="form-group">
          <label>Existing Investment ({currency})</label>
          <input
            type="number"
            value={existingAmount || ''}
            onChange={(e) => onChange('existingAmount', Number(e.target.value))}
          />
        </div>
      )}

      <div className="form-group">
        <label>Annual Inflation (%)</label>
        <input
          type="number"
          step="0.1"
          value={inflation || ''}
          onChange={(e) => onChange('inflation', Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default InputForm;
