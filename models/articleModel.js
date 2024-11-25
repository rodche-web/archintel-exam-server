const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
    image: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    },
    date: {
      type: Date,
      default: Date.now
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['For Edit', 'Published'],
      default: 'For Edit'
    },
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    editor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Article', ArticleSchema)


