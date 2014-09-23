var java = require("java");
java.classpath.push("jar/commons-io-2.2.jar");
java.classpath.push("jar/dom2pdf.jar");
java.classpath.push("jar/jodconverter-core-3.0-beta-4.jar");
java.classpath.push("jar/juh-3.2.1.jar");
java.classpath.push("jar/jurt-3.2.1.jar");
java.classpath.push("jar/ridl-3.2.1.jar");
java.classpath.push("jar/unoil-3.2.1.jar");

function dom2pdf(filePath) {
var pdfConverter = java.import('com.converter.pdfConverter');
var dom2pdf = new pdfConverter("/opt/openoffice4",{8100});
}

