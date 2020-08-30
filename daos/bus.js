const mongoose = require('mongoose');

const Bus = require('../models/bus');
const Group = require('../models/group');
const stop = require('../models/stop');

module.exports = {};

module.exports.create = async(stopId, busId) => {
    try {
        const newBus = await Bus.create({
            stopId: stopId,
            busId: busId
        });
        return newBus;
    } catch (e) {
        if (e.message.includes('duplicate key')) {
            throw new BadDataError(e.message);
        }
        throw e;
    }
}

module.exports.getByStopId = async (stopId) => {
    try {
        const buses = await Bus.find({ stopId: stopId }).lean();
        return buses;
    } catch (e) {
        throw e;
    }
}

module.exports.getByStopAndGroup = async (stopId, groupId) => {
    try {
        // this will need some fine tuning
        const buses = await Group.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(groupId) } },
            { $lookup: {
                from: "stops",
                localField: "_id",
                foreignField: "groupId",
                as: "stops"
            }},
            { $project: { __v: 0, _id: 0, destination: 0, name: 0, origin: 0, userId: 0}},
            { $match: { "stops.stopId": stopId}},
            { $lookup: {
                from: "buses",
                localField: "stops._id",
                foreignField: "stopId",
                as: "buses"
            }},
            { $project: {buses: 1}},
            { $unwind: "$buses"},
        ]);
        return buses;
    } catch (e) {
        throw e;
    }
}

module.exports.getAll = async () => {
    try {
        const buses = await Bus.find({}).lean();
        return buses;
    } catch (e) {
        throw e;
    }
}

module.exports.getById = async (id) => {
    try {
        const buses = await Bus.findOne({ _id: id }).lean();
        return buses;
    } catch (e) {
        throw e;
    }
}

module.exports.updateById = async (id, stopId, busId) => {
    let updateObj = {};
    if (stopId) { updateObj.stopId = stopId};
    if (busId) { updateObj.busId = busId};

    try {
        const updatedBus = await Bus.update({ _id: id }, updateObj);
        return updatedBus;
    } catch (e) {
        throw e;
    }
}

module.exports.deleteById = async (id) => {
    try{
        await Bus.deleteOne({ _id: id });
        return true;
    } catch {
        return false;
    }
}

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;