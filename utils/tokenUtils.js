require('dotenv').config()
const jwt = require('jsonwebtoken')

const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRATION }
    )

    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
    )

    return { accessToken, refreshToken }
}

module.exports = { generateTokens }