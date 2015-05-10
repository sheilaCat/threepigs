var MongoDB = require('../dao/MongoDB');
var mongoDB = new MongoDB();

var querystring = require("querystring"), 
    fs = require("fs"),
    path = require("path"),
    formidable = require("formidable");
var async = require('async');
try {
  var pdfutils = require('pdfutils').pdfutils;
  var zip = require("node-native-zip");
  var zipdir = require('zip-dir');
} catch (error) {
  console.log("require pdfutils error: " + error);
}
var util = require('util');  
var body = '';
var java = require("./jsCallJava");

// Change request type to real type
function typeToStr(strType) {
  var type = parseInt(strType);
    switch(type) {
        case 1:
          return "resourseType";
          break;
        case 2:
          return "documentType";
          break;
        case 3:
          return "codeType";
          break;
        case 4:
          return "toolType";
          break;
    }
    return;
}

// Get the suffix of file by file name.
function getSuffix(fileName) {
  var suffix = fileName.substring(fileName.lastIndexOf("."),fileName.length);
    switch(suffix){
      case ".ppt":
          suffix = "ppt";
          break;
      case ".pptx":
          suffix = "ppt";
          break;
      case ".doc":
          suffix = "doc";
          break;
      case ".docx":
          suffix = "doc";
          break;
      case ".pdf":
          suffix = "pdf";
          break;
      case ".jpg":
          suffix = "jpg";
          break;
      case ".mp4":
          suffix= "mp4";
          break;
      case ".psd":
          suffix = "psd";
          break;
      case ".txt":
          suffix = "txt";
          break;
      case ".zip":
          suffix = "zip";
          break;
      default:
          suffix = "other";
          break;
    }
    return suffix;
}
 
 // Deal the upload file request.
 // Save the file to real way and insert the file detail to mongoDB.
 // Response the homepage
function toUploadFile(request, response) {
  console.log("Request handler 'upload' was called.");
  // console.log("response = " + util.inspect(response,true));
  //console.log("request = " + util.inspect(request,true));
  //var form = new formidable.IncomingForm();
  //console.log("about to parse");
  
  //form.parse(request, function(error, fields, files) {
    //console.log("parsing done");
    //console.log(request.files.upload.path);
    // console.log("fields = " + util.inspect(fields,true)); 
    //console.log("request = " + request.body.peopleId);
    console.log("request = " + util.inspect(request,true));
    //fs.renameSync(files.upload.path, "/tmp/test.png"); 这个会报错，这个应该是linux的路径 
    // files.upload.path = "G:/test.png";
    // fs.write(files.fd,files,files.length,files.upload.path,function(err, bytesRead, buffer) {
    //     if (err) {
    //       response.write("write error = " + err); 
    //     }
    // });
    // fs.rename(files.upload.path, "E:\\development\\nodejs\\workspaces\\filesupload\\test.png", function (err) {
    //   if (err) {
    //     console.log("write error = " + err);
    //   }
    // });
    var fileType = typeToStr(request.body.type);
    var suffix = getSuffix(request.files.upload.name);
    var date = new Date();
    var obj = {
      "fileName" : request.body.filename,
      "fileType" : fileType,
      "fileSuffix" : suffix,
      "fileUploadDate" : date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate(),
      "fileDescription" : request.body.describe,
      "fileLocation" : "/files/"+fileType+"/"+request.body.filename + request.files.upload.name.substring(request.files.upload.name.lastIndexOf("."),request.files.upload.name.length),
      "fileTimes" : 0
    };

    console.log("obj = " + util.inspect(obj,true));
    //console.log("new Date() = " + util.inspect(new Date(),true));
    //    var Object = {
        // "fileName" : "复习资料",
        // "fileType" : "高数",
        // "fileUploadDate" : "2014-09-15",
        // "fileDescription" : "超好用的高数资料",
        // "fileLocation" : "???",
        // "fileTimes" : 0
  //   };
    fs.writeFileSync( __dirname + "/../public" + obj.fileLocation, fs.readFileSync(request.files.upload.path) );
    var peopleId = parseInt(request.body.peopleId);
    mongoDB.uploadFile(peopleId,obj);
    fs.unlink(request.files.upload.path, function (error) {
      // body...
      if (error) {
        console.log("unlink error : " = error);
      }
    });
    domToPng(__dirname + "/../public" + obj.fileLocation);
    console.log("files.upload.path = " + request.files.upload.path);
    response.redirect("/hall.html");
    return;
} 


// Compress a folder to a zip.
function dirToZip(dirname,callback) {
  //var archive = new zip();
      zipdir(dirname , { saveTo: dirname+".zip"}, function (err, buffer) {
              callback(err, buffer);
       });
  // console.log("toAddFiles = " + util.inspect(toAddFiles,true));
  //  fs.readdir(dirname, function (err, files) {
  //   // body...
  //   debugger;
  //   if (err) {
  //     console.log("readdir error : " + err);
  //   } else {
  //     var toAddFiles=[];
  //     for (var i = 0; i < files.length; i++) {
  //       console.log("i : " + i + "   files.length : " + files.length + "  filename : " + files[i]);
  //       if(!(files[i].lastIndexOf(".pdf") > 0)) {
  //         toAddFiles[i] = {name: files[i], path: dirname + files[i]};
  //       }
          
  //     }
  //     console.log("toAddFiles = " + util.inspect(toAddFiles,true));
  //   }
  // });
}

