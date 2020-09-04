const User = require('../models/user');

module.exports = {};

module.exports.createUser = async (userObj) => {
  try {
    const user = await User.create(userObj);
    const userNoPW = {
      _id: user._id,
      email: user.email,
      __v: user.__v
    };
    return userNoPW;
  } catch(e) {
    if (e.message.includes('validation failed')) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
}

module.exports.getUser = async (email) => {
  try {
    return await User.findOne({ email: email }).lean();
  } catch(e) {
    throw e;
  }
}

module.exports.updateUserPassword = async (userId, password) => {
  try {
    return await User.update({ _id: userId }, { password: password })
  } catch(e) {
    throw e;
  }
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;
