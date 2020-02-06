const express = require('express')
const router = express.Router()

//import controller 
const {signup, accountActivation, signin} = require('../controllers/auth')
// validations
const {signupChecks, signinChecks} = require('../validators/auth')
const {runValidation} = require('../validators')
// validate and route
router.post('/signup', signupChecks, runValidation, signup)
router.post('/account-activation', accountActivation)
router.post('/signin', signinChecks, runValidation, signin)


module.exports = router