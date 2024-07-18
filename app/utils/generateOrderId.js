export const generateOrderId = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

export const generateMenuId = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
};

export const generateOptionId = () => {
  return Math.floor(10 + Math.random() * 90);
};


export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};