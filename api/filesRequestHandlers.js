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

function start(request, response) { 
  console.log("Request handler 'start' was called."); 
 
  body = '<html>'+ 
    '<head>'+ 
    '<meta http-equiv="Content-Type" content="text/html; '+ 
    'charset=UTF-8" />'+ 
    '</head>'+ 
    '<body>'+ 
    '<form action="/upload" enctype="multipart/form-data" '+ 
    'method="post">'+ 
    '<input type="file" name="upload" multiple="multiple">'+ 
    '<input type="submit" value="Upload file" />'+ 
    '</form>'+ 
    '</body>'+ 
    '</html>'; 
 
    response.writeHead(200, {"Content-Type": "text/html"}); 
    response.write(body); 
    response.end(); 
} 
 
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
    console.log("request = " + request.body.peopleId);
    // console.log("files = " + util.inspect(request.files,true));
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
    var fileType;
    switch(request.body.type) {
        case 1:
          fileType = "resourseType";
          break;
        case 2:
          fileType= "documentType";
          break;
        case 3:
          fileType = "codeType";
          break;
        case 4:
          fileType = "toolType";
          break
    }
    var date = new Date();
    var obj = {
      "fileName" : request.body.filename,
      "fileType" : fileType,
      "fileUploadDate" : date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate(),
      "fileDescription" : request.body.describe,
      "fileLocation" : __dirname + "/../public/files/"+fileType+"/"+request.body.filename + request.files.upload.name.substring(request.files.upload.name.lastIndexOf("."),request.files.upload.name.length),
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
    fs.writeFileSync( obj.fileLocation, fs.readFileSync(request.files.upload.path) );
    var peopleId = parseInt(request.body.peopleId);
    mongoDB.uploadFile(peopleId,obj);
    fs.unlink(request.files.upload.path, function (error) {
      // body...
      if (error) {
        console.log("unlink error : " = error);
      }
    });
    console.log("files.upload.path = " + request.files.upload.path);
    response.redirect("/hall.html");
    return;
} 
 
function show(request, response) { 
  console.log("Request handler 'show' was called."); 
  //winodw认的路径，nodejs的安装路径 
  // fs.readFile("test.png", "binary", function(error, file) { 
  //   if(error) { 
  //     console.log("error = " + error); 
  //     response.writeHead(500, {"Content-Type": "text/plain"}); 
  //     response.write(error + "\n"); 
  //     response.end(); 
  //   } else { 
  //     console.log(file.path); 
  //     response.writeHead(200, {"Content-Type": "image/png"}); 
  //     response.write(file, "binary"); 
  //     response.end(); 
  //   } 
  // });
  fs.readdir(__dirname + "/../public/files/", function (err, files) {
    // body...
    debugger;
    if (err) {
      console.log("readdir error : " + err);
    } else {
     body = '<html>'+ 
    '<head>'+ 
    '<meta http-equiv="Content-Type" content="text/html; '+ 
    'charset=UTF-8" />'+ 
    '</head>'+ 
    '<body>';
    
      for (var i = 0; i < files.length; i++) {
        console.log("i : " + i + "   files.length : " + files.length + "  filename : " + files[i]);
        body = body + '<a href="files/' + files[i] + '">' + files[i] + '</a><br />';
      }
      body = body + '</body>'+ 
      '</html>'; 
      console.log("body : " + body);
      response.writeHead(200, {"Content-Type": "text/html"}); 
      response.write(body); 
      response.end();
    }
  });
  

}

function dirToZip(dirname,filename,callback) {
  var archive = new zip();
  zipdir(dirname , { saveTo: dirname + "/" + filename }, function (err, buffer) {
              callback(err, buffer);
            });
  console.log("toAddFiles = " + util.inspect(toAddFiles,true));
   fs.readdir(dirname, function (err, files) {
    // body...
    debugger;
    if (err) {
      console.log("readdir error : " + err);
    } else {
      var toAddFiles=[];
      for (var i = 0; i < files.length; i++) {
        console.log("i : " + i + "   files.length : " + files.length + "  filename : " + files[i]);
        body = body + '<a href="files/' + files[i] + '">' + files[i] + '</a><br />';
        if(!(files[i].lastIndexOf(".pdf") > 0)) {
          toAddFiles[i] = {name: files[i], path: dirname + files[i]};
        }
          
      }
      console.log("toAddFiles = " + util.inspect(toAddFiles,true));
    }
  });

}

/*function pdfToPng (request, response) {
   try {
     pdfutils(__dirname+"/document.pdf", function(err, doc) {
       var i;
       for (i = 0; i < doc.length; i++) {
         doc[i].asPNG({maxWidth: 1200, maxHeight: 1200}).toFile(__dirname+'/../public/firstpage'+i+'.png');
 debugger;
       }
     });
   } catch (error) {

   }
}*/

function domToPng (request, response) {
   java.dom2pdf(__dirname + "/testppt.ppt", function (err, filePath,fileName,dirPath) {
    if (err) {
      console.log("domToPDF error : " + err);
      response.send(err);
    }
      //console.log("testppt.ppt = " + result);
      pdfToPng(filePath, fileName, dirPath);
      // if (err) {
      //   response.send(" java.dom2pdf error : " + err);
      // }
      // else {
      //   
      response.send("OK");
      // }
   return;
  });
 }

function pdfToPng (filePath, fileName, toPath) {
  try {
    pdfutils(filePath, function(err, doc) {
      var i;
      for (i = 0; i < doc.length; i++) {
        doc[i].asPNG({maxWidth: 1200, maxHeight: 1200}).toFile(toPath + fileName + i + ".png");
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
	
	console.log(req.body.imgName);
	try {
            fs.mkdir(__dirname + "/../public/temp",777,function(err) {
              if (err) {
                console.log("mkdir error : " + err);
              } else {
                console.log("new dirname === " + __dirname + "/../public/temp");
              }
            });  
          } catch (err) {
            console.log("fs.mkdir error : " + err);
        }
	fs.writeFile(__dirname + "/../public/temp/"+req.body.imgName,req.body.imgData,"base64",function(err){
    	if(err){
    		console.log("f:"+err);
    		res.json({success:0});
    	}
   	else{
    		console.log("s:"+req.body.imgName);
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
  fs.readdir(__dirname + "/../public/files/room"+roomId, function (err, files) {
  	var resPath ="files/room"+roomId;
		if (err) {
			res.json({result:0,files:null});
      console.log("readdir error : " + err);
      
    } 
    else{
    	res.json({result:1,files:files,resPath:resPath});
    }
	});
}


exports.start = start; 
exports.toUploadFile = toUploadFile 
exports.show = show; 
exports.domToPng = domToPng; 
exports.saveImg = saveImg; 
exports.toGetAllFile = toGetAllFile;
exports.toGetFileByType = toGetFileByType;
exports.toSearchFile = toSearchFile;
exports.getRoomRes = getRoomRes;
