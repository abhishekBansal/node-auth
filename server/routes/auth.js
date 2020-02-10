const express = require('express')
const router = express.Router()

//import controller 
const { signup, accountActivation, signin,
resetPassword, forgotPassword } = require('../controllers/auth')
// validations
const { signupChecks, signinChecks, 
    forgotPasswordChecks, resetPasswordChecks } = require('../validators/auth')
const { runValidation } = require('../validators')

// validate and route
router.post('/signup', signupChecks, runValidation, signup)
router.post('/account-activation', accountActivation)
router.post('/signin', signinChecks, runValidation, signin)
router.post('/forgot-password', forgotPasswordChecks, runValidation, forgotPassword)
router.post('/reset-password', resetPasswordChecks, runValidation, resetPassword)

module.exports = router