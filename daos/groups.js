const mongoose = require('mongoose');

const Group = require('../models/group');

module.exports = {};

module.exports.create = async(userId, name, origin, destination, isDefault) => {
    try {
        const newGroup = await Group.create({
            userId: userId,
            name: name,
            origin: origin,
            destination: destination,
        });
        return newGroup;
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

module.exports.getByDestination = async (destination) => {
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
        return groups;
    } catch (e) {
        throw e;
    }
};

module.exports.getUserIdFromGroupId = async (groupId) => {
    try {
        const group = await Group.findOne({ _id: groupId });
        return group.userId;
    } catch (e) {
        throw e;
    }
};

module.exports.getByIdAndUserId = async (groupId, userId) => {
    try {
        const group = await Group.findOne({ _id: groupId, userId: userId }).lean();
        return group;
    } catch (e) {
        throw e;
    }
};

module.exports.updateById = async (groupId, name, origin, destination) => {
    let updateObj = {};
    if (name) { updateObj.name = name};
    if (origin) { updateObj.origin = origin};
    if (destination) { updateObj.destination = destination};

    try {
        const updatedGroup = await Group.update({ _id: groupId }, updateObj);
        return updatedGroup;
    } catch (e) {
        throw e;
    }
};

module.exports.deleteById = async (groupId) => {
    try {
        await Group.deleteOne({ _id: groupId });
        return true;
    } catch {
        return false;
    }  
}