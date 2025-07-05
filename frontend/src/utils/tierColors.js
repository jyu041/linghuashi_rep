// src/utils/tierColors.js

// Function to get tier display name with proper dot symbol
export const getTierDisplayName = (tier) => {
  if (!tier) return tier;
  return tier.replace(/\./g, '•');
};

// Function to get tier colors for equipment and modals
export const getTierColor = (tier) => {
  const colors = {
    '凡品': '#808080',
    '良品': '#008000', 
    '上品': '#008B8B',
    '极品': '#DDA0DD',
    '灵品': '#FFFF00',
    '王品': '#FFA500',
    '圣品': '#FF0000',
    '帝品': '#FFC0CB',
    '帝品.精': 'linear-gradient(90deg, #800080 50%, #0000FF 50%)',
    '帝品.珍': 'linear-gradient(90deg, #006400 50%, #90EE90 50%)',
    '帝品.极': 'linear-gradient(90deg, #00008B 50%, #87CEEB 50%)',
    '帝品.绝': 'linear-gradient(90deg, #4B0082 50%, #DDA0DD 50%)',
    '仙品.精': 'linear-gradient(90deg, #B8860B 50%, #FFD700 50%)',
    '仙品.极': 'linear-gradient(90deg, #8B0000 50%, #FF6B6B 50%)',
  };
  return colors[tier] || '#808080';
};

// Function to check if tier uses gradient
export const isGradientTier = (tier) => {
  return tier && tier.includes('.');
};

// Function to get tier background style object
export const getTierBackgroundStyle = (tier) => {
  const color = getTierColor(tier);
  
  if (isGradientTier(tier)) {
    return {
      background: color,
    };
  } else {
    return {
      backgroundColor: color,
    };
  }
};