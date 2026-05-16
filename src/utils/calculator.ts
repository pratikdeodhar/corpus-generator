/**
 * Calculates the future value of an investment corpus with optional annual step-up.
 * 
 * @param monthlyContribution - The initial amount invested every month.
 * @param existingAmount - The initial lump sum already invested.
 * @param years - Number of years to stay invested.
 * @param annualRate - Annual interest rate (as a decimal).
 * @param inflationRate - Annual inflation rate (as a decimal).
 * @param stepUpPercent - Annual percentage increase in monthly contribution (as a decimal).
 * @returns Object containing nominal and real (inflation-adjusted) corpus.
 */
export const calculateCorpus = (
  monthlyContribution: number,
  existingAmount: number,
  years: number,
  annualRate: number,
  inflationRate: number = 0,
  stepUpPercent: number = 0
) => {
  const monthlyRate = annualRate / 12;
  const annualReturn = Math.pow(1 + monthlyRate, 12);
  
  // FV of Existing Amount
  const fvExisting = existingAmount * Math.pow(1 + monthlyRate, years * 12);

  // FV of Step-up Contributions
  let fvContributions = 0;
  if (years > 0) {
    if (stepUpPercent === 0) {
      // Standard SIP formula
      if (monthlyRate > 0) {
        fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, years * 12) - 1) / monthlyRate);
      } else {
        fvContributions = monthlyContribution * years * 12;
      }
    } else {
      // Step-up SIP formula
      const S = monthlyRate > 0 ? (Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate : 12;
      const x = (1 + stepUpPercent) / annualReturn;
      
      if (Math.abs(x - 1) < 1e-10) {
        fvContributions = monthlyContribution * S * years * Math.pow(annualReturn, years - 1);
      } else {
        fvContributions = monthlyContribution * S * (Math.pow(1 + stepUpPercent, years) - Math.pow(annualReturn, years)) / (1 + stepUpPercent - annualReturn);
      }
    }
  }

  const nominalValue = fvExisting + fvContributions;
  const realValue = nominalValue / Math.pow(1 + inflationRate, years);

  return { nominalValue, realValue };
};

/**
 * Calculates required initial monthly investment to reach a target corpus with optional step-up.
 */
export const calculateRequiredMonthly = (
  targetCorpus: number,
  existingAmount: number,
  years: number,
  annualRate: number,
  stepUpPercent: number = 0
): number => {
  const monthlyRate = annualRate / 12;
  const annualReturn = Math.pow(1 + monthlyRate, 12);
  const months = years * 12;

  const fvExisting = existingAmount * Math.pow(1 + monthlyRate, months);
  
  const remainingTarget = targetCorpus - fvExisting;
  if (remainingTarget <= 0 || years <= 0) return 0;

  if (stepUpPercent === 0) {
    if (monthlyRate > 0) {
      return remainingTarget / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else {
      return remainingTarget / months;
    }
  } else {
    const S = monthlyRate > 0 ? (Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate : 12;
    const x = (1 + stepUpPercent) / annualReturn;
    
    let denominator;
    if (Math.abs(x - 1) < 1e-10) {
      denominator = S * years * Math.pow(annualReturn, years - 1);
    } else {
      denominator = S * (Math.pow(1 + stepUpPercent, years) - Math.pow(annualReturn, years)) / (1 + stepUpPercent - annualReturn);
    }
    return remainingTarget / denominator;
  }
};

/**
 * Generates multi-rate data points for the growth chart.
 */
export const generateChartData = (
  monthlyContribution: number,
  existingAmount: number,
  years: number,
  inflationRate: number = 0,
  stepUpPercent: number = 0,
  mode: 'projection' | 'goal' = 'projection',
  targetCorpus: number = 0,
  selectedRate: number = 0.10
) => {
  const data = [];
  const rates = [0.08, 0.10, 0.12];
  
  let baseMonthly = monthlyContribution;
  if (mode === 'goal') {
    baseMonthly = calculateRequiredMonthly(targetCorpus, existingAmount, years, selectedRate, stepUpPercent);
  }

  for (let year = 0; year <= years; year++) {
    const dataPoint: any = { year };
    
    rates.forEach(rate => {
      const { nominalValue } = calculateCorpus(baseMonthly, existingAmount, year, rate, 0, stepUpPercent);
      dataPoint[`rate_${rate * 100}`] = Math.round(nominalValue);
    });

    if (inflationRate > 0) {
      const { realValue } = calculateCorpus(baseMonthly, existingAmount, year, 0.10, inflationRate, stepUpPercent);
      dataPoint['real_10'] = Math.round(realValue);
    }

    if (!rates.includes(selectedRate)) {
      const { nominalValue } = calculateCorpus(baseMonthly, existingAmount, year, selectedRate, 0, stepUpPercent);
      dataPoint[`rate_custom`] = Math.round(nominalValue);
    }

    data.push(dataPoint);
  }
  return data;
};

/**
 * Formats a number as currency based on the selected locale.
 */
export const formatCurrency = (amount: number, currency: 'INR' | 'USD'): string => {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};
