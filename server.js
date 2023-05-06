const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const auth = require('./middleware/auth')
const methodOverride = require('method-override')
const cloudinary = require('cloudinary')
const expressFileUpload = require('express-fileupload')



const indexController = require('./controllers/index')
const usersController = require('./controllers/users')
const cardsController = require('./controllers/cards')
const postsController = require('./controllers/posts')

const app = express()

app.set('view engine', 'ejs')

require('dotenv').config()

const { PORT = 3000, DATABASE_URL, SECRET, API_KEY, API_SECRET, CLOUD_NAME } = process.env

mongoose.connect(DATABASE_URL);
mongoose.set('strictQuery', true)

const db = mongoose.connection;

db
.on('connected', () => console.log('Connected to MongoDB'))
.on('disconnected', () => console.log('Disonnected from MongoDB'))
.on('error', (err) => console.log('An Error Has Occurred With MongoDB: ' + err.message));

app.use(express.static('public'))
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(expressSession({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(auth.handleLoggedInUser)


app.use('/', indexController)
app.use('/', usersController)
app.use('/', cardsController)
app.use('/', postsController)

app.use(methodOverride('_method'))


app.listen(PORT, () => {
    console.log(`Express is listening on port:${PORT}`);
});