function domToPng (domFirePath) {
   java.dom2pdf(domFirePath, function (err, pdfFilePath,fileName,dirPath) {
    if (err) {
      console.log("domToPDF error : " + err);
      //response.send(err);
    }
      //console.log("testppt.ppt = " + result);
      pdfToPng(pdfFilePath, fileName, dirPath);
      // if (err) {
      //   response.send(" java.dom2pdf error : " + err);
      // }
      // else {
      //   
      //response.send("OK");
      // }
   return;
  });
 }

function formatPage(len,num) {
  var strLen = len.toString();
  var strNum = num.toString();
  for(var i = 0; i < strLen.length - strNum.length; i++) {
    strNum = "0" + strNum;
  }
  return strNum;
}

function pdfToPng (filePath, fileName, toPath) {
  try {
    pdfutils(filePath, function(err, doc) {
      var i;
      for (i = 0; i < doc.length; i++) {
        doc[i].asPNG({width: 740, maxHeight: 2400}).toFile(toPath + fileName + formatPage(doc.length,i) + ".png");
        debugger;
      }
      console.log("toPath : " + toPath);
    });
    return toPath;
  } catch (error) {
    console.log("pdfutils error : " + error);
    return "";
     }
}

function saveImg(req,res){
	//console.log("imgData:"+request.imgData);
	//console.log("imgName:"+request.imgName);
	
	console.log(req.body.imgPath);
	console.log(__dirname + "/../public/"+req.body.imgPath+"/"+req.body.imgName);
	try {
            fs.mkdir(__dirname + "/../public/"+req.body.imgPath,777,function(err) {
              if (err) {
                console.log("mkdir error : " + err);
              } else {
                console.log("new dirname === " + __dirname + "/../public/"+req.body.imgPath);
              }
            });  
          } catch (err) {
            console.log("fs.mkdir error : " + err);
        }
	fs.writeFile(__dirname + "/../public/"+req.body.imgPath+"/"+req.body.imgName,req.body.imgData,"base64",function(err){
    	if(err){
    		console.log("f:"+err);
    		res.json({success:0});
    	}
   	else{
    		console.log("s:"+req.body.imgPath+"/"+req.body.imgName);
    		res.json({success:1});
   	}
  });
  
}
function toGetAllFile(req, res){
  async.series([
    function(cb){ mongoDB.findAll("file", cb)}
  ], function(err, results) {
      res.send(results[0]);
      return ;
  }); 
  return ;
}

function toGetFileByType(req, res){
  async.series([
    function(cb){ mongoDB.findFileByType(req.query.fileType, cb)}
  ], function(err, results) {
      res.send(results[0]);
      return ;
  }); 
  return ;
}


function toSearchFile(req, res){
  async.series([
    function(cb){ mongoDB.findFileByKey(req.query.key, cb)}
  ], function(err, results) {
      res.send(results[0]);
      return ;
  }); 
  return ;
}


function getRoomRes(req, res){
	console.log(req.query.roomId);
	//var roomId = req.body.data.roomId;
	var roomId=req.query.roomId;
	var resPath = req.query.pathName;
	var tempDocPath ="temp/room"+roomId+"/"+resPath.substring(resPath.lastIndexOf("/")+1,resPath.length);
	
	console.log(resPath);
	console.log(tempDocPath);
	try{
              fs.readdir(__dirname + "/../public/"+resPath, function (err, files) {
  	               console.log(resPath+"~~~~~~~~~~~~~~~"+tempDocPath);
		        if (err) {
			       res.json({result:0,files:null});
                              console.log("readdir error : " + err);
      
                      } 
                      else{
    	                     res.json({result:1,
    						files:files,
    						resPath:resPath,
        					tempDocPath:tempDocPath
    						});
                      }
	       });
	}
	catch(error){
		console.log(error);
	}
}

function createRoomFolder(roomId){
        fs.mkdir(__dirname + "/../public/temp/room"+roomId,777,function(err) {
            if (err) {
              console.log("mkdir error : " + err);
            } else {
              console.log("new dirname === " + __dirname + "/../public/temp/room"+roomId);
            }
          });  
}

function delRoomFolder(roomId){
      var path = __dirname + "/../public/temp/room"+roomId;
      var files = [];
       if( fs.existsSync(path) ) {
              files = fs.readdirSync(path);
              console.log("files = " + util.inspect(files,true)); 
              files.forEach(function(file,index){
                      var curPath = path + "/" + file;
                      if(fs.statSync(curPath).isDirectory()) { // recurse
                              delRoomFolder(roomId+"/"+file);
                      } else { // delete file
                              fs.unlinkSync(curPath);
                      }
              });
              fs.rmdirSync(path);
      } 
}

function toStudyFile(fileName){
      
}

var deleteFolderRecursive = function(path) {
    
};


exports.toUploadFile = toUploadFile 
exports.domToPng = domToPng; 
exports.dirToZip = dirToZip; 
exports.saveImg = saveImg; 
exports.toGetAllFile = toGetAllFile;
exports.toGetFileByType = toGetFileByType;
exports.toSearchFile = toSearchFile;
exports.getRoomRes = getRoomRes;
exports.createRoomFolder = createRoomFolder;
exports.toStudyFile = toStudyFile;
exports.delRoomFolder = delRoomFolder;