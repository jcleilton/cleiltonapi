const Joi = require("@hapi/joi")

const schemaForRegistration = {
    name: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(6).required()
}

const validateRegistration = (user) => {
    let validation = Joi.valid(user, schemaForRegistration)
    return validation
}

const schemaForLogin = {
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(6).required()
}

const validateLogin = (email, password) => {
    let validation = Joi.valid({ email, password }, schemaForLogin)
    return validation
}

module.exports.validateRegistration = validateRegistration
module.exports.validateLogin = validateLogin