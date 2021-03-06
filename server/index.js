require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const app = express()
const Ctrl = require('./controller')

const {CONNECTION_STRING, SESSION_SECRET, SERVER_PORT} = process.env

app.use(express.json())
app.use(session({
    resave: false,
    saveUnintialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 72},
    secret: SESSION_SECRET
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then(db => {
    app.set('db', db)
    console.log('connected to db')
}).catch(err => console.log(err))

app.post('/api/auth/login', Ctrl.register)
app.post('/api/auth/dashboard', Ctrl.login)
app.post('/api/auth/logout', Ctrl.logout)

app.listen(SERVER_PORT, () => console.log(`Server running on ${SERVER_PORT}`))