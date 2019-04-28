/**
 * Pad a single digit value with zero and returns it
 *
 * @param {number} input - Number to be padded
 * @returns {string} Number that has been padded to two digit
 */
const padNumberWithZero = (input) => {
  let numberToBePadded = input;
  numberToBePadded = (numberToBePadded < 10) ? String(numberToBePadded).padStart(2, '0') : numberToBePadded;

  return numberToBePadded;
};

export default padNumberWithZero;
