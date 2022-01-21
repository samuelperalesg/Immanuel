const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cardSchema = new Schema({
  title: String,
  link: String,
  scripture: String,
  description: String
}, {timestamps: true})

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: {
    type: String,
    select: false
  },
  cards: [cardSchema]
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)  
