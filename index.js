const express = require("express")

const app = express()

let port = process.env.PORT || 3000

const path = require('path')
const router = require('./server/routes')

const database = require("./server/db")

let connect = async () => {
    try {
        const result = await database.sync()
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}

connect()

app.use(express.json())

app.use('/api', router)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/home.html'))
})

app.listen(port, () => {
    console.log("listening on " + port)
})