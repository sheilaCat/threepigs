var express = require('express');
var path = require('path');
var app = express();
 
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});
 




//express基本配置
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + 'views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

 
app.get('/', function(req, res){


    res.sendfile('views/index.html');

    console.log('index end');

});
 
app.listen(3000);
 
console.log('Listening on port 3000');