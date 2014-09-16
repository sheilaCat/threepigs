var querystring = require("querystring"), 
    fs = require("fs"),
    path = require("path"),
    formidable = require("formidable");

var util = require('util');  
 
function start(response) { 
  console.log("Request handler 'start' was called."); 
 
  var body = '<html>'+ 
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
 
function upload(response, request) { 
  console.log("Request handler 'upload' was called."); 
  // console.log("response = " + util.inspect(response,true)); 
  // console.log("request = " + util.inspect(request,true)); 
  var form = new formidable.IncomingForm(); 
  console.log("about to parse"); 
  form.parse(request, function(error, fields, files) { 
    console.log("parsing done"); 
    console.log(files.upload.path); 
    // console.log("fields = " + util.inspect(fields,true)); 
    console.log("files = " + util.inspect(files,true)); 
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
    fs.writeFileSync( "E:\\development\\nodejs\\workspaces\\filesupload\\test.png", fs.readFileSync(files.upload.path) );
    fs.unlink(files.upload.path, function (error) {
      // body...
      if (error) {
        console.log("unlink error : " = error);
      }
    });
    console.log("files.upload.path = " + files.upload.path);
    //fs.renameSync(files.upload.path, "G:\\test.png"); //winodw认的路径，nodejs的安装路径 
    //fs.renameSync(files.upload.path, "d:/tmp/test.png");  这个也报错 
    response.writeHead(200, {"Content-Type": "text/html"}); 
    response.write("received image:<br/>"); 
    response.write("<img src='/show' />"); 
    response.end(); 
  }); 
} 
 
function show(response) { 
  console.log("Request handler 'show' was called."); 
  //winodw认的路径，nodejs的安装路径 
  fs.readFile("test.png", "binary", function(error, file) { 
    if(error) { 
      console.log("error = " + error); 
      response.writeHead(500, {"Content-Type": "text/plain"}); 
      response.write(error + "\n"); 
      response.end(); 
    } else { 
      console.log(file.path); 
      response.writeHead(200, {"Content-Type": "image/png"}); 
      response.write(file, "binary"); 
      response.end(); 
    } 
  });
} 
 
exports.start = start; 
exports.upload = upload; 
exports.show = show; 