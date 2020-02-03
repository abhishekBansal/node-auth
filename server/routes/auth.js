const express = require('express')
const router = express.Router()

//import controller 
const {signup} = require('../controllers/auth')
// validations
const {signupChecks} = require('../validators/auth')
const {runValidation} = require('../validators')
// validate and route
router.post('/signup', signupChecks, runValidation, signup)


module.exports = router