const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const auth = require("./routes/auth/verifyToken")
require('dotenv').config()
const app = express()
const upload = multer()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(upload.array()); 


mongoose.connect(process.env.MONGODB_URI)
.then(console.log("DB Connected"))
.catch(error => console.log(error))


app.get('/api', (req, res) => {
    console.log('user hit the server')
})

app.use('/api', auth, require('./routes/clothes'))
app.use('/auth', require('./routes/auth/register'))
app.use('/auth', require('./routes/auth/login'))

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}....`)
})