const path = require('path');
var express = require("express");
var serveStatic = require("serve-static");
app = express();
app.use(serveStatic(path.join(__dirname, 'dist')));
var port = process.env.PORT || 5000;
app.listen(port);
console.log("Server started on " + port);