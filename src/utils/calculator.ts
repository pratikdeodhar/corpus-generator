/**
 * Calculates the future value of an investment corpus.
 * 
 * @param monthlyContribution - The amount invested every month.
 * @param existingAmount - The initial lump sum already invested.
 * @param years - Number of years to stay invested.
 * @param annualRate - Annual interest rate (as a decimal).
 * @param inflationRate - Annual inflation rate (as a decimal).
 * @returns Object containing nominal and real (inflation-adjusted) corpus.
 */
export const calculateCorpus = (
  monthlyContribution: number,
  existingAmount: number,
  years: number,
  annualRate: number,
  inflationRate: number = 0
) => {
  const monthlyRate = annualRate / 12;
  const months = years * 12;

  const fvExisting = existingAmount * Math.pow(1 + monthlyRate, months);

  let fvContributions = 0;
  if (monthlyRate > 0) {
    fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  } else {
    fvContributions = monthlyContribution * months;
  }

  const nominalValue = fvExisting + fvContributions;
  const realValue = nominalValue / Math.pow(1 + inflationRate, years);

  return { nominalValue, realValue };
};

/**
 * Calculates required monthly investment to reach a target corpus.
 */
export const calculateRequiredMonthly = (
  targetCorpus: number,
  existingAmount: number,
  years: number,
  annualRate: number
): number => {
  const monthlyRate = annualRate / 12;
  const months = years * 12;

  const fvExisting = existingAmount * Math.pow(1 + monthlyRate, months);
  
  const remainingTarget = targetCorpus - fvExisting;
  if (remainingTarget <= 0) return 0;

  if (monthlyRate > 0) {
    return remainingTarget / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  } else {
    return remainingTarget / months;
  }
};

/**
 * Generates multi-rate data points for the growth chart.
 */
export const generateChartData = (
  monthlyContribution: number,
  existingAmount: number,
  years: number,
  inflationRate: number = 0
) => {
  const data = [];
  const rates = [0.08, 0.10, 0.12];
  
  for (let year = 0; year <= years; year++) {
    const dataPoint: any = { year };
    
    // Add nominal values for each rate
    rates.forEach(rate => {
      const { nominalValue } = calculateCorpus(monthlyContribution, existingAmount, year, rate);
      dataPoint[`rate_${rate * 100}`] = Math.round(nominalValue);
    });

    // Add real value for the moderate (10%) rate if inflation exists
    if (inflationRate > 0) {
      const { realValue } = calculateCorpus(monthlyContribution, existingAmount, year, 0.10, inflationRate);
      dataPoint['real_10'] = Math.round(realValue);
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
