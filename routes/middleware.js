const mongoose = require('mongoose');

const tokenDAO = require('../daos/token');

const isAuthorized = async (req, res, next) => {
  const { authorization } = req.headers
  console.log(authorization)
  if (authorization) {
    const token = authorization.split(' ')[1];
    if (token) {
      req.token = token;
      const userId = await tokenDAO.getUserIdFromToken(token)
      if (userId) {
        req.userId = userId;
        next();
      } else {
        console.log('no user')
        res.status(401).send(JSON.stringify({ error: 'user not found' }));
      }
    } else {
      console.log('no token')
      res.status(401).send(JSON.stringify({ error: 'invalid token' }));
    }
  } else {
    console.log('no header')
    res.status(401).send(JSON.stringify({ error: 'no header' }));
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

const isValidId = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)){
    res.status(400).send('Must pass in valid Id')
  } else {
    next();
  }
}

exports.isAuthorized = isAuthorized;
exports.emailAndPassword = emailAndPassword;
exports.isValidId = isValidId;
