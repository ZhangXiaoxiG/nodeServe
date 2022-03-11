const Joi = require('joi');
const user = Joi.object({
    account: Joi.string()
        .pattern(new RegExp('^[1][3-9][0-9]{9}$')),
    password: Joi.string()
        .min(6)
        .max(16)
        .required(),
    username:Joi.string()
})
module.exports = user;
