var querystring = require("querystring"), 
    fs = require("fs"),
    path = require("path"),
    formidable = require("formidable");
var async = require('async');
try {
  var pdfutils = require('pdfutils').pdfutils;
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
  var form = new formidable.IncomingForm();
  console.log("about to parse");
  
  //form.parse(request, function(error, fields, files) {
    console.log("parsing done");
    console.log(request.files.upload.path);
    // console.log("fields = " + util.inspect(fields,true)); 
    console.log("files = " + util.inspect(request.files,true));
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
    fs.writeFileSync( __dirname + "/../public/files/"+request.files.upload.name, fs.readFileSync(request.files.upload.path) );
    fs.unlink(request.files.upload.path, function (error) {
      // body...
      if (error) {
        console.log("unlink error : " = error);
      }
    });
    console.log("files.upload.path = " + request.files.upload.path);
    
    show(request, response);

    // response.writeHead(200, {"Content-Type": "text/html"}); 
    // console.log("body : " + body);
    // response.write(body); 
    // response.write("received image:<br/>"); 
    // response.write("<img src='/show' />"); 
    // response.end(); 
  //}); 
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

function pdfToPng (request, response) {
  /*async.series([
    function(cb) { java.dom2pdf(__dirname + "/testpdf.pdf", cb)},
    function(cb) { java.dom2pdf(__dirname + "/testdocx.docx", cb)},
    function(cb) { java.dom2pdf(__dirname + "/testxlsx.xlsx", cb)},
    function(cb) { java.dom2pdf(__dirname + "/testppt.ppt", cb)}
  ], function(err, results) {
    for (var i in  results) {
        console.log(results[i]);
    }
    //console.log(results[0]);
      return ;
  });*/
 // console.log("testpdf.pdf path = " + java.dom2pdf(__dirname + "/testpdf.pdf"));
 java.dom2pdf(__dirname + "/testdocx.docx", function (err, result) {
    console.log("testdocx.docx path = " + result);
  });
  //console.log("testxlsx.xlsx path = " + java.dom2pdf(__dirname + "/testxlsx.xlsx"));
  //console.log("testppt.ppt path = " + java.dom2pdf(__dirname + "/testppt.ppt"));
}

exports.start = start; 
exports.toUploadFile = toUploadFile 
exports.show = show; 
exports.pdfToPng = pdfToPng; 
