const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    stopId: { type: mongoose.Schema.Types.ObjectId, ref: 'stops', required: true },
    busId: { type: String, required : true}
});

busSchema.index({ stopId: 1, busId: 1 }, { unique: true });

module.exports = mongoose.model("buses", busSchema);