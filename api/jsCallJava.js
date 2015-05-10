try {
	var zipdir = require('zip-dir');
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
var async = require('async');

var querystring = require("querystring"), 
    fs = require("fs"),
    path = require("path"),
    formidable = require("formidable");


var util = require('util');  


function dom2pdf(filePath, callback) {
	var arr = filePath.split("/");
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
			} else {
				console.log("new dirname === " + fileRoot+"/"+fileName[0]);
			}
		});  
	} catch (err) {
		console.log("fs.mkdir error : " + err);
	}
	if (fileName[1] == "pdf" || fileName[1] == "PDF") {
		
		// callback(null,pdfToPng(filePath, 
		// 		fileName[0], 
		// 		fileRoot+"/"+fileName[0] + "/"
		// 	));
		callback(null,filePath, 
				fileName[0], 
				fileRoot+"/"+fileName[0] + "/");
		return;
	}
	var pdfConverter = java.import('com.converter.pdfConverter.OpenOfficeDomConverter');
	var dom2pdf = new pdfConverter("/opt/openoffice4",8100);
	dom2pdf.convertFile(filePath ,
		fileRoot + "/" + fileName[0] + ".pdf", function(err,result){
			var pngpath;
			if (result == true) {
				// pngpath  = pdfToPng (fileRoot+"/"+fileName[0] + "/" + fileName[0] + ".pdf", 
				// 		fileName[0],
				// 		fileRoot+"/"+fileName[0] + "/"
				// 	);
				console.log("soce path ==== " + filePath);
				console.log("pdf path === " + fileRoot+"/"+fileName[0] + "/" + fileName[0] + ".pdf");
				callback(null,fileRoot + "/" + fileName[0] + ".pdf", 
						fileName[0],
						fileRoot+"/"+fileName[0] + "/");
				return;
			} else {
				console.log("change fail!!!!!!!!!!!!!!!!!!!!!!!!!!!");
				callback("Error",null, null, null);
				return;
			}
		}
	);
}



exports.dom2pdf = dom2pdf; 
