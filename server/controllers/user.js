const User = require('../models/user')


exports.read = (req, res) => {
    const userId = req.params.id
    User.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status(404).json({
                error: "User not found"
            })
        }

        const { email, name, id, role } = user
        return res.json({ email, name, id, role });
    })
}

exports.update = (req, res) => {
    console.log('Update User', req.user, 'Update Data', req.body)
    const {name, password} = req.body

    User.findOne({_id: req.user._id}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }

        if(!name) {
            return res.status(400).json({
                error: 'Name is required'
            })
        } else {
            user.name = name
        }

        if(password) {
            if(password.length < 6) {
                return res.status(400).json({
                    error: 'Password min length is 6'
                })
            } else {
                user.password = password
            }
        }

        user.save((err, updatedUser) => {
            if(err) {
                return res.status(400).json({
                    error: err.message
                })
            } else {
                const { email, name, id, role } = updatedUser
                return res.json({email, name, id, role})
            }
        })
    })
}