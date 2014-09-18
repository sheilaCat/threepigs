/**
*创建房间
**/
function toCreateNewRoom(req,res){
	
	
}
/**
*加入房间
**/
function toJoinRoom(req,res){
	
	
}
/**
*退出房间
**/
function toQuitRoom(req,res){
	
	
}
/**
*添加资料
**/
function toAddFileToRoom(req,res){
	
	
}
/**
*删除资料
**/
function toDeleteFileFromRoom(req,res){
	
	
}/**
*展示资料
**/
function toShowFile(req,res){
	
	
}
/**
*发起语音
**/
function toStartVoice(req,res){
	
	
}
/**
*交换画笔
**/
function toPassPaint(req,res){
	
	
}
/**
*交换画笔
**/
function toGetAllRoom(req, res){

	var Object = mongoDB.findAll(req, res, "room");
	

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
