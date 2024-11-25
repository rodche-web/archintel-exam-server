const User = require('../models/userModel.js')
const { generateTokens } = require('../utils/tokenUtils.js')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        const { email, password, lastName, firstName, status, type } = req.body

        if (!email || !password || !lastName || !firstName || !status || !type) {
            return res.status(400).json({ message: 'Incomplete fields' })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        const user = new User({ email, password, lastName, firstName, status, type })
        await user.save()

        res.status(201).json({
            message: 'User registered successfully'
        })
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error registering user' })
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isValidPassword = await user.comparePassword(password)
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const { accessToken, refreshToken } = generateTokens(user._id)

        await user.save()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({ accessToken, userId: user._id, userType: user.type })
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' })
    }
}
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).send('Refresh token not found')

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        const user = await User.findById(decoded.userId)

        if (!user) {
            return res.status(403).send('Invalid refresh token')
        }

        const { accessToken, refreshToken } = generateTokens(user._id)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({ accessToken, userId: user._id, userType: user.type })
    } catch (error) {
        res.status(403).send(error.message || 'Invalid refresh token')
    }
}
const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        if (user) {
            user.refreshToken = null
            await user.save()
        }
        res.json({ message: 'Logged out successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error logging out' })
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    logout
}