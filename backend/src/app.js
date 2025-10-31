const express = require('express')
const cookieparser = require('cookie-parser')
const authRouter = require('../src/routes/auth.route')
const chatRouter = require('../src/routes/chat.route')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors({
    origin: "https://bubble-ai-z0vn.onrender.com",
    credentials: true,
}));
app.use(express.json());
app.use(cookieparser());

app.use('/api/auth',authRouter)
app.use('/api/chat',chatRouter)

app.use(express.static(path.join(__dirname, '../public')))

app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api/')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


module.exports = app