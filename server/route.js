var url = require("url"); 
function route(handle,request, response) {
	var pathname = url.parse(request.url).pathname;  
  console.log("About to route a request for " + pathname); 
  if (typeof handle[pathname] === 'function') { 
    handle[pathname](request, response); 
  } else { 
    console.log("No request handler found for " + pathname); 
    response.writeHead(404, {"Content-Type": "text/html"}); 
    response.write("404 Not found"); 
    response.end(); 
  } 
} 
exports.route = route;