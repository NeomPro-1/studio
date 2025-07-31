export const formatCurrency = (value: number | string, symbolOnly = false) => {
  if (symbolOnly) {
    return '₹';
  }
  const number = Number(value);
  if (isNaN(number)) {
    return "₹ 0";
  }
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(number);
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
    return "₹ 0 L";
  }
  const lakhs = number / 100000;
  return `₹${lakhs.toFixed(2)} L`;
}
