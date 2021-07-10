const express = require("express")
const router = express.Router()
const db = require("../db")

let myCall = router.get('/', async (req, res, next) => {
    try {
        let results = await db.allUsers()
        res.json(results)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
})

module.exports = myCall