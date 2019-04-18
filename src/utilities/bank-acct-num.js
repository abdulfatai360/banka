/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = (array) => {
  let currentIndex = array.length; let temporaryValue; let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// use account's owner first and last name to generate a serial number
const acctOwnerSerial = (userEntity) => {
  const { first_name, last_name } = userEntity;
  const fnameCode = first_name.toLowerCase().charCodeAt(1).toString();
  const lnameCode = last_name.toLowerCase().charCodeAt(1).toString();

  const nameCodeArr = fnameCode.concat(lnameCode).split('');
  const nameCode = shuffle(nameCodeArr).join('');

  return nameCode;
};

// generate a 10-digit account number
const acctNumberGenerator = (owner) => {
  const bankId = '10';
  const acctNameCode = acctOwnerSerial(owner);

  let acctNumTemp = `acctId${bankId}${acctNameCode}`;

  const currLen = (bankId + acctNameCode).length;
  const remLen = 10 - currLen;

  const ownerId = owner.id.toString().padStart(remLen, '0');

  acctNumTemp = acctNumTemp.replace('acctId', ownerId);
  const acctNum = acctNumTemp.slice(0, 10);

  return acctNum;
};

export default acctNumberGenerator;
