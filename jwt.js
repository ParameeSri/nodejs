const jwt = require('jsonwebtoken')
const moment = require('moment')
const secretKey = 'ae_hunter_secret'
const SECRET = "ae_hunter_secret"
const duration = 3600

module.exports = {
  sign (playload) {
    let expire = moment({}).seconds(duration).format("YYYY-MM-DD H:mm:ss")
    let token = jwt.sign(playload, secretKey, {
      expiresIn: duration
    });
    return { token, expire }
  },

  verify (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      })
    })
  }
}
