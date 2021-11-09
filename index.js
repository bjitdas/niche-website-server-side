const express = require('express')
const app = express()
require('dotenv').config()
const port = 5000 || process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(` listening at `, port)
})