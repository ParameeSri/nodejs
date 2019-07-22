'use strict'
// require('dotenv').config()
const crypto = require('crypto')
const HttpStatus = require('http-status-codes')
const jwt = require('../../../jwt')
// const model = require('../model/users')
const moment = require('moment')


const SECRET = "ae_hunter_secret" //ในการใช้งานจริง คีย์นี้ให้เก็บเป็นความลับ
const jwtExpirySeconds = 3600

const ctrl = {}

module.exports = ctrl

ctrl.doLogin = async (req, res) => {
  let username = req.body.username
  let password = req.body.password

  if (username && password) {
    let encPassword = crypto.createHash('md5').update(password).digest('hex')
    try {
      const payload = {
        sub: req.body.username,
        expiresIn: jwtExpirySeconds
      }
    
      let expiresIn = moment().add('hour', 1).format('YYYY-MM-DD HH:mm:ss')
      let token = jwt.sign(payload, SECRET, { algorithm: 'HS256', expiresIn: jwtExpirySeconds })
      let response = {
        token,
        expiresIn
      }
      res.send({ status: true, response })
      // let rs = await model.doLogin(username, encPassword)
      // if (rs.length) {
      //   let authen = jwt.sign({ username: username })
      //   console.log('rs', rs[0].role)
      //   res.send({ status: true, authen, role: rs[0].role })
      // } else {
      //   res.send({ status: false, error: 'Invalid username or password!', code: HttpStatus.UNAUTHORIZED })
      // }
    } catch (error) {
      res.send({ status: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR })
    }
  } else {
    res.send({ status: false, error: 'Invalid data!', code: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}

ctrl.refreshToken = async (req, res) => {
  const token = req.body.token
  var payload
  
  if (!token) {
    return res.status(401).end()
  }
  
  try {
    payload = jwt.verify(token, SECRET)
   
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.send('401 unauthorized').status(401).end()
    }
    return res.send('400 bad request').status(400).end()
  }

  const nowUnixSeconds = moment.unix().format("MM/DD/YYYY HH:mm:ss")
  
  if (payload.exp - nowUnixSeconds > 30) {
    return res.status(400).end()
  }

  // Now, create a new token for the current user, with a renewed expiration time
  const newToken = jwt.sign({ username: payload.sub }, SECRET, {
    algorithm: 'HS256',
    expiresIn: jwtExpirySeconds
  })

  // Set the new token as the users `token` cookie
  res.send(newToken)
}
