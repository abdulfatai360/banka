/**
 * Takes in an array and randomly re-arranges its elements
 *
 * @param {array} array - Array to be shuffled
 * @returns {array} - Shuffled array
 */
const shuffleArray = (array) => {
  const shuffledArray = array;
  let currentIndex = shuffledArray.length; let temporaryValue; let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = shuffledArray[currentIndex];
    shuffledArray[currentIndex] = shuffledArray[randomIndex];
    shuffledArray[randomIndex] = temporaryValue;
  }

  return shuffledArray;
};

/**
 * Uses user's first name and last name to randomly generates a code
 *
 * @param {object} userEntity - Object literal representing the user entity
 * @returns {string} - Randomly generated code
 */
const accountOwnerCode = (userEntity) => {
  const { firstName, lastName } = userEntity;
  const firstNameCode = firstName.toLowerCase().charCodeAt(1).toString();
  const lastNameCode = lastName.toLowerCase().charCodeAt(1).toString();

  const nameCodeArray = firstNameCode.concat(lastNameCode).split('');
  const nameCode = shuffleArray(nameCodeArray).join('');

  return nameCode;
};

/**
 * Generates and return a 10 digit number
 *
 * @param {object} owner - Object literal representing the user entity
 * @returns {string} - 10 digit number
 */
const generateAccountNumber = (owner) => {
  const bankId = '10';
  const accountNameCode = accountOwnerCode(owner);

  let temporaryAccountNumber = `${bankId}acctId${accountNameCode}`;

  const currentAccountNumberLength = (bankId + accountNameCode).length;
  const remainingAccountNumberLength = 10 - currentAccountNumberLength;

  const ownerId = owner.id.toString().padStart(remainingAccountNumberLength, '0');
  temporaryAccountNumber = temporaryAccountNumber.replace('acctId', ownerId);

  return temporaryAccountNumber.slice(0, 10);
};

export default generateAccountNumber;
