var myName = false;
var firstconnect = true;
if(session.firstconnect != null){
	firstconnect = session.firstconnect;
}
var connection = function () {
    if (firstconnect) {
    	//alert("建立连接成功");
	    // 建立websocket连接
	    socket = io.connect('http://localhost:3000');
	    if(session.people != null){
	    	var people = JSON.parse(session.people);
	    	var obj = {
				'type' : 'login',
				'peopleId' : people.peopleId
			};
			socket.emit('message', obj);
	    }
		
		//收到其它人登录信息
	    socket.on('login',function(json){
		// TODO Do something.
		var people = JSON.parse(session.people);
			if(json.peopleId == people.peopleId){
				session.clear();
				console.log(session);
				alert('被挤下线');
				socket.disconnect();
				window.location.reload();
			}
	    });		

	    // 收到server的连接确认
	    socket.on('open',function(){
		// TODO Do something.
		firstconnect = false;
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
	   //画布同步事件
	   socket.on('syncCanvas',function(json){
					// TODO Do something.
					if(session.roomId == json.roomId){
							paint.syncCanvas(json);
					}
	    });
	    //导出文件
	    socket.on('exportFile',function(json){
					// TODO Do something.
		var exists = json.exists;
		if(exists){
			var url = json.filePath;
			var aLink = document.createElement('a');
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错
			aLink.download = url;
			aLink.href = url;
			aLink.dispatchEvent(evt);
		}
		else{
			alert("请求资源不存在");
		}
					
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
