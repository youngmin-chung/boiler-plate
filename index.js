const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const BodyParser = require('body-parser')
const { User } = require('./models/User')
const bodyParser = require('body-parser')
const { use } = require('express/lib/router')
const config = require('./config/key')

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected....')
  })
  .catch((err) => console.log(err))

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.post('/register', (req, res) => {
  // user information from client to DB

  const user = new User(req.body)
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
