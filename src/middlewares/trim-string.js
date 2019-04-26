/**
 * Removes leading and trailing spaces from string values in an abject
 *
 * @param {object} object - Object whose values are to be trimmed
 */
const trimObjectStrings = (object) => {
  const reqObject = object;
  Object.entries(reqObject)
    .forEach((eachEntry) => {
      const key = eachEntry[0];
      const value = eachEntry[1];

      if (typeof value === 'string') {
        reqObject[key] = value.trim();
      }
    });
};

/**
 * Trims string values in an HTTP request of parameter object
 *
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 * @param {function} next - Express function that passes controls to the next middleware
 */
const trimRequestObjectValues = (req, res, next) => {
  if (req.body) trimObjectStrings(req.body);
  if (req.params) trimObjectStrings(req.params);

  next();
};

export default trimRequestObjectValues;
