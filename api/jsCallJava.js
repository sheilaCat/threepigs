try {
var java = require("java");
java.classpath.push(__dirname + "/jar/commons-io-2.2.jar");
java.classpath.push(__dirname + "/jar/dom2pdf.jar");
java.classpath.push(__dirname +"/jar/jodconverter-core-3.0-beta-4.jar");
java.classpath.push(__dirname +"/jar/juh-3.2.1.jar");
java.classpath.push(__dirname +"/jar/jurt-3.2.1.jar");
java.classpath.push(__dirname +"/jar/ridl-3.2.1.jar");
java.classpath.push(__dirname +"/jar/unoil-3.2.1.jar");
} catch (err) {
	console.log("require('java') error :" + err);
}

var querystring = require("querystring"), 
    fs = require("fs"),
    path = require("path"),
    formidable = require("formidable");

try {
  var pdfutils = require('pdfutils').pdfutils;
} catch (error) {
  console.log("require pdfutils error: " + error);
}
var util = require('util');  

function dom2pdf(filePath, callback) {
	var arr = filePath.split("/");
	//var fileName = filePath.substring(filePath.lastIndexOf("/"),filePath.lastIndexOf("."));
	var fileRoot = filePath.substring(0,filePath.lastIndexOf("/"));

console.log("fileRoot = " + fileRoot);

	var file = arr[arr.length-1];

console.log("file = " + file);

	var fileName = file.split(".");
	if (fileName.length <= 1) {
		return;
	}
	//fs.exists(文件路径,callback(是否存在));
	try {
		fs.mkdir(fileRoot+"/"+fileName[0],777,function(err) {
			if (err) {
				console.log("mkdir error : " + err);
			}
		});  
	} catch (err) {
		console.log("fs.mkdir error : " + err);
	}
	if (fileName[1] == "pdf" || fileName[1] == "PDF") {
		
		callback(null,pdfToPng(filePath, 
				fileName[0], 
				fileRoot+"/"+fileName[0] + "/"
			));
		/*return pdfToPng(filePath, 
				fileName[0], 
				fileRoot+"/"+fileName[0] + "/"
			);*/
		return;
	}
	
	var pdfConverter = java.import('com.converter.pdfConverter.OpenOfficeDomConverter');
	var dom2pdf = new pdfConverter("/opt/openoffice4",8100);
	dom2pdf.convertFile(filePath ,
		fileRoot+"/"+fileName[0] + "/" + fileName[0] + ".pdf");
	console.log("soce path ==== " + filePath);
	console.log("pdf path === " + fileRoot+"/"+fileName[0] + "/" + fileName[0] + ".pdf");
	callback(null,pdfToPng (fileRoot+"/"+fileName[0] + "/" + fileName[0] + ".pdf", 
			fileName[0],
			fileRoot+"/"+fileName[0] + "/"
		));
	/*return pdfToPng (fileRoot+"/"+fileName[0] + "/" + fileName[0] + ".pdf", 
			fileName[0],
			fileRoot+"/"+fileName[0] + "/"
		);*/
	return;
}

function pdfToPng (filePath, fileName, toPath) {
	try {
		pdfutils(filePath, function(err, doc) {
			var i;
			for (i = 0; i < doc.length; i++) {
				doc[i].asPNG({maxWidth: 1200, maxHeight: 1200}).toFile(toPath + fileName + i + ".png");
				debugger;
			}
		});
		return toPath;
	} catch (error) {
		console.log("pdfutils error : " + error);
		return "";
  	 }
}

exports.dom2pdf = dom2pdf; 
