const express = require('express')
const router = express.Router()
const { verifyToken, isEditor } = require('../middlewares/auth.js')
const {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    getProfile
} = require('../controllers/userControllers.js')

router.get('/', verifyToken, isEditor, getAllUsers)

router.get('/:id', verifyToken, getSingleUser);

router.put('/:id', verifyToken, updateUser);

router.delete('/:id', verifyToken, deleteUser);

router.get('/me/profile', verifyToken, getProfile);

module.exports = router