const express = require('express')
const { signupUser, loginUser, updateProfile } = require('../controllers/userController')
const requireAuth = require('../middleware/requireauth')

const router = express.Router()

// public routes
router.post('/login', loginUser)
router.post('/signup', signupUser)

// protected routes
router.patch('/profile', requireAuth, updateProfile)

module.exports = router