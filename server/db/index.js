const env = require("./env")
const Sequelize = require('sequelize')
const sequelize = new Sequelize(env.database, env.user, env.password, {dialect: env.dialect, host: env.host})

module.exports = sequelize