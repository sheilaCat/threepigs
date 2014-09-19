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
   		req.session.people = {};
   		req.session.people = results[0][0];
   		console.log(req.session.people.peopleName);
   		res.end();
   		return ;
	});

	console.log("end");
	return ;
}
/**
*ע��
*/
function toRegister(req,res){
	console.log(req.body);
	async.series([
		function(cb){ mongoDB.insertPeople(req.body,cb)}
	], function(err, results) {
		console.log(results[0]);
   		res.send(results[0]);
   		res.end();
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
exports.toLogin = toLogin;
exports.toRegister = toRegister;
exports.toLogout = toLogout;
exports.toCheckUserIsExist = toCheckUserIsExist;
exports.toSubmitUserInfo = toSubmitUserInfo;
exports.toGetUserInfo = toGetUserInfo;
exports.toSubmitInvitation = toSubmitInvitation;
exports.toGetInvitation = toGetInvitation;
exports.toGetUserFile = toGetUserFile;
