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
    if (!token) return res.sendStatus(401).send(strings.unauthorizedError)

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch (err) {
        return res.sendStatus(401).send({ message: strings.unauthorizedError, error: err })
    }
}


router.post('/register', async (req, res) => {
    let { error } = validateRegistration(req.body)

    if (error) return res.sendStatus(400).send(error.details)

    const existenteUser = await User.findOne({ where: { email: req.body.email } })
    if (existenteUser) {
        return res.sendStatus(400).send(strings.registrationError)
    } 

    let user = await createUser(req.body)
    if (!user) return response.sendStatus(500)
    res.sendStatus(200).send({ id: user.id, name: user.name, lastname: user.lastname, email: user.email })
})

router.post('/login', async (req, res) => {
    let { error } = validateLogin(req.body)
    console.log(error)

    if (error) return res.sendStatus(400).send(error.details)


    const existenteUser = await User.findAll({ where: { email: req.body.email } })
    if (!existenteUser) {
        return res.sendStatus(401).send(strings.loginError)
    } 

    console.log('passando na linha 67')

    const validPass = await bcrypt.compare(req.body.password, existenteUser.password)

    if (!validPass) return res.sendStatus(401).send(strings.loginError)

    console.log('passando na linha 73')

    const token = jwt.sign({ id: existenteUser.id}, process.env.TOKEN_SECRET)

    console.log('passando na linha 77')

    res.sendStatus(200).send({ 
        user: { 
            id: existenteUser.id, 
            name: existenteUser.name, 
            lastname: existenteUser.lastname, 
            email: existenteUser.email 
        },
        token: token 
    })
})

router.get('/testing/auth', validateToken, async (req, res) => {
    const user = await User.findByPk(req.user.id)

    if (!user) return res.sendStatus(401).send(strings.unauthorizedError)

    res.sendStatus(200).send({
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