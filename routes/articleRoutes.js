const express = require('express')
const router = express.Router()
const { verifyToken, isEditor } = require('../middlewares/auth.js')
const { validateObjectId } = require('../middlewares/validations.js')
const {
  createArticle, 
  getAllArticles, 
  getSingleArticle, 
  updateArticle, 
  deleteArticle
} = require('../controllers/articleControllers.js')

router.post('/', verifyToken, isEditor, createArticle)

router.get('/', verifyToken, isEditor, getAllArticles)

router.get('/:id', verifyToken, isEditor, validateObjectId, getSingleArticle)

router.put('/:id', verifyToken, isEditor, validateObjectId, updateArticle)

router.delete('/:id', verifyToken, isEditor, validateObjectId, deleteArticle)

module.exports = router