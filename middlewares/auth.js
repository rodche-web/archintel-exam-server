require('dotenv').config()
const User = require('../models/userModel.js')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access token is required' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' })
    }
}


const isEditor = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
        if (user?.type !== 'Editor') {
            return res.status(403).json({ message: 'Editor access required' })
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error checking Editor status' })
    }
}

module.exports = { verifyToken, isEditor }