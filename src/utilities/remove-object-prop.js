const removeObjectProp = (prop = '', object = {}) => (
  Object.keys(object)
    .reduce((newObject, key) => {
      const newObj = newObject;

      if (key !== prop) newObj[key] = object[key];
      return newObj;
    }, {})
);

export default removeObjectProp;
