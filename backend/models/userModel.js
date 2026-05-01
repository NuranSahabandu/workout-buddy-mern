const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    }
})

// static singup method
userSchema.statics.signup = async function (email, password) {

    // validation
    if(!email || !password) {
        throw Error('All fields must be filled')
    }

    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }


    const exists = await this.findOne({ email })

    if(exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash })

    return user

}


// static login method
userSchema.statics.login = async function (email, password) {

    // validation
    if(!email || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })

    if(!user) {
        throw Error('Incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error('Incorrect password')
    }

    return user
}

userSchema.statics.updateProfile = async function (_id, { name, email, currentPassword, newPassword }) {
    const user = await this.findById(_id)
    if (!user) {
        throw Error('User not found')
    }

    const updates = {}

    // Name can be changed freely — no password needed
    if (name !== undefined) {
        updates.name = name
    }

    // Email or password changes require current password verification
    const isSensitiveChange = (email && email !== user.email) || newPassword

    if (isSensitiveChange) {
        if (!currentPassword) {
            throw Error('Current password is required to change email or password')
        }
        const match = await bcrypt.compare(currentPassword, user.password)
        if (!match) {
            throw Error('Current password is incorrect')
        }

        if (email && email !== user.email) {
            if (!validator.isEmail(email)) {
                throw Error('Email is not valid')
            }
            const emailExists = await this.findOne({ email })
            if (emailExists) {
                throw Error('Email already in use')
            }
            updates.email = email
        }

        if (newPassword) {
            if (!validator.isStrongPassword(newPassword)) {
                throw Error('New password not strong enough')
            }
            const salt = await bcrypt.genSalt(10)
            updates.password = await bcrypt.hash(newPassword, salt)
        }
    }

    const updatedUser = await this.findByIdAndUpdate(_id, updates, { new: true })
    return updatedUser
}

module.exports = mongoose.model('User', userSchema)