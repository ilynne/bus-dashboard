const mongoose = require('mongoose');

const Stop = require('../models/stop');

module.exports = {};

module.exports.create = async(groupId, stopId) => {
    try {
        const newStop = await Stop.create({
            groupId: groupId,
            stopId: stopId
        });
        return newStop;
    } catch (e) {
        throw e;
    }
};

module.exports.getByGroupId = async (groupId) => {
    try {
        const stops = await Stop.find({ groupId: groupId }).lean();
        return stops;
    } catch (e) {
        throw e;
    }
};

module.exports.getAll = async () => {
    try {
        const stops = await Stop.find({}).lean();
        return stops;
    } catch (e) {
        throw e;
    }
};

module.exports.getById = async (id) => {
    try {
        const stops = await Stop.findOne({ _id: id }).lean();
        return stops;
    } catch (e) {
        throw e;
    }
}

module.exports.updateById = async (id, groupId, stopId) => {
    let updateObj = {};
    if (groupId) { updateObj.groupId = groupId};
    if (stopId) { updateObj.stopId = stopId};

    try {
        const updatedStop = await Stop.update({ _id: id }, updateObj);
        return updatedStop;
    } catch (e) {
        throw e;
    }
}

module.exports.deleteById = async (stopId) => {
    try{
        await Stop.deleteOne({ _id: stopId });
        return true;
    } catch {
        return false;
    }
}