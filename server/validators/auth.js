const {check} = require('express-validator')

exports.signupChecks = [
    check('name').not().isEmpty()
    .withMessage("Name is required"),

    check('email').not().isEmpty()
    .isEmail()
    .withMessage("Must be a valid email address"),

    check('password').not().isEmpty()
    .isLength({min: 6})
    .withMessage("Password must be atleast 6 characters long")
]

exports.signinChecks = [
    check('email').not().isEmpty()
    .isEmail()
    .withMessage("Must be a valid email address"),

    check('password').not().isEmpty()
    .isLength({min: 6})
    .withMessage("Password must be atleast 6 characters long")
]

exports.forgotPasswordChecks = [
    check('email').not().isEmpty()
    .isEmail()
    .withMessage("Must be a valid email address"),
]

exports.resetPasswordChecks = [
    check('newPassword').not().isEmpty()
    .isLength({min: 6})
    .withMessage("Password must be atleast 6 characters long"),
]