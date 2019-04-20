const trimStringsInit = (object) => {
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

const trimReqObjectStrings = (req, res, next) => {
  if (req.body) trimStringsInit(req.body);
  if (req.params) trimStringsInit(req.params);

  next();
};

export default trimReqObjectStrings;
