
var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var db;
var SUCCESS = "success";
var FAIL = "fail";
var util = require('util');  
var fileApi = require("../api/filesRequestHandlers.js");
// Initialize connection once
MongoClient.connect("mongodb://localhost:27017/threepigs", function(err, database) {
    if(err) throw err;
        db = database;
        
});


function MongoDB(){



    //查询指定表所有内容
    this.findAll = function(tableName, callback){
        db.collection(tableName).find({},{sort: {'roomId': 1, 'fileId' : 1}}).toArray(function(err, docs) {
            if (err) throw err;
            //console.log(docs);
            callback(null, docs);
            return ;
        });
        return ;
    }

    //插入一个people对象，如果该对象存在则返回 fail
    //否则返回 success
    //   Object =    {
    //     peopleName: 'CheniYi1', 
    //     peopleAge: 18, 
    //     peopleSex : '男', 
    //     peopleEmail : '495176533@qq.com', 
    //     peopleTel  : '15200801442', 
    //     user : { 
    //         userAccount: 'root', 
    //         userPassword: 'root'}
    //     }
    this.insertPeople = function(Object, callback){
        var maxPeopleId;
        console.log('userAccount ==>' + Object.user.userAccount.toString());
        db.collection('people').find({ 'user.userAccount' : Object.user.userAccount}).toArray(function(err, docs) {
            if (err) throw err;


            console.log(docs[0]);
            if(docs[0] == null){
                console.log('userAccount is null');

                db.collection('index')
                .find({})
                .toArray(function(err, docs) {           
                    maxPeopleId = docs[0].peopleId;
                    Object.peopleId = maxPeopleId + 1;
                    console.log('peopleId maxID is = ' + Object.peopleId);
                    db.collection('people').insert( Object , {w:1}, function(err, objects) {
                        if (err) throw err;
                        console.log('people insert ===>' + SUCCESS);
                    });
                    db.collection('index').update( {'peopleId' : maxPeopleId} ,{$set: {'peopleId': maxPeopleId + 1}},  {w:1}, function(err, objects) {
                        if (err) throw err;
                        console.log('index add ===>' + SUCCESS);                        
                    });
		    callback(null, SUCCESS);
            return ;
                });
            }
            else{
                console.log('userAccount is not null');
		callback(null, FAIL);
        return ;
            }
        });
    return ;
    }

    
    //根据user Json 获取 people 对象
    // var Object = { 
    //     userAccount : 'admin' , 
    //     userPassword : 'admin'
    // }
    this.findPeopleByUser = function(Object, callback){
        var temp;
        db.collection('people').find({ 'user' : Object}).toArray(function(err, docs) {
            if (err) throw err;
            if(docs[0] == null){
                console.log('userAccount is null');

                callback(null, FAIL);
                return ;
            }
            else{

                // if(docs[0].peopleType =='login'){
                    

                //     callback(null, FAIL);
                //     return ;
                // }
                // else{
                    
                //     //console.log(docs);
                //     callback(null, docs);
                // }
                callback(null, docs);
                return ;
            }
        });
        return ;
    }


    //上传文件
    //    var Object = {
        // "fileName" : "复习资料",
        // "fileType" : "高数",
        // "fileUploadDate" : "2014-09-15",
        // "fileDescription" : "超好用的高数资料",
        // "fileLocation" : "???",
        // "fileTimes" : 0
  //   };
    this.uploadFile = function(peopleId, Object){
        //console.log("peopleId = " + util.inspect(peopleId,true)); 
        var temp = {};
        for(var n in Object){  
            var name=n;//属性名称   
            var value=Object[n];//属性对应的值   
            temp[name]= value;  
        } 
        temp.peopleId = peopleId;

        db.collection('index').find({}).toArray(function(err, docs) {           
            maxFileId = docs[0].fileId;
            Object.fileId = maxFileId + 1;
            console.log('fileId maxID is = ' + Object.fileId);
            console.log("peopleId = " + util.inspect(peopleId,true)); 
            db.collection('people').find({'peopleId': peopleId}).toArray(function(err, docs) {
                if (err) console.log("err = " + util.inspect(err,true)); 
                console.log("docs = " + util.inspect(docs,true)); 
                if( docs[0].uploadFileList == null ){
                    docs[0].uploadFileList = [];
                }
                docs[0].uploadFileList.push(Object);
                db.collection('people').update({'peopleId': peopleId}, {$set: {uploadFileList: docs[0].uploadFileList}}, {w:1,upsert:true}, function(err) {
                    if (err) console.warn(err.message);
                    console.log('people update ===>' + SUCCESS);
                });

                temp.peopleName = docs[0].peopleName;
                db.collection('file').insert( temp , {w:1}, function(err, objects) {
                if (err) throw err;
                console.log('file insert ===>' + SUCCESS);
                });
                console.log(docs);
            });


            

                    
            db.collection('index').update( {'fileId' : maxFileId} ,{$set: {'fileId': maxFileId + 1}},  {w:1}, function(err, docs) {
                if (err) throw err;
                console.log('index add ===>' + SUCCESS);                        
            });

            return SUCCESS;
        });
    }


    //插入评论
    // var Object = {
    //   'commentDate' : '2014-09-15',
    //   'commentContent' : '资料不错'
    // };
    this.insertComment = function(Object, peopleId, fileId){
        db.collection('index').find({}).toArray(function(err, docs) {           
            maxCommentId = docs[0].commentId;
            Object.commentId = maxCommentId + 1;
            console.log('commentId maxID is = ' + Object.commentId);
            
            

           


            //在上传该文件的people的uploadFileList 中的commentList中更新信息
            db.collection('people').find({'uploadFileList.fileId': fileId}, {'uploadFileList':1, 'peopleId' : 1}).toArray(function(err, docs) {
                if (err) throw err;
                //console.log(docs);
                // if( docs[0].commentList == null ){
                //     docs[0].commentList = [];
                // }

                var flieName;
                var commentList;
                for( var i in docs[0].uploadFileList){
                    if( docs[0].uploadFileList[i].fileId == fileId ){
                        fileName = docs[0].uploadFileList[i].fileName;
                        
                        if(docs[0].uploadFileList[i].commentList == null){
                            docs[0].uploadFileList[i].commentList = [];
                        }    


                        var temp = {};
                        for(var n in Object){  
                            var name=n;//属性名称   
                            var value=Object[n];//属性对应的值   
                            temp[name]= value;  
                        } 



                        temp.peopleId = peopleId;
                        docs[0].uploadFileList[i].commentList.push(temp);
                        console.log('uploadFileList ===>' + SUCCESS);
                    }
                }



                //docs[0].commentList.push(Object);

                db.collection('people').update({'peopleId': docs[0].peopleId}, {$set: {'uploadFileList': docs[0].uploadFileList}}, {w:1,upsert:true}, function(err) {
                     if (err) console.warn(err.message);
                         console.log('people update ===>' + SUCCESS);
                 });

                 console.log(docs);


               //在发表评论的 people 中的commentList更新信息
                
                db.collection('people').find({'peopleId': peopleId}).toArray(function(err, docs) {
                    if (err) throw err;
                        console.log(docs);
                    if( docs[0].commentList == null ){
                        docs[0].commentList = [];
                    }
                    var temp = {};
                    for(var n in Object){  
                        var name=n;//属性名称   
                        var value=Object[n];//属性对应的值   
                        temp[name]= value;  
                    } 
                    console.log('temp===>' + temp.peopleId);
                    temp.fileId = fileId;
                    temp.fileName = fileName;
                    docs[0].commentList.push(temp);

                    db.collection('people').update({'peopleId': peopleId}, {$set: {'commentList': docs[0].commentList}}, {w:1,upsert:true}, function(err) {
                        if (err) console.warn(err.message);
                            console.log('people update ===>' + SUCCESS);
                    });
                    console.log(docs);
                });


            });

                    
            db.collection('index').update( {'commentId' : maxCommentId} ,{$set: {'commentId': maxCommentId + 1}},  {w:1}, function(err, docs) {
                 if (err) throw err;
                 console.log('index add ===>' + SUCCESS);                        
            });

            return SUCCESS;
        });
    }

    
    //添加至下载文件
   //  var Object = {
   //      "fileId" : 1,
   //      "fileName" : "复习资料",
   //      "fileType" : "高数",
   //      "fileDescription" : "超好用的高数资料",
   //      "downloadDate" : "2014-09-15"
   // };
    this.insertDownloadFile = function(peopleId, Object){
        db.collection('people').find({'peopleId' : peopleId}).toArray(function(err, docs) {
            if (err) throw err;
            if( docs[0].downloadFileList == null ){
                docs[0].downloadFileList = [];
            }
            var temp = {};
            for(var n in Object){  
                var name=n;//属性名称   
                var value=Object[n];//属性对应的值   
                temp[name]= value;  
            }
            docs[0].downloadFileList.push(temp);
            db.collection('people').update( {'peopleId' : peopleId} ,{$set: {'downloadFileList': docs[0].downloadFileList}},  {w:1}, function(err, docs) {
                 if (err) throw err;
                 console.log('downloadFile add===>' + SUCCESS);                        
            });

            return SUCCESS;

        });
    }


    //修改密码信息
    this.modifyUser = function(peopleId, userPassword){
        db.collection('people').find({'peopleId' : peopleId}, {"user" : 1}).toArray(function(err, docs) {
            if (err) throw err;
            docs[0].user.userPassword = userPassword;
            console.log(docs);
            db.collection('people').update( {'peopleId' : peopleId} ,{$set: {'user': docs[0].user}},  {w:1}, function(err, docs) {
                 if (err) throw err;
                 console.log('downloadFile add===>' + SUCCESS);                        
            });
            return SUCCESS;

        });
    }


    //新建房间
    // var Object = {
    //     "roomName" : "高数专用",
    //     "roomDescription" : "这里是高数重修学习的房间",
    //     "roomDate" : "2014-09-15"
    // };
    this.insertRoom = function(peopleId, Object, callback){
        var maxRoomId;
        db.collection('index').find({},{'roomId' : 1}).toArray(function(err, docs) { 
            console.log(docs);
            maxRoomId = docs[0].roomId;
            Object.roomId = maxRoomId + 1;
            Object.peopleList = [];
            var temp = {'peopleId' : peopleId};
            Object.peopleList.push(temp);

            db.collection('room').insert( Object , {w:1}, function(err, objects) {
                if (err) throw err;
                console.log('room insert ===>' + SUCCESS);
            });

            db.collection('index').update( {'roomId' : maxRoomId} ,{$set: {'roomId': maxRoomId + 1}},  {w:1}, function(err, docs) {
                if (err) throw err;
                console.log('roomId add===>' + SUCCESS);                        
            });
            callback(null, SUCCESS);
            return ;
        });
        return ;
    }

    //用户加入房间
    this.addRoom = function(peopleId, roomId, callback){
        console.log(roomId);
        console.log(peopleId);
        db.collection('room').find({'roomId' : roomId}).toArray(function(err, docs) {
            if (err) throw err;
            var temp = {
                'peopleId' : peopleId
            };
            if(docs.length == 0){
                callback(null, FAIL); 
                return ;
            }
            
            docs[0].peopleList.push(temp);
            db.collection('room').update( {'roomId' : roomId} ,{$set: {'peopleList': docs[0].peopleList}},  {w:1}, function(err, docs) {
                 if (err) throw err;
                 console.log('peopleList add===>' + SUCCESS);
                 db.collection('room').find({'roomId' : roomId}).toArray(function(err, docs) {
                    if (err) throw err; 

                    callback(null, docs);
                    return ;
            });

            });
            

        });
    }

    //用户退出房间,当房间没人时， 该房间被删除
    this.outRoom = function(peopleId, roomId, callback){
            console.log(roomId);
            roomId = parseInt(roomId);
        db.collection('room').find({'roomId' : roomId}).toArray(function(err, docs) {
            if (err) throw err;
            
            console.log(docs);
            if(docs.length == 0){
                callback(null, fail); 
                return ;
            }

            var temp = docs[0].peopleList;
            var update = [];

            for( i in temp ){
                if(temp[i].peopleId == peopleId){
                    console.log('people remove ===>' + SUCCESS);
                }
                else{
                    update.push(temp[i]);
                }
            }

            db.collection('room').update( {'roomId' : roomId} ,{$set: {'peopleList': update}},  {w:1}, function(err, doc) {
                if (err) throw err;
                console.log('peopleList update===>' + SUCCESS);  


                db.collection('room').find({'roomId' : roomId}).toArray(function(err, docs) {
                    if (err) throw err;
                    //console.log(docs);
                    if(docs[0].peopleList.length == 0){
                        db.collection('room').remove( {'roomId' : roomId} ,{w: 1}, function(err, docs) {
                            if (err) throw err;
                            console.log('room delete===>' + SUCCESS);
                            try {
                                fileApi.delRoomFolder(roomId);
                            } catch (err) {
                                console.log("Delete folder fail! error : " + err);
                            }
                            db.collection('room').find({},{sort: {'roomId': 1}}).toArray(function(err, docs) {
                                callback(null, docs); 
                            });
                            return ;
                        });  
                    }else{
                        db.collection('room').find({},{sort: {'roomId': 1}}).toArray(function(err, docs) {
                            callback(null, docs); 
                        });
                    } 
                    
                });
                  
                                   
            });


            return ;

        });
    }

    //发送通知信息
    // var Object = {
    //   "promptContent" : "快来学习高数",
    //   "promptDate" : "2014-09-15"
    
    // };
    this.sendCompt = function(sendPeopleId, getPeopleId, Object){
        var maxComptId;
        db.collection('index').find({},{'comptId' : 1}).toArray(function(err, docs) { 
            console.log(docs);
            maxComptId = docs[0].comptId;
            


            //在发送者的文档中添加.

            var temp = {};
            for(var n in Object){  
                var name=n;//属性名称   
                var value=Object[n];//属性对应的值   
                temp[name]= value;  
            }


            temp.comptId = maxComptId + 1;
            temp.getPeopleId = getPeopleId;


            db.collection('people').find({'peopleId' : sendPeopleId}).toArray(function(err, docs) { 
                if( docs[0].sendPromptList == null ){
                    docs[0].sendPromptList = [];
                }
                docs[0].sendPromptList.push(temp);

                db.collection('people').update( {'peopleId' : sendPeopleId} ,{$set: {'sendPromptList': docs[0].sendPromptList}},  {w:1}, function(err, docs) {
                    if (err) throw err;
                    console.log('sendPromptList add===>' + SUCCESS);                        
                });

            });


            // 在接受者的文档中添加

            var temp1 = {};
            for(var n in Object){  
                var name=n;//属性名称   
                var value=Object[n];//属性对应的值   
                temp1[name]= value;  
            }

            temp1.comptId = maxComptId + 1;
            temp1.status = '未读';
            temp1.sendPeopleId = sendPeopleId;


            db.collection('people').find({'peopleId' : getPeopleId}).toArray(function(err, docs) { 
                if( docs[0].getPromptList == null ){
                    docs[0].getPromptList = [];
                }
                docs[0].getPromptList.push(temp1);

                db.collection('people').update( {'peopleId' : getPeopleId} ,{$set: {'getPromptList': docs[0].getPromptList}},  {w:1}, function(err, docs) {
                    if (err) throw err;
                    console.log('getPromptList add===>' + SUCCESS);                        
                });

            });

            


            db.collection('index').update( {'comptId' : maxComptId} ,{$set: {'comptId': maxComptId + 1}},  {w:1}, function(err, docs) {
                if (err) throw err;
                console.log('comptId add===>' + SUCCESS);                        
            });

            return SUCCESS;
        });
    }


    //获取用户所有通知信息
    this.getAllCompt = function(peopleId){
        db.collection('people').find({'peopleId' : peopleId}, {'getPromptList' : 1}).toArray(function(err, docs) {
            if (err) throw err;
            
            console.log(docs);

            return docs
            
        });
    }


    //根据文件类型获取响应文件列表

    this.findFileByType = function (fileType, callback){
        db.collection('file').find({'fileType' : fileType}).toArray(function(err, docs){
            if(err) throw err;
            
            callback(null, docs);
            return ;
        });
        return ;
    }

    this.findFileByKey = function(key, callback){
        db.collection('file').find({'fileName' : {$regex: key} }).toArray(function(err, docs){
            if(err) throw err;
            callback(null, docs);
            return ;
        });
        return ;
    }



    // this.changeLoginType = function(peopleId, callback){
    //     db.collection('people').find({'peopleId' : peopleId }, {'peopleType': 1}).toArray(function(err, docs){
    //         if(err) throw err;
    //         try{
    //             if(docs[0].peopleType == null)
    //             docs[0].peopleType = 'logout';
    //         }catch(err){
    //             docs[0].peopleType = 'logout';
    //         }
            
            

    //         if( docs[0].peopleType =='logout' ){
    //             db.collection('people').update({'peopleId': peopleId}, {$set: {'peopleType': 'login'}}, {w:1,upsert:true}, function(err) {
    //                 if (err) console.warn(err.message);
    //                 console.log('people login ===>' + SUCCESS);
    //             });
    //         }
    //         else{
    //             db.collection('people').update({'peopleId': peopleId}, {$set: {'peopleType': 'logout'}}, {w:1,upsert:true}, function(err) {
    //                 if (err) console.warn(err.message);
    //                 console.log('people logout ===>' + SUCCESS);
    //             });
    //         }
    //          callback(null, SUCCESS);
    //         return ;
    //     });
    //    return ;

    // }


    this.toSubmitUserInfo = function(peopleId, people, callback){
        db.collection('people').update( {'peopleId' : peopleId} , people, function(err, docs) {
            if (err) throw err;
                console.log('update people===>' + SUCCESS);
                db.collection('people').find({'peopleId' : peopleId}).toArray(function(err, docs){
                    console.log(docs);
                    callback(null, docs[0]); 
                });

                                       
        });
    }

}
module.exports = MongoDB;



