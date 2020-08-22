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

module.exports.getByOrigin = async (origin) => {
    try {
        const originResults = await Group.find(
            { $text: { $search: origin } },
            { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } }).lean();
        return originResults;
    } catch (e) {
        throw e;
    }
};

module.exports.getByDestination = async () => {
    try {
        const destinationResults = await Group.find(
            { $text: { $search: destination } },
            { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } }).lean();
        return destinationResults;
    } catch (e) {
        throw e;
    }
};

module.exports.getByOriginAndDestination = async (searchString) => {
    try {
        const searchResults = await Group.find(
            { $text: { $search: searchString } },
            { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } }).lean();
        return searchResults;
    } catch (e) {
        throw e;
    }
};

module.exports.getByUserId = async (userId) => {
    try {
        const groups = await Group.find({ userId: userId}).lean();
        return groups
    } catch (e) {
        throw e;
    }
};

module.exports.getAssociatedUserId = async (groupId) => {
    const validId = await mongoose.Types.ObjectId.isValid(groupId);
    try {
        if (validId) {
            const group = await Group.findOne({ _id: groupId });
            return group.userId
        }
    } catch (e) {
        throw e;
    }
};

module.exports.getById = async (groupId) => {
    try {
        const group = await Group.findOne({ _id: groupId }).lean();
        return group
    } catch (e) {
        throw e;
    }
};

module.exports.updateById = async (groupId, origin, destination, isDefault) => {
    try {
        const updatedGroup = await Group.update(
            { _id: groupId },
            { $set: {
                "origin": origin,
                "destination": destination,
                "isDefault": isDefault
                }
            }
 
        );
        return updatedGroup
    } catch (e) {
        throw e;
    }
};

module.exports.deleteById = async (groupId) => {
    try{
        await Group.remove({ _id: groupId })
    } catch (e) {
        throw e;
    }
}