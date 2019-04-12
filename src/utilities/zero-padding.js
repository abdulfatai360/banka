// eslint-disable-next-line no-confusing-arrow
const padWithZero = num => (num < 10) ? String(num).padStart(2, '0') : num;

export default padWithZero;
