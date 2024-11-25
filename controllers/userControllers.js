const User = require('../models/userModel.js')

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password')
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error fetching users' })
    }
}
const getSingleUser =  async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error fetching user' })
    }
}
const updateUser = async (req, res) => {
    try {
        const { password, type, ...updateData } = req.body

        if (type && req.user.type === 'Editor') {
            updateData.type = type
        }

        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (password) {
            user.password = password
            await user.save();
        }

        Object.assign(user, updateData)
        await user.save();

        res.json(user.toSafeObject())
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error updating user' })
    }
}
const deleteUser = async (req, res) => {
    try {
        if (req.user.userId !== req.params.id && req.user.type !== 'Editor') {
            return res.status(403).json({ message: 'Access denied' })
        }

        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        await User.findByIdAndDelete(req.params.id)

        res.json({ message: 'User deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error deleting user' })
    }
}
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId, '-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error fetching profile' })
    }
}

module.exports = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    getProfile
}