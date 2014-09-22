var myName = false;
var firstconnect = true;

var connection = function () {
    if (firstconnect) {
    	alert("建立连接成功");
	    // 建立websocket连接
	    socket = io.connect('http://localhost:3000');

	    // 收到server的连接确认
	    socket.on('open',function(){
		// TODO Do something.
	    });

	    // 监听system事件，判断welcome或者disconnect，打印系统消息信息
	    socket.on('system',function(json){
		if (json.type === 'welcome'){
		    // TODO If welcome,than do.
		}else if(json.type == 'disconnect'){
		    // TODO If disconnect,than do.
		}
	    });

	    // 监听message事件，打印消息信息
	    socket.on('message',function(json){
		// TODO Do something.
	    });

	    // 监听creatRoom事件，打印消息信息
	    socket.on('creatRoom',function(json){
		// TODO Do something.
		alert("新建房间: " + json);
	    });
	} else {
alert("建立连接失败");
		socket.socket.reconnect();
	}
}

function disconnect() {
    socket.disconnect();
}
function send() {
	var obj = {
		author:'System',
		type:'creatRoom',
		msg:'测试'
	};
	socket.emit("message",obj);
}
