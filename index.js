require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 8000
const ORIGIN_URL = process.env.ORIGIN_URL || 'http://localhost:5173'

const app = express()
app.use(express.json())
app.use(cors({ credentials: true, origin: ORIGIN_URL }))
app.use(cookieParser())

app.use('/api/auth', require('./routes/authRoutes.js'))
app.use('/api/article', require('./routes/articleRoutes.js'))
app.use('/api/company', require('./routes/companyRoutes.js'))
app.use('/api/user', require('./routes/userRoutes.js'))
app.use('/api/file', require('./routes/fileRoutes.js'))

app.use('*', (req, res) => {
  return res.status(404).json({message: '404 Not Found'})
})

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server at port ${PORT}`))
  })
  .catch(err => console.error('MongoDB connection error:', err))