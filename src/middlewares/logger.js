module.exports = (req, res, next) => {
  const { method, originalUrl } = req;
  console.log(`${method} ${originalUrl}`);
  next();
};
