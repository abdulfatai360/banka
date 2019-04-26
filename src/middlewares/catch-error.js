const errorHandler = routeHandler => async (req, res, next) => {
  try {
    await routeHandler(req, res);
  } catch (error) {
    next(error);
  }
};

export default errorHandler;
