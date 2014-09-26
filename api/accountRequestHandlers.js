var MongoDB = require('../dao/MongoDB');
var mongoDB = new MongoDB();
var async = require('async');

/**
*��½
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

//�жϸ��û��Ƿ��¼
function toChangeLoginType(peopleId){
	async.series([
		function(cb){ mongoDB.changeLoginType(peopleId, cb)}
	], function(err, results) {
   		return ;
	});
	console.log("end");
	return ;
}
/**
*ע��
*/
function toRegister(req,res){
	console.log("req.body :"+req.body);
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
*�ǳ�
*/
function toLogout(req,res){
	
}
/**
*����û����Ƿ����
*/
function toCheckUserIsExist(req,res){
	
}/**
*�ύ�û���Ϣ
*/
function toSubmitUserInfo(req,res){
	
}
/**
*��ȡ�û���Ϣ
*/
function toGetUserInfo(req,res){
	
}
/**
*�ύ����
*/
function toSubmitInvitation(req,res){
	
}
/**
*��ȡ������ʾ
*/
function toGetInvitation(req,res){
	
}
/**
*
**/
function toGetUserFile(req,res){
	
}


exports.toChangeLoginType = toChangeLoginType;
exports.toLogin = toLogin;
exports.toRegister = toRegister;
exports.toLogout = toLogout;
exports.toCheckUserIsExist = toCheckUserIsExist;
exports.toSubmitUserInfo = toSubmitUserInfo;
exports.toGetUserInfo = toGetUserInfo;
exports.toSubmitInvitation = toSubmitInvitation;
exports.toGetInvitation = toGetInvitation;
exports.toGetUserFile = toGetUserFile;
