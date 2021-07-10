const mysql = require("mysql")
const env = require("./env")

let pool = mysql.createPool(env)

let db = { }

db.allUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM simpleusers', (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve({
                users: results
            })
        })
    })
}

module.exports = db