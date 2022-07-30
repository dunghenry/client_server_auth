const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
        expires: 365 * 24 * 60 * 60
    }
});
const UserToken = mongoose.model('UserToken', userTokenSchema);
module.exports = UserToken;