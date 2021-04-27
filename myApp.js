var express = require('express');
var app = express();
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: false}))

absolutePath = __dirname + "/views/index.html"
console.log(absolutePath)

// Middleware mounted on all actions to log the method, path and ip
app.use(/^\/\w*/, (req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`)
  next()
})

app.use("/public", express.static(__dirname+"/public"))

// Middleware mounted on /json, output depends on env vaiables
app.get("/json", (req, res) => {
  let apiData = process.env.MESSAGE_STYLE === "uppercase"? 
  {"message": "Hello json".toUpperCase()} : 
  {"message": "Hello json"} 
  res.json(apiData)
});
app.get("/", (req, res) => {
  res.sendFile(absolutePath)
});

// Middleware to add the time to req.time before returning the time object
app.get("/now", (req, res, next) => {
  let time = new Date().toString()
  req.time = time
  next()
}, (req, res) => {
  res.json({"time": req.time})
})
// adds key, value pairs to ereq.params object
// url for, /:k1/v1/:k2/v2
app.get("/:word/echo", (req, res) => {
  let word = req.params.word
  res.json({"echo": word})
})

app.route("/name").get((req, res) => {
  let name = req.query
  console.log(name)
  let fullName = {"name": name.first + " " + name.last}
  res.json(fullName)
}).post((req, res) => {
  res.json({"name": req.body.first + " " + req.body.last})
})


module.exports = app