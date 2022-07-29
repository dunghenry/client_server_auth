const { Schema, model } = require('mongoose');
const userVerificationSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    uniqueString: {
        type: String,
        required: true,
    },
    createAt: Date,
    expiresAt: Date,
});
const UserVerification = model('UserVerification', userVerificationSchema);
module.exports = UserVerification;