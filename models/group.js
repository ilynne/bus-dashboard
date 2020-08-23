const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    isDefault: { type: Boolean, default: false, required: true}
});

module.exports = mongoose.model("groups", groupSchema);