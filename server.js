const path = require('path')
var express = require('express')
var serveStatic = require('serve-static')
const enforce = require('express-sslify')
const app = express()
app.use(enforce.HTTPS({ trustProtoHeader: true }))
app.use(serveStatic(path.join(__dirname, 'dist')))
var port = process.env.PORT || 5000
app.listen(port)
