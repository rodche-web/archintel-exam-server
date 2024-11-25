const express = require('express')
const router = express.Router()
const {uploadFile} = require('../controllers/fileControllers')

router.get('/upload', uploadFile)

module.exports = router

