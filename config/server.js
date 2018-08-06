var express = require('express')
var consign = require('consign')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
var expressSession = require('express-session')


var app = express()
app.set('view engine', 'ejs')
app.set('views', './app/views')

app.use(express.static('./app/public'))
app.use(express.static('./node_modules/material-design-icons/iconfont'))
app.use(express.static('./node_modules/nipplejs'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressValidator())
app.use(expressSession({
	secret: '@asda#?!a',
	resave: false,
	saveUninitialized: false
}))

consign().include('app/routes')
          .then('config/dbConnection.js')
          .then('app/models')
          .then('app/controllers')
          .into(app)


module.exports = app