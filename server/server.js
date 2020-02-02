const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// import routes
const authRoutes = require('./routes/auth')

// app middlewares
app.use(morgan('dev'))

// middlewares
// anything comes to /api will be forwarded to authRoutes
app.use('/api', authRoutes)

const port = process.env.port || 8000
app.listen(port, () => {
    console.log(`API is running on port ${port}`)
})