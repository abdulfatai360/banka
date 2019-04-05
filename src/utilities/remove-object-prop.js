/* eslint-disable no-param-reassign */
const removeObjectProp = (prop = '', object = {}) => (
  Object.keys(object)
    .reduce((newObject, key) => {
      if (key !== prop) newObject[key] = object[key];
      return newObject;
    }, {})
);

export default removeObjectProp;
