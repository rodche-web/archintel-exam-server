const Article = require('../models/articleModel.js')
const Company = require('../models/companyModel.js')

const createCompany = async (req, res) => {
    try {
      const { logo, name } = req.body
  
      if (!logo || !name) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          requiredFields: ['logo', 'name']
        })
      }
  
      const newCompany = new Company({
        logo: req.body.logo,
        name: req.body.name,
        status: req.body.status || 'Active'
      })
  
      const savedCompany = await newCompany.save()
  
      res.status(201).json({
        message: 'Company created successfully',
        company: savedCompany
      })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ 
          message: 'A company with this name already exists', 
          error: error.message 
        })
      }
  
      res.status(500).json({ 
        message: 'Error creating company', 
        error: error.message 
      })
    }
}
const getAllCompanies = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const skipIndex = (page - 1) * limit
  
      const filter = {}
      if (req.query.status) filter.status = req.query.status;
      if (req.query.name) filter.name = new RegExp(req.query.name, 'i')
  

      const sort = {}
      if (req.query.sortBy) {
        sort[req.query.sortBy] = req.query.order === 'desc' ? -1 : 1
      } else {
        sort.createdAt = -1
      }
  
      const companies = await Company.find(filter)
        .sort(sort)
        .skip(skipIndex)
        .limit(limit)
  
      const companiesWithArticleCount = await Promise.all(
        companies.map(async (company) => {
          const articleCount = await Article.countDocuments({ company: company._id });
          return {
            ...company.toObject(),
            articleCount
          }
        })
      )
  
      const totalCompanies = await Company.countDocuments(filter);
  
      res.status(200).json({
        companies: companiesWithArticleCount,
        currentPage: page,
        totalPages: Math.ceil(totalCompanies / limit),
        totalCompanies
      })
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching companies', 
        error: error.message 
      })
    }
}

const getSingleCompany = async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);
  
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
  
      const articles = await Article.find({ company: req.params.id })
        .populate('writer', 'firstName lastName')
        .populate('editor', 'firstName lastName')
        .select('title status date');
  
      res.status(200).json({
        company,
        articles: {
          total: articles.length,
          list: articles
        }
      })
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching company', 
        error: error.message 
      })
    }
}

const updateCompany = async (req, res) => {
    try {
      const updateFields = {
        logo: req.body.logo,
        name: req.body.name,
        status: req.body.status
      }
  
      Object.keys(updateFields).forEach(key => 
        updateFields[key] === undefined && delete updateFields[key]
      )
  
      const updatedCompany = await Company.findByIdAndUpdate(
        req.params.id, 
        updateFields, 
        { 
          new: true, 
          runValidators: true 
        }
      )
  
      if (!updatedCompany) {
        return res.status(404).json({ message: 'Company not found' });
      }
  
      res.status(200).json({
        message: 'Company updated successfully',
        company: updatedCompany
      })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ 
          message: 'A company with this name already exists', 
          error: error.message 
        })
      }
  
      res.status(500).json({ 
        message: 'Error updating company', 
        error: error.message 
      })
    }
}
const deleteCompany = async (req, res) => {
    const session = await mongoose.startSession();
    
    try {
      await session.startTransaction()
  
      const articleCount = await Article.countDocuments({ 
        company: req.params.id 
      }).session(session)
  
      if (articleCount > 0) {
        await session.abortTransaction()
        session.endSession()
        
        return res.status(400).json({ 
          message: 'Cannot delete company with associated articles',
          articleCount
        })
      }
  
      const deletedCompany = await Company.findByIdAndDelete(
        req.params.id, 
        { session }
      )
  
      if (!deletedCompany) {
        await session.abortTransaction()
        session.endSession()
        
        return res.status(404).json({ message: 'Company not found' })
      }
  
      await session.commitTransaction()
      session.endSession()
  
      res.status(200).json({
        message: 'Company deleted successfully',
        company: deletedCompany
      })
    } catch (error) {
      await session.abortTransaction();
      session.endSession()
  
      res.status(500).json({ 
        message: 'Error deleting company', 
        error: error.message 
      })
    }
}

module.exports = {
    createCompany,
    getAllCompanies,
    getSingleCompany,
    updateCompany,
    deleteCompany,
}