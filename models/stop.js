const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'groups', required: true },
    stopId: { type: String, required: true },
    busId: { type: String, required: true }
});

stopSchema.index({ groupId: 1, stopId: 1, busId: 1 }, { unique: true });

module.exports = mongoose.model("stops", stopSchema);
