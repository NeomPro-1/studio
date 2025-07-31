
export const formatCurrency = (value: number | string) => {
  const number = Number(value);
  if (isNaN(number)) {
    return "₹ 0";
  }
  // Manually prepend the Rupee symbol to ensure it's always correct.
  return `₹ ${number.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
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
  // Manually prepend the Rupee symbol.
  return `₹${lakhs.toFixed(2)} L`;
}
