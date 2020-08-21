const mongoose = require('mongoose');

const Group = require('../models/group');

module.exports = {};

module.exports.create = async(userId, origin, destination, isDefault) => {
    try {
        const newGroup = await Group.create({
            userId: userId,
            origin: origin,
            destination: destination,
            isDefault: isDefault
        });
        return newGroup
    } catch (e) {
        throw e;
    }
};

module.exports.getByOrigin = async () => {};

module.exports.getByDestination = async () => {};

module.exports.getByOriginAndDestination = async () => {};

module.exports.getByOriginAndDestination = async () => {};

module.exports.getByUserId = async () => {};

module.exports.getAssociatedUserId = async () => {};

module.exports.getById = async () => {};

module.exports.updateById = async () => {};

module.exports.deleteById = async (groupId) => {
    const validId = await mongoose.Types.ObjectId.isValid(groupId);
    try{
        if (validId) {
            await Group.remove({ _id: groupId })
        }
    } catch (e) {
        throw e;
    }
}

// DAO operations