const Token = require('../models/token');
const { v4: uuidv4 } = require('uuid');

module.exports = {};

module.exports.getTokenForUserId = async (userId) => {
  const uuid = await uuidv4();
  const token = await Token.create({ userId: userId, uuid: uuid });
  return token.uuid;
}

module.exports.getUserIdFromToken = async (uuid) => {
  const token = await Token.findOne({ uuid: uuid }).lean();
  if (token) {
    return token.userId;
  } else {
    return false;
  }
}

module.exports.removeToken = async (uuid) => {
  try {
    await Token.deleteOne({ uuid: uuid });
    return true;
  } catch(e) {
    throw(e);
  }
}
