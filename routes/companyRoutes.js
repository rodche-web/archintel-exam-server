const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { verifyToken, isEditor } = require('../middlewares/auth.js')
const { validateObjectId } = require('../middlewares/validations.js')
const {
  createCompany,
  getAllCompanies,
  getSingleCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyControllers.js')

router.post('/', verifyToken, isEditor, createCompany)

router.get('/', verifyToken, isEditor, getAllCompanies)

router.get('/:id', verifyToken, isEditor, validateObjectId, getSingleCompany)

router.put('/:id', verifyToken, isEditor, validateObjectId, updateCompany)

router.delete('/:id', verifyToken, isEditor, validateObjectId, deleteCompany)

module.exports = router