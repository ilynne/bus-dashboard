const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'groups', required: true },
    stopId: {
        type     : Number,
        required : true,
        unique   : true,
        validate : {
          validator : Number.isInteger,
          message   : '{VALUE} is not an integer value'
        }
      }
});

module.exports = mongoose.model("stops", stopSchema);