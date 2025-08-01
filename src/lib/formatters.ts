
export const formatCurrency = (value: number | string) => {
  const number = Number(String(value).replace(/[^0-9.-]/g, ''));
  if (isNaN(number)) {
    return "0";
  }
  // Format with Indian numbering system (commas for lakhs/crores) but without currency symbol.
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatPercentage = (value: number | string) => {
    const number = Number(value);
    if(isNaN(number)) {
        return "0%";
    }
    return `${number.toFixed(2)}%`;
}

export const formatLakhs = (value: number | string) => {
  const number = Number(value);
  if (isNaN(number)) {
    return "0 L";
  }
  if (number === 0) {
    return "0 L";
  }
  const lakhs = number / 100000;
  // Format with 2 decimal places and append 'L'.
  return `${lakhs.toFixed(2)} L`;
}
