var express = require('express');
var path = require('path');
var app = express();
var server = require("./server/server"); 
var router = require("./server/route"); 
var filesRequestHandlers = require("./api/filesRequestHandlers"); 
var accountRequestHandlers = require("./api/accountRequestHandlers"); 
var roomRequestHandlers = require("./api/roomRequestHandlers"); 
var commonRequestHandlers = require("./api/commonRequestHandlers"); 

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
app.get("/toJoinRoom",roomRequestHandlers.toJoinRoom);//加入房间
app.get("/toQuitRoom",roomRequestHandlers.toQuitRoom);//退出房间
app.get("/toAddFileToRoom",roomRequestHandlers.toAddFileToRoom);//添加资料
app.get("/toDeleteFileFromRoom",roomRequestHandlers.toDeleteFileFromRoom);//删除资料
app.get("/toShowFile",roomRequestHandlers.toShowFile);//展示资料
app.get("/toStartVoice",roomRequestHandlers.toStartVoice);//发起语音
app.get("/toPassPaint",roomRequestHandlers.toPassPaint);//交换画笔

app.get("/toGetAllRoom", roomRequestHandlers.toGetAllRoom);//获取所有房间


//启动服务器
app.listen(3000);
//server.start(router.route,handle);
 
console.log('Listening on port 3000');
