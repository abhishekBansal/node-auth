const User = require('../models/user')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const _ = require('lodash')


exports.signup = (req, res) => {
    const { name, email, password } = req.body

    User.findOne({ email: email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken'
            })
        }

        const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '10m' })

        const activationEmail = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Account Activation Link`,
            html: `
                <p> Please click on below link to activate your account </p>
                <p> ${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p> ${process.env.CLIENT_URL}</p>
            `
        }

        sgMail.send(activationEmail)
            .then(sent => {
                // console.log("Signup email sent", sent)

                return res.json({
                    message: `Email has been sent to ${email}`
                })
            })
            .catch(err => {
                console.log(`error while sending email to ${email}`)
                return res.json({
                    message: err.message
                })
            })
    })
}

exports.accountActivation = (req, res) => {
    const { token } = req.body

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (err, decodedToken) {
            if (err) {
                console.log("Token verification error", err.message)
                return res.status(400).json({
                    error: 'Expired link, signup again'
                })
            }

            const { name, email, password } = jwt.decode(token)
            const user = new User({ name, email, password })
            user.save((err, user) => {
                if (err) {
                    console.log("error saving user", err.message)
                    return res.status(401).json({
                        error: 'Error saving user in database, Try signup again.'
                    })
                }

                return res.json({
                    message: 'Signup Sucess, Please sign in'
                })
            })
        })
    } else {
        return res.status(401).json({
            message: 'UnAuthorized'
        })
    }
}

exports.signin = (req, res) => {
    const { email, password } = req.body
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        // if user exist
        console.log(password)
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password do not match"
            })
        }

        // generater a token and send to client
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        const { _id, name, email, role } = user

        return res.json({
            token, user: {
                _id, name, email, role
            }
        })
    })
}

exports.requireSignIn = expressJwt({
    // adds req.user in every request
    secret: process.env.JWT_SECRET
})

exports.adminMiddleware = (req, res, next) => {
    User.findById({ _id: req.user._id }).exec((err, user) => {
        if (err || !user) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Access Denied'
            })
        }

        req.profile = user
        next()
    })
}

exports.forgotPassword = (req, res) => {
    const {email} = req.body

    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, 
            { expiresIn: '10m' })

        const activationEmail = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password Reset Link`,
            html: `
                <p> Please click on below link to reset your password </p>
                <p> ${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p> ${process.env.CLIENT_URL}</p>
            `
        }

        return user.updateOne({resetPasswordLink: token}, (err, success) => {
            if(err) {
                return res.json({
                    message: err.message
                })
            }

            sgMail.send(activationEmail)
            .then(sent => {
                // console.log("Signup email sent", sent)

                return res.json({
                    message: `Email has been sent to ${email}`
                })
            })
            .catch(err => {
                console.log(`error while sending email to ${email}`)
                return res.json({
                    message: err.message
                })
            })
        })
    })
}

exports.resetPassword = (req, res) => {
    const {resetPasswordLink, newPassword} = req.body

    if(resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if(err) {
                return res.status(400).json({
                    error: 'Token Expired, try again'
                })
            }

            User.findOne({resetPasswordLink}, (err, user) => {
                if(err || !user) {
                    return res.status(400).json({
                        error: 'something went wrong'
                    })
                }

                const updatedFields = {
                    password: newPassword,
                    resetPasswordLink: ''
                }

                user = _.extend(user, updatedFields)
                user.save((err, result) => {
                    if(err) {
                        return res.status(400).json({
                            error: 'Something went wrong saving user'
                        })
                    }

                    return res.json({
                        message: "Please login with your new password"
                    })
                })
            })
        })
    }
}

// Signup without email confirmation
// exports.signup = (req, res) => {
//     const { name, email, password } = req.body

//     User.findOne({ email: email }).exec((err, user) => {
//         if(user) {
//             return res.status(400).json({
//                 error: 'Email is taken'
//             })
//         }
//     })

//     let newUser = new User({name, email, password})
//     newUser.save((err, success) => {
//         if(err) {
//             console.log("Signup Error", err)
//             return res.status(400).json({
//                 error: err
//             })
//         }

//         res.json({
//             email: newUser.email, 
//             role: newUser.role, 
//             name: newUser.name
//         })
//     })
// }