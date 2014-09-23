var MongoDB = require('../dao/MongoDB');
var mongoDB = new MongoDB();
var async = require('async');

/**
*创建房间
**/
function toCreateNewRoom(req,res){
	// onsole.log('begin');
  	// var Object = {
   //       "roomName" : "测试房间",
   //       "roomDescription" : "这里是测试房间",
   //       "roomDate" : "2014-09-18"
   //  };
   	var date = new Date();
	console.log(req.body);
	console.log(req.body.peopleId);
	req.body.roomDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
	if ( req.body.peopleId == null ) {
	 	console.log('not people');
	 	res.send('fail');
	}
		
	else{
		async.series([
			function(cb){ mongoDB.insertRoom(req.body.peopleId, req.body, cb) },
			function(cb){ mongoDB.findAll("room", cb); }
		], function(err, results) {
			if(results[1].length == 0)
				results[1] = null;
	   		res.send(results[1]);
	   		//console.log(results[1]);
	   		return ;

		});
	}
	
	
	return ;
}
/**
*加入房间
**/
function toJoinRoom(req,res) {
	
	
}
/**
*退出房间
**/
function toQuitRoom(req,res) {
	
	
}
/**
*添加资料
**/
function toAddFileToRoom(req,res) {
	
	
}
/**
*删除资料
**/
function toDeleteFileFromRoom(req,res) {
	
	
}/**
*展示资料
**/
function toShowFile(req,res) {
	
	
}
/**
*发起语音
**/
function toStartVoice(req,res) {
	
	
}
/**
*交换画笔
**/
function toPassPaint(req,res) {
	
	
}
/**
*获取所有房间
**/
function toGetAllRoom(req, res) {

	async.series([
		function(cb){  mongoDB.findAll("room", cb);}
	], function(err, results) {
		if(results[0].length == 0)
			results[0] = null;
   		res.send(results[0]);
   		return ;

	});
	return ;
}

exports.toCreateNewRoom = toCreateNewRoom;
exports.toJoinRoom = toJoinRoom;
exports.toQuitRoom = toQuitRoom;
exports.toAddFileToRoom = toAddFileToRoom;
exports.toDeleteFileFromRoom = toDeleteFileFromRoom;
exports.toShowFile = toShowFile;
exports.toStartVoice = toStartVoice;
exports.toPassPaint = toPassPaint;
exports.toGetAllRoom = toGetAllRoom;
