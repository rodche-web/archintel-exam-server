require('dotenv').config()
const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middlewares/auth.js')
const {
    register,
    login,
    refreshToken,
    logout
} = require('../controllers/authControllers.js')

router.post('/register', register);

router.post('/login', login);

router.post('/refresh-token', refreshToken)

router.post('/logout', verifyToken, logout)

module.exports = router