const Joi = require('joi');
const userValidation = (data) => {
    const userSchema = Joi.object({
        name: Joi.string().min(5).max(20).required,
        email: Joi.string().pattern(new RegExp('@gmail.com$')).email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,20}$')),
    });
    return userSchema.validate(data);
}
module.exports = userValidation;