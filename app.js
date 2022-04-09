var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongojs = require('mongojs');
var db = mongojs('contactlist', ['contactlist']);

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/editform',function(req,res){
  res.render('editform');
});

app.get('/contactlist',function(req,res){
  console.log("received get")

  db.contactlist.find(function(err,docs){
    console.log(docs);
    res.json(docs);
  });
 });

app.post('/contactlist',function(req,res){
  console.log(req.body);
  db.contactlist.insert(req.body, function(err,doc){
    res.json(doc);
  });
 });

app.delete('/contactlist/:id',function(req,res){
  var id = req.params.id;
  console.log(id);
  db.contactlist.remove({_id: mongojs.ObjectID(id)}, function(err,doc){
    res.json(doc);
  })
 });

app.get('/contactlist/:id',function(req,res){
  var id = req.params.id;
  console.log(id);
  db.contactlist.findOne({_id: mongojs.ObjectID(id)}, function(err,doc){
    res.json(doc);
  })
 });

app.put('/contactlist/:id',function(req,res){
  var id = req.params.id;
  console.log(req.body.name);
  db.contactlist.findAndModify({query: {_id: mongojs.ObjectID(id)},
  update: {$set : {name: req.body.name, email: req.body.email, number: req.body.number}},
  new: true},function(err,doc){
    res.json(doc);
  });
 });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
