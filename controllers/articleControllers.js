const Article = require('../models/articleModel.js')

const createArticle = async (req, res) => {
    try {
      const { 
        image, 
        title, 
        link, 
        content, 
        writer, 
        editor, 
        company 
      } = req.body
  
      if (!image || !title || !link || !content || !company) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          requiredFields: ['image', 'title', 'link', 'content', 'company']
        })
      }
  
      const newArticle = new Article({
        image: req.body.image,
        title: req.body.title,
        link: req.body.link,
        content: req.body.content,
        writer: req.body.writer,
        editor: req.body.editor,
        company: req.body.company,
        status: req.body.status || 'For Edit',
        date: req.body.date || new Date()
      })
   
      const savedArticle = await newArticle.save()
  
      res.status(201).json({
        message: 'Article created successfully',
        article: savedArticle
      })
    } catch (error) {
      res.status(500).json({ 
        message: 'Error creating article', 
        error: error.message 
      })
    }
}
const getAllArticles = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const skipIndex = (page - 1) * limit
  
      const filter = {};
      if (req.query.status) filter.status = req.query.status
      if (req.query.writer) filter.writer = req.query.writer
      if (req.query.editor) filter.editor = req.query.editor
      if (req.query.company) filter.company = req.query.company
  
      const sort = {};
      if (req.query.sortBy) {
        sort[req.query.sortBy] = req.query.order === 'desc' ? -1 : 1
      } else {
        sort.date = -1 
      }
  
      const articles = await Article.find(filter)
        .sort(sort)
        .skip(skipIndex)
        .limit(limit)
        .populate('writer', 'firstName lastName')
        .populate('editor', 'firstName lastName')
        .populate('company', 'name')
  
      const totalArticles = await Article.countDocuments(filter)
  
      return res.status(200).json({
        articles,
        currentPage: page,
        totalPages: Math.ceil(totalArticles / limit),
        totalArticles
      })
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error fetching articles', 
        error: error.message 
      })
    }
}
const getSingleArticle = async (req, res) => {
    try {
      const article = await Article.findById(req.params.id)
        .populate('writer', 'firstName lastName')
        .populate('editor', 'firstName lastName')
        .populate('company', 'name');
  
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
  
      res.status(200).json(article);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching article', 
        error: error.message 
      })
    }
}

const updateArticle = async (req, res) => {
    try {
      const updateFields = {
        image: req.body.image,
        title: req.body.title,
        link: req.body.link,
        content: req.body.content,
        status: req.body.status,
        writer: req.body.writer,
        editor: req.body.editor,
        company: req.body.company,
        date: req.body.date
      }
  
      Object.keys(updateFields).forEach(key => 
        updateFields[key] === undefined && delete updateFields[key]
      )
      const updatedArticle = await Article.findByIdAndUpdate(
        req.params.id, 
        updateFields, 
        { 
          new: true, 
          runValidators: true 
        }
      )
  
      if (!updatedArticle) {
        return res.status(404).json({ message: 'Article not found' })
      }
  
      res.status(200).json({
        message: 'Article updated successfully',
        article: updatedArticle
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error updating article', 
        error: error.message 
      })
    }
}

const deleteArticle = async (req, res) => {
    try {
      const deletedArticle = await Article.findByIdAndDelete(req.params.id)
  
      if (!deletedArticle) {
        return res.status(404).json({ message: 'Article not found' })
      }
  
      res.status(200).json({
        message: 'Article deleted successfully',
        article: deletedArticle
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Error deleting article', 
        error: error.message 
      })
    }
}

module.exports = {
    createArticle,
    getAllArticles,
    getSingleArticle,
    updateArticle,
    deleteArticle
}