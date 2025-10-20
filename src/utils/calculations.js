// EMI Calculator
export const calculateEMI = (principal, ratePerAnnum, tenureMonths) => {
  const rate = ratePerAnnum / 12 / 100;
  const emi = principal * rate * Math.pow(1 + rate, tenureMonths) / (Math.pow(1 + rate, tenureMonths) - 1);
  const totalAmount = emi * tenureMonths;
  const totalInterest = totalAmount - principal;
  
  // Generate monthly breakdown
  let balance = principal;
  const breakdown = [];
  
  for (let i = 1; i <= tenureMonths; i++) {
    const interestPayment = balance * rate;
    const principalPayment = emi - interestPayment;
    balance -= principalPayment;
    
    breakdown.push({
      month: i,
      emi: Math.round(emi),
      principal: Math.round(principalPayment),
      interest: Math.round(interestPayment),
      balance: Math.round(Math.max(0, balance)),
    });
  }
  
  return {
    emi: Math.round(emi),
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
    principal: Math.round(principal),
    breakdown,
  };
};

// SIP Calculator
export const calculateSIP = (monthlyInvestment, ratePerAnnum, tenureMonths) => {
  const rate = ratePerAnnum / 12 / 100;
  const futureValue = monthlyInvestment * (((Math.pow(1 + rate, tenureMonths) - 1) / rate) * (1 + rate));
  const totalInvested = monthlyInvestment * tenureMonths;
  const totalReturns = futureValue - totalInvested;
  
  // Generate yearly breakdown
  const breakdown = [];
  for (let year = 1; year <= Math.ceil(tenureMonths / 12); year++) {
    const months = Math.min(year * 12, tenureMonths);
    const fv = monthlyInvestment * (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate));
    const invested = monthlyInvestment * months;
    
    breakdown.push({
      year,
      invested: Math.round(invested),
      value: Math.round(fv),
      gains: Math.round(fv - invested),
    });
  }
  
  return {
    futureValue: Math.round(futureValue),
    totalInvested: Math.round(totalInvested),
    totalReturns: Math.round(totalReturns),
    breakdown,
  };
};

// Simple Interest Calculator
export const calculateSimpleInterest = (principal, ratePerAnnum, tenureYears) => {
  const interest = (principal * ratePerAnnum * tenureYears) / 100;
  const totalAmount = principal + interest;
  
  const breakdown = [];
  for (let year = 1; year <= tenureYears; year++) {
    const yearlyInterest = (principal * ratePerAnnum) / 100;
    const cumulativeInterest = yearlyInterest * year;
    
    breakdown.push({
      year,
      interest: Math.round(yearlyInterest),
      cumulativeInterest: Math.round(cumulativeInterest),
      totalAmount: Math.round(principal + cumulativeInterest),
    });
  }
  
  return {
    interest: Math.round(interest),
    totalAmount: Math.round(totalAmount),
    principal: Math.round(principal),
    breakdown,
  };
};

// Compound Interest Calculator
export const calculateCompoundInterest = (principal, ratePerAnnum, tenureYears, frequency = 12) => {
  const rate = ratePerAnnum / 100;
  const totalAmount = principal * Math.pow(1 + rate / frequency, frequency * tenureYears);
  const interest = totalAmount - principal;
  
  const breakdown = [];
  for (let year = 1; year <= tenureYears; year++) {
    const amount = principal * Math.pow(1 + rate / frequency, frequency * year);
    const yearInterest = amount - principal;
    
    breakdown.push({
      year,
      amount: Math.round(amount),
      interest: Math.round(yearInterest),
      principal: Math.round(principal),
    });
  }
  
  return {
    interest: Math.round(interest),
    totalAmount: Math.round(totalAmount),
    principal: Math.round(principal),
    breakdown,
  };
};

// Loan Calculator (similar to EMI but with more details)
export const calculateLoan = (principal, ratePerAnnum, tenureYears) => {
  const tenureMonths = tenureYears * 12;
  return calculateEMI(principal, ratePerAnnum, tenureMonths);
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};
