const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('DB Connected'))
.catch(err =>  console.log('DB Conenction Error', err))

// import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

// app middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors()) // allows all origins

// OPTIONAL if you want to configure course
//          this is how its done, below restrict API calls
//          from localhost:3000 only
// if(process.env.NODE_ENV == 'development') {
//     app.use(cors({origin: 'http://localhost:3000'}))
// }

// middlewares
// anything comes to /api will be forwarded to authRoutes
app.use('/api', authRoutes)
app.use('/api', userRoutes)

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`API is running on port ${port}- ${process.env.NODE_ENV}`)
})