const express = require('express')
const router = express.Router()
import jwtChk from '../../lib/authen'
import Authen from '../ctrl/authen'

// Authen
router.post('/authen/refresh', Authen.refreshToken)
router.post('/authen/login', Authen.doLogin)
router.get("/getData", jwtChk.checkAuth, (req, res) => {
  res.send('seccess !!!!')
})

router.post('/', (req, res) => {
  res.send({
    status: true,
    page: 'api'
  })
})


module.exports = router
