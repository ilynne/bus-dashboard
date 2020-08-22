const tokenDAO = require('../daos/token');

const isAuthorized = async (req, res, next) => {
  const { authorization } = req.headers
  if (authorization) {
    const token = authorization.split(' ')[1];
    if (token) {
      req.token = token;
      const userId = await tokenDAO.getUserIdFromToken(token)
      if (userId) {
        req.userId = userId;
        next();
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
}

const emailAndPassword = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).send('email and password are required')
  } else {
    next();
  }
}
exports.isAuthorized = isAuthorized;
exports.emailAndPassword = emailAndPassword;
