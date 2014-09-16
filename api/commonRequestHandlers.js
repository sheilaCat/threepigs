
function indexPage(request,response){
		response.sendfile('views/index.html');
}
exports.indexPage = indexPage;