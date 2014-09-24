var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var express = require('express');
//var app = express();
//var server = require('http').createServer(app);
//var io = require('socket.io')();
//var io = require('socket.io').listen(server);
var filesRequestHandlers = require("./api/filesRequestHandlers"); 
var accountRequestHandlers = require("./api/accountRequestHandlers"); 
var roomRequestHandlers = require("./api/roomRequestHandlers"); 
var commonRequestHandlers = require("./api/commonRequestHandlers"); 
var session = require('express-session');


//设置日志级别
io.set('log level', 1); 

//WebSocket连接监听
io.on('connection', function (socket) {
  socket.emit('open');//通知客户端已连接
  console.log("连接一个客户端 :" + socket);
  // 打印握手信息
  // console.log(socket.handshake);

  // 构造客户端对象
  var client = {
    socket:socket,
    name:false
  }
  
  // 对message事件的监听
  socket.on('message', function(msg){
    var obj = {};
    console.log("收到消息 :" + msg);
    switch(msg.type) {
	case 'login':
	    // TODO Do something.
	    break;
	case 'logout':
	    // TODO Do something.
	    break;
	case 'creatRoom':
	    // TODO Do something.
	    obj['author']=client.name;
            obj['type']='creatRoom';
	    console.log(client.name + ' creatRoom');

	    //返回房间列表
            socket.emit('creatRoom',obj);
            //广播新建房间
            socket.broadcast.emit('creatRoom',obj);
	    break;
	default:
	    // TODO Do something.
    }
/*
    // 判断是不是第一次连接，以第一条消息作为用户名
    if(!client.name){
        client.name = msg;
        obj['text']=client.name;
        obj['author']='System';
        obj['type']='welcome';
        console.log(client.name + ' login');

        //返回欢迎语
        socket.emit('system',obj);
        //广播新用户已登陆
        socket.broadcast.emit('system',obj);
     }else{
        //如果不是第一次的连接，正常的聊天消息
        obj['text']=msg;
        obj['author']=client.name;      
        obj['type']='message';
        console.log(client.name + ' say: ' + msg);

        // 返回消息（可以省略）
        socket.emit('message',obj);
        // 广播向其他用户发消息
        socket.broadcast.emit('message',obj);
      }*/
    });

    //监听出退事件
    socket.on('disconnect', function () {  
      var obj = {
        author:'System',
        text:client.name,
        type:'disconnect'
      };

      // 广播用户已退出
      socket.broadcast.emit('system',obj);
      console.log(client.name + 'Disconnect');
    });
  
});

app.use(function(req, res, next){
	//router.route(handle,req,res);
  //console.log('%s %s', req.method, req.url);
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
  app.use(express.static(path.join(__dirname, 'views')));
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


  app.use(express.cookieParser('sctalk admin manager'));
  app.use(express.session());
// app.get('/', function(req, res){
//    res.sendfile('views/index.html');
//    console.log('index end');
// });
//通用请求
app.get("/",commonRequestHandlers.indexPage);//获取主页
//文件请求处理

app.post("/toUploadFile",filesRequestHandlers.toUploadFile);//文件上传
//app.get("/toSearchFile",filesRequestHandlers.toSearchFile);//搜索文件
//app.get("/toDeleteFile",filesRequestHandlers.toDeleteFile);//删除文件
//app.post("/toSubmitComment",filesRequestHandlers.toSubmitComment);//提交资料评论
app.get("/pdftopng",filesRequestHandlers.pdfToPng); //测试pdf转png
app.post("/saveImg",filesRequestHandlers.saveImg); // 保存图片

//账户请求处理

app.post("/toLogin",accountRequestHandlers.toLogin);//登陆
app.post("/toRegister",accountRequestHandlers.toRegister);//注册
app.post("/toLogout",accountRequestHandlers.toLogout);//登出
app.get("/toCheckUserIsExist",accountRequestHandlers.toCheckUserIsExist);//检查用户名是否存在
app.post("/toSubmitUserInfo",accountRequestHandlers.toSubmitUserInfo);//提交用户信息
app.get("/toGetUserInfo",accountRequestHandlers.toGetUserInfo);//获取用户信息
app.post("/toSubmitInvitation",accountRequestHandlers.toSubmitInvitation);//提交邀请
app.get("/toGetInvitation",accountRequestHandlers.toGetInvitation);//获取邀请提示
app.get("/toGetUserFile",accountRequestHandlers.toGetUserFile);//获取所拥有文件

//房间请求处理
app.post("/toCreateNewRoom",roomRequestHandlers.toCreateNewRoom);//创建房间
app.post("/toJoinRoom",roomRequestHandlers.toJoinRoom);//加入房间
app.get("/toQuitRoom",roomRequestHandlers.toQuitRoom);//退出房间
app.get("/toAddFileToRoom",roomRequestHandlers.toAddFileToRoom);//添加资料
app.get("/toDeleteFileFromRoom",roomRequestHandlers.toDeleteFileFromRoom);//删除资料
app.get("/toShowFile",roomRequestHandlers.toShowFile);//展示资料
app.get("/toStartVoice",roomRequestHandlers.toStartVoice);//发起语音
app.get("/toPassPaint",roomRequestHandlers.toPassPaint);//交换画笔

app.get("/toGetAllRoom", roomRequestHandlers.toGetAllRoom);//获取所有房间


//启动服务器
//var io = require('socket.io').listen(3000);
//app.listen(3000);
server.listen(3000);
//server.listen(3000);
 
console.log('Listening on port 3000');
