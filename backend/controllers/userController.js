const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login user
const loginUser = async (req, res) => {
    const {email,password} = req.body

    try{
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, name: user.name ?? '', token})
    }catch(error){
        res.status(400).json({error: error.message})
    }

}


// singup user
const signupUser = async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await User.signup(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// update user profile
const updateProfile = async (req, res) => {
    const { name, email, currentPassword, newPassword } = req.body
    const _id = req.user._id

    try {
        const updatedUser = await User.updateProfile(_id, { name, email, currentPassword, newPassword })
        res.status(200).json({ email: updatedUser.email, name: updatedUser.name ?? '' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    loginUser,
    signupUser,
    updateProfile
}