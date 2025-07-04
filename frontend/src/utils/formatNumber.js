// src/utils/formatNumber.js

export const formatChineseNumber = (num) => {
  if (num < 10000) {
    return num.toString();
  }
  
  if (num < 100000000) { // Less than 1亿
    const wan = Math.floor(num / 10000);
    const remainder = num % 10000;
    if (remainder === 0) {
      return wan + "万";
    } else if (remainder < 1000) {
      return wan + "万" + remainder;
    } else {
      return wan + "万" + remainder;
    }
  }
  
  if (num < 1000000000000) { // Less than 1万亿
    const yi = Math.floor(num / 100000000);
    const remainder = num % 100000000;
    if (remainder === 0) {
      return yi + "亿";
    } else if (remainder < 10000) {
      return yi + "亿" + remainder;
    } else {
      const wan = Math.floor(remainder / 10000);
      const finalRemainder = remainder % 10000;
      if (finalRemainder === 0) {
        return yi + "亿" + wan + "万";
      } else {
        return yi + "亿" + wan + "万" + finalRemainder;
      }
    }
  }
  
  // For 万亿 and above
  const wanYi = Math.floor(num / 1000000000000);
  const remainder = num % 1000000000000;
  if (remainder === 0) {
    return wanYi + "万亿";
  } else {
    const yi = Math.floor(remainder / 100000000);
    const finalRemainder = remainder % 100000000;
    if (finalRemainder === 0 && yi === 0) {
      return wanYi + "万亿";
    } else if (finalRemainder === 0) {
      return wanYi + "万亿" + yi + "亿";
    } else {
      // Continue with more complex formatting as needed
      return wanYi + "万亿" + formatChineseNumber(remainder);
    }
  }
};