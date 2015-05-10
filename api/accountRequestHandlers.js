var MongoDB = require('../dao/MongoDB');
var mongoDB = new MongoDB();
var async = require('async');
var fs = require("fs");
var util = require("util");

/**
*登陆
*/
function toLogin(req,res){
	async.series([
		function(cb){ mongoDB.findPeopleByUser(req.body, cb)}
	], function(err, results) {
		console.log(results[0][0]);
   		res.send(results[0]);
   		return ;
	});
	console.log("end");
	return ;
}

//判断该用户是否登录
// function toChangeLoginType(peopleId){
// 	async.series([
// 		function(cb){ mongoDB.changeLoginType(peopleId, cb)}
// 	], function(err, results) {
//    		return ;
// 	});
// 	console.log("end");
// 	return ;
// }

/**
*注册
*/
function toRegister(req,res){
	console.log("req.body :"+util.inspect(req.body,true));
	fs.writeFileSync( __dirname + "/../public/head/" + req.body.user.userAccount + "_head", 
		fs.readFileSync(__dirname + "/../public/head/profile"));
	async.series([
		function(cb){ mongoDB.insertPeople(req.body,cb)}
	], function(err, results) {
		console.log("toRegister results : "+results[0]);
		res.send(results[0]);
		//if (results[0] == mongoDB.SUCCESS) {
		//	res.
		//}
   		return ;
	});
	//res.writeHead(200, {"Content-Type": "text/html"}); 
  	//res.write("ok"); 
  	//res.end(); 
	return ;
	
}

/**
*登出
*/
function toLogout(req,res){
	
}

/**
*检查用户名是否存在
*/
function toCheckUserIsExist(req,res){
	
}

/**
*提交用户信息
*/
function toSubmitUserInfo(req,res){
	async.series([
		function(cb){ mongoDB.toSubmitUserInfo(req.body.peopleId, req.body.people, cb)}
	], function(err, results) {
		console.log("update results : "+results[0]);
		res.send(results[0]);
		//if (results[0] == mongoDB.SUCCESS) {
		//	res.
		//}
   		return ;
	});
}

/**
*提交用户头像
*/
function toSubmitUserHead(req,res){
	console.log("request = " + util.inspect(req,true));
	fs.writeFileSync( __dirname + "/../public/head/" + req.body.username + "_head", fs.readFileSync(req.files.head.path) );
	fs.unlink(req.files.head.path, function (error) {
		// body...
		if (error) {
			console.log("unlink error : " = error);
		}
	});
	res.redirect("/hall.html");
	res.end();
	return;
}

/**
*获取用户信息
*/
function toGetUserInfo(req,res){
	
}

/**
*提交邀请
*/
function toSubmitInvitation(req,res){
	
}

/**
*获取邀请提示
*/
function toGetInvitation(req,res){
	
}

/**
*
**/
function toGetUserFile(req,res){
	
}


// exports.toChangeLoginType = toChangeLoginType;
exports.toLogin = toLogin;
exports.toRegister = toRegister;
exports.toLogout = toLogout;
exports.toCheckUserIsExist = toCheckUserIsExist;
exports.toSubmitUserInfo = toSubmitUserInfo;
exports.toSubmitUserHead = toSubmitUserHead;
exports.toGetUserInfo = toGetUserInfo;
exports.toSubmitInvitation = toSubmitInvitation;
exports.toGetInvitation = toGetInvitation;
exports.toGetUserFile = toGetUserFile;
