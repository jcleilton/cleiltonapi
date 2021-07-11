const Joi = require("joi")

const schemaForRegistration = {
    name: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(6).required()
}

const validateRegistration = (user) => {
    const joi = Joi.object().keys(schemaForRegistration)
    let validation = joi.validate(user)
    return validation
}

const schemaForLogin = {
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(6).required()
}

const validateLogin = ({ email, password }) => {
    const joi = Joi.object().keys(schemaForLogin)
    let validation = joi.validate({ email, password })
    return validation
}

module.exports = { validateRegistration, validateLogin }
