const express = require('express')
const cookieparser = require('cookie-parser')
const authRouter = require('../src/routes/auth.route')
const chatRouter = require('../src/routes/chat.route')

const app = express()
app.use(express.json());
app.use(cookieparser());

app.use('/api/auth',authRouter)
app.use('/api/chat',chatRouter)

module.exports = app