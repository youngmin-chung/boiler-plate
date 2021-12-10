const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { User } = require('./Server/models/User')
const bodyParser = require('body-parser')
const config = require('./Server/config/key')
const { auth } = require('./Server/middleware/auth')

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
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.get('/api/hello', (req, res) => {
  res.send('Hello World!!!')
})

app.post('/api/users/register', (req, res) => {
  // user information from client to DB

  const user = new User(req.body)
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})
app.post('/api/users/login', (req, res) => {
  // find requested email from DB
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'No user who matched by email',
      })
    }

    user.comparePassword(req.body.password, (err, isMatched) => {
      if (!isMatched)
        return res.json({ loginSuccess: false, message: 'Wrong password!' })

      // if it's same, create token
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err)

        // save token
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
  // compare passwords between user input and DB's one
})

app.get('/api/users/auth', auth, (req, res) => {
  // if authentication works
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      token: '',
    },
    (err, user) => {
      if (err) return res.json({ success: false, err })

      return res.status(200).send({
        success: true,
      })
    }
  )
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
