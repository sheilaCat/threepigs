
function indexPage(request,response){
		 response.sendfile('views/welcome.html');
	console.log("进了indexpage");
}
exports.indexPage = indexPage;
