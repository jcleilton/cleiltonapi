const { response } = require("express")
const express = require("express")
const router = express.Router()
const db = require("../db")
const User = require("../model/user")
const { validateRegistration, validateLogin } = require('./validator')
const strings = require("../model/localizedString")
const bcrypt = require("bcryptjs")
const { password } = require("../db/env")
const jwt = require("jsonwebtoken")

const createUser = async (user) => {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(user.password, salt)

    let createdUser = await User.create({
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        password: password
    })
    console.log(createdUser)
    return createdUser
}

const validateToken = async (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return rres.send({ message: strings.unauthorizedError, errorCode: 401 })

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch (err) {
        return res.send({ message: strings.unauthorizedError, errorCode: 401 })
    }
}


router.post('/register', async (req, res) => {
    let { error } = validateRegistration(req.body)

    if (error) return res.send({ message: error.details[0].message, errorCode: 400 })

    const existenteUser = await User.findAll({ where: { email: req.body.email } })
    if (existenteUser[0]) {
        return res.send({ message: strings.registrationError, errorCode: 400 })
    } 

    let user = await createUser(req.body)
    if (!user) return res.send({ message: strings.registrationError, errorCode: 400 })
    res.send({ id: user.id, name: user.name, lastname: user.lastname, email: user.email })
})

router.post('/login', async (req, res) => {
    let { error } = validateLogin(req.body)
    console.log(error)

    if (error) return res.send({ message: error.details[0].message, errorCode: 401 })

    const existentsUser = await User.findAll({ where: { email: req.body.email } })

    const existentUser = existentsUser[0]

    if (!existentUser) {
        return res.send({ message: strings.loginError, errorCode: 401 })
    } 

    const validPass = await bcrypt.compare(req.body.password, existentUser.password)

    if (!validPass) return res.send({ message: strings.loginError, errorCode: 401 })

    const token = jwt.sign({ id: existentUser.id}, process.env.TOKEN_SECRET)

    res.send({ 
        user: { 
            id: existentUser.id, 
            name: existentUser.name, 
            lastname: existentUser.lastname, 
            email: existentUser.email 
        },
        token: token 
    })
})

router.get('/testing/auth', validateToken, async (req, res) => {
    const user = await User.findByPk(req.user.id)

    if (!user) return res.send({ message: strings.unauthorizedError, errorCode: 401 })

    res.send({
        user: {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            id: user.id
        },
        message: strings.testingAuth
    })
})

module.exports = router