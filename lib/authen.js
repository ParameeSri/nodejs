const jwt = require('../jwt')
const HttpStatus = require('http-status-codes')

let checkAuth = (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.query && req.query.token) {
    token = req.query.token
  } else {
    token = req.body.token
  }
  jwt.verify(token)
    .then((decoded) => {
      req.decoded = decoded
      next()
    }, err => {
      return res.send({
        ok: false,
        error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
        code: HttpStatus.UNAUTHORIZED
      })
    })
}

module.exports = {
  checkAuth
}
