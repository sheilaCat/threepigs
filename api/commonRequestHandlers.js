
function indexPage(request,response){
  response.sendfile('views/welcome.html');
}
exports.indexPage = indexPage;
