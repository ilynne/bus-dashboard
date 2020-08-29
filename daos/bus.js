const mongoose = require('mongoose');

const Bus = require('../models/bus');

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
        const buses = await Bus.aggregate([
            // to finish
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