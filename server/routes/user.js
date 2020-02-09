const express = require('express')
const router = express.Router()

//import controller 
const {read, update} = require('../controllers/user')
const {requireSignIn, adminMiddleware} = require('../controllers/auth')
// validate and route
router.get('/user/:id', requireSignIn, read)
router.put('/user', requireSignIn, update)
router.put('/admin', requireSignIn, adminMiddleware, update)

module.exports = router