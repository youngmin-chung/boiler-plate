const { User } = require('../models/User')

let auth = (req, res, next) => {
  // manage auth

  // token from client
  let token = req.cookies.x_auth

  // crypt token, find user
  User.findByToken(token, (err, user) => {
    if (err) throw err
    if (!user) return res.json({ isAuth: false, error: true })

    req.token = token
    req.user = user
    next()
  })
}

module.exports = { auth }
