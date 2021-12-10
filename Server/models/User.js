const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
})

userSchema.pre('save', function (next) {
  var user = this
  if (user.isModified('password')) {
    // password crypto
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err)
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // compare passwords
  // plainPassword 12345678
  // crypt password $2b$10$bGlBgoDwORoCmkQ.3cus5.yy7sYC2D.4enPr7KUg69sMqFHsFAr4q

  bcrypt.compare(plainPassword, this.password, function (err, isMatched) {
    if (err) return cb(err)
    cb(null, isMatched)
  })
}

userSchema.methods.generateToken = function (cb) {
  var user = this
  // create token using jsonwebtoken
  var token = jwt.sign(user._id.toHexString(), 'secretToken')

  user.token = token
  user.save(function (err, user) {
    if (err) return cb(err)

    cb(null, user)
  })
}

userSchema.statics.findByToken = function (token, cb) {
  var user = this

  // decode token
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // find user by using user id
    // compare both values
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err)
      cb(null, user)
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
