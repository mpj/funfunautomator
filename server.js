var express = require('express')
var app = express()

app.get('/sync', function(req, res) {
  res.send('hello world')
})




const port = 3000
app.listen(port, () => {
  console.log('listening on port', port)
})