const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    origin: { type: String },
    destination: { type: String },
    isDefault: { type: Boolean, default: false }
});

groupSchema.index({ name: 'text', origin: 'text', destination: 'text' });

module.exports = mongoose.model("groups", groupSchema);