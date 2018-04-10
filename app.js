//app.js for photo sharing
var express = require('express');
var path = require('path');
var url = require('url');
var photos = require('./routes/photos');
var apiphotos = require('./routes/api/api-photos');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');

//initialize express
var app = express();

//http override method
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

//mongoose connection string
mongoose.connect('mongodb://dbuser:dbuser@cluster0-shard-00-00-snieo.mongodb.net:27017,cluster0-shard-00-01-snieo.mongodb.net:27017,cluster0-shard-00-02-snieo.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

//initialize cookie cookieParser and session, post form handling
app.use(cookieParser('cscie31-secret'));
app.use(session({
  secret:"cscie31",
  resave: "true",
  saveUninitialized: "true"
}));

//Install bodyparser as middleware
app.use(bodyparser.urlencoded({extended: false}));

//sets views folder to detect view files
app.set('views', path.join(__dirname, 'views'));

//sets view engine to pug
app.set('view engine', 'pug');

//Set up routes and routers
//Every request /static, will get routed to public
app.use('/static', express.static(path.join(__dirname, 'public')));

//Routes people submiting to /photos and will parse the url string
app.get('/', (req, res)=>{
  res.end("root requested")
});

app.use('/photos', photos);

//use new router
app.use('/api/photos', apiphotos);


//404 error
app.use((req, res, next)=>{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
})

module.exports = app;
