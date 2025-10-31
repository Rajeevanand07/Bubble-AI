const express = require('express')
const cookieparser = require('cookie-parser')
const authRouter = require('../src/routes/auth.route')
const chatRouter = require('../src/routes/chat.route')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieparser());
app.use(express.static(path.join(__dirname, '../public')))

app.use('/api/auth',authRouter)
app.use('/api/chat',chatRouter)

app.get('/:path(*)', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});



module.exports = app