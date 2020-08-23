const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const { isAuthorized, emailAndPassword } = require("./middleware.js")
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token')
const Token = require('../models/token');
const User = require('../models/user');

// Login
router.post("/", emailAndPassword, async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await userDAO.getUser(email);
    if (user && await bcrypt.compare(password, user.password)) {
      try {
        const token = await tokenDAO.getTokenForUserId(user._id)
        res.json({ token: token })
      } catch(e) {
        next(e);
      }
    } else {
      res.status(401).send('invalid login')
    }
  } catch(e) {
    next(e)
  }
});

// Signup
router.post("/signup", emailAndPassword, async (req, res, next) => {
  const { email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await userDAO.createUser({ email: email, password: encryptedPassword });
    res.json(user);
  } catch(e) {
    next(e);
  }
})

// Password
router.post("/password", isAuthorized, async (req, res, next) => {
  const { password } = req.body
  if (!password) {
    res.status(400).send('password is required')
  } else {
    try {
      const encryptedPassword = await bcrypt.hash(password, 10);
      await userDAO.updateUserPassword(req.userId, encryptedPassword);
      res.status(200).send('success');
    } catch(e) {
      next(e);
    }
  }
})

// Logout
router.post("/logout", isAuthorized, async (req, res, next) => {
  const deletedToken = await tokenDAO.removeToken(req.token);
  if (deletedToken === true) {
    res.status(200).send('success');
  } else {
    res.status(401).send('failure');
  }
})


// errors
router.use(async (error, req, res, next) => {
  if (error instanceof userDAO.BadDataError) {
    res.status(409).send(error.message);
  } else {
    res.status(500).send('something went wrong');
  }
});

module.exports = router;
