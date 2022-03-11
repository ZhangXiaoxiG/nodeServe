const Joi = require('joi');
const login = Joi.object({
    account: Joi.string()
        .pattern(new RegExp('^[1][3,4,5,7,8,9][0-9]{9}$')),
    password: Joi.string()
        .min(6)
        .max(16)
        .required(),
})
module.exports = login;
