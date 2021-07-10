const express = require("express")

const app = express()

let port = process.env.PORT || 3000

const path = require('path')
const router = require('./server/routes')

app.use('/users', router)

app.listen(port, () => {
    console.log("listening on " + port)
})