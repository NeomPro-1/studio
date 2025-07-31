export const formatCurrency = (value: number | string) => {
  const number = Number(value);
  if (isNaN(number)) {
    return "₹ 0";
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
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
