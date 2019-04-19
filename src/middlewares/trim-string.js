const trimStrings = (req, res, next) => {
  if (req.body) {
    Object.entries(req.body)
      .forEach((bf) => {
        if (typeof bf[1] === 'string') {
          req.body[bf[0]] = bf[1].trim();
        }
      });
  }

  next();
};

export default trimStrings;
