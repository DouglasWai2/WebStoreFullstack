const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(express.static('./methods-public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
.then(console.log("DB Connected"))
 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) 


app.get('/api', (req, res) => {
    console.log('user hit the server')
})

app.use('/api/clothes', require('./routes/clothes'))


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}....`)
})