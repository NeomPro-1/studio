
export const formatCurrency = (value: number | string) => {
  const number = Number(String(value).replace(/[^0-9.-]/g, ''));
  if (isNaN(number)) {
    return "₹0";
  }
  return number.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
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
    return "₹0 L";
  }
  const lakhs = number / 100000;
  return `₹${lakhs.toFixed(2)} L`;
}
