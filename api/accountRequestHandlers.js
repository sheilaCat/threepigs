var MongoDB = require('../dao/MongoDB');
var mongoDB = new MongoDB();
var async = require('async');

/**
*��½
*/
function toLogin(req,res){
	console.log(req.body);
	async.series([
		function(cb){ mongoDB.findPeopleByUser(req.body, cb)}
	], function(err, results) {
		console.log(results[0]);
   		res.send(results[0]);
   		res.end();
   		return ;
	});


	return ;
}
/**
*ע��
*/
function toRegister(req,res){
	
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
