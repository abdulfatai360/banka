class ObjectUtils {
  /**
   * Removes a property from an object and returns the modified object
   *
   * @static
   * @param {string} propertyName - Name of the property
   * @param {object} object - Object where the property will be removed from
   * @returns {object} Object whose property was been removed
   * @memberof ObjectUtils
   */
  static removeOneProperty(propertyName, object) {
    const finalObject = {};

    Object.keys(object).forEach((key) => {
      if (key !== propertyName) finalObject[key] = object[key];
    });

    return finalObject;
  }

  /**
   * Removes a list properties from an object and returns the modified object
   *
   * @static
   * @param {array} propertyNames
   * @param {objecr} object
   * @returns {object} Object whose propertes were removed
   * @memberof ObjectUtils
   */
  static removeManyProperties(propertyNames, object) {
    let finalObject = object;

    propertyNames.forEach((propertyName) => {
      finalObject = ObjectUtils.removeOneProperty(propertyName, finalObject);
    });

    return finalObject;
  }

  /**
   * Changes case of object keys from underscore to camel case
   *
   * @static
   * @param {object} object - Object with underscore case keys
   * @returns {object} - Object with camel case keys
   * @memberof ObjectUtils
   */
  static changeKeysToCamelCase(object) {
    const finalObject = object;

    Object.entries(finalObject).forEach((eachEntry) => {
      const underscoredKey = eachEntry[0];
      const value = eachEntry[1];

      const camelCasedKey = underscoredKey
        .replace(/[_]([a-z]+)/g, (match, group) => {
          let keyPart = group;
          keyPart = keyPart.replace(keyPart[0], keyPart[0].toUpperCase());
          return keyPart;
        });

      delete finalObject[underscoredKey];
      finalObject[camelCasedKey] = value;
    });

    return finalObject;
  }
}

export default ObjectUtils;
