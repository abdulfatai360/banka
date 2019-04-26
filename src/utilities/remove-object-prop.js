/**
 * Removes a property from an object and returns the modified object
 *
 * @param {string} prop - Name of the property
 * @param {object} object - Object where the property will be removed from
 * @returns {object} - Modified object
 */
const removeObjectProperty = (prop, object) => (
  Object.keys(object)
    .reduce((newObject, key) => {
      const newObj = newObject;

      if (key !== prop) newObj[key] = object[key];
      return newObj;
    }, {})
);

export default removeObjectProperty;
