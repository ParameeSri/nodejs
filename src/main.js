import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

// Set up the express app
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

app.use('/api', bodyParser.json(), require('./api'))


const PORT = 5000
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})