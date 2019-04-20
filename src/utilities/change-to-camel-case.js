const changeKeysToCamelCase = (input) => {
  const object = input;

  Object.entries(object).forEach((eachEntry) => {
    const underscoredKey = eachEntry[0];
    const value = eachEntry[1];

    const camelCasedKey = underscoredKey
      .replace(/[_]([a-z]+)/g, (match, group) => {
        let keyPart = group;
        keyPart = keyPart.replace(keyPart[0], keyPart[0].toUpperCase());
        return keyPart;
      });

    delete object[underscoredKey];
    object[camelCasedKey] = value;
  });

  return object;
};

export default changeKeysToCamelCase;