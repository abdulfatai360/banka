const padWithZero = (n) => {
  let num = n;
  num = (num < 10) ? String(num).padStart(2, '0') : num;

  return num;
};

export default padWithZero;
