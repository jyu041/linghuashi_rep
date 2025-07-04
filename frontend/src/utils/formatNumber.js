// src/utils/formatNumber.js

export const formatChineseNumber = (num) => {
  if (num < 10000) {
    return num.toString();
  }
  
  if (num < 100000000) { // Less than 1亿
    const value = num / 10000;
    // Round to 1 decimal place, but remove .0 if it's a whole number
    const roundedValue = Math.round(value * 10) / 10;
    return roundedValue % 1 === 0 ? roundedValue + '万' : roundedValue + '万';
  }
  
  if (num < 1000000000000) { // Less than 1万亿
    const value = num / 100000000;
    // Round to 1 decimal place, but remove .0 if it's a whole number
    const roundedValue = Math.round(value * 10) / 10;
    return roundedValue % 1 === 0 ? roundedValue + '亿' : roundedValue + '亿';
  }
  
  // For 万亿 and above
  const value = num / 1000000000000;
  // Round to 1 decimal place, but remove .0 if it's a whole number
  const roundedValue = Math.round(value * 10) / 10;
  return roundedValue % 1 === 0 ? roundedValue + '万亿' : roundedValue + '万亿';
};