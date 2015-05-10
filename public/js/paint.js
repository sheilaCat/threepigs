
var paint={
	init:function(roomId,flag)//flag是标识是创建还是加入  flag = true 创建，false 加入
	{
		//console.log(flag);
		this.roomId = roomId;
		//初始化本地数据
		this.load();
		//如果是创建的房间,就初始化默认数据
		if(flag){
				//alert("clear");
				this.clear();
				this.loadBg(this.resPath+"/"+this.files[this.index]);
		}
		//如果是加入房间，就向服务器请求数据
		/*
		var obj = {
					roomId:this.roomId,
					type:'syncCanvas',
					data:null//data为空表示没有可用数据发送，需要同步
		};
		//当有数据时
		需要通知
		var obj = {
					roomId:this.roomId,
					type:'syncCanvas',
					data:{
								resPath:this.resPath,
								tempDocPath:this.tempDocPath,
								files:this.files,
								index:this.index
								}
		};
		
		*/
		//要求返回resPath，tempDocPath，files，index
		else{
			var obj = {
					'roomId':this.roomId,
					'type':'syncCanvas',
					'data':null//data为空表示没有可用数据发送，需要同步
					};
			socket.emit("message",obj);
		}
	},
	load:function()
	{
		this.x=[];//记录鼠标移动是的X
		this.y=[];//记录鼠标移动是的Y
		this.clickDrag=[];
		this.lock=false;//鼠标移动前，判断鼠标是否按
		this.isEraser=false;
		//this.Timer=null;//橡皮擦启动计
		//this.radius=5;
		this.storageColor="#000000";
		this.eraserRadius=15;//擦除半径值
		this.color=["#000000","#FF0000","#80FF00","#00FFFF","#808080","#FF8000","#408080","#8000FF","#CCCC00"];//画笔颜色值
		this.fontWeight=[1,3,5];
		this.$=function(id){return typeof id=="string"?document.getElementById(id):id;};
		this.canvas=this.$("canvas");
		this.resPath="files";//资源文件保存路径   默认是file
		this.tempDocPath="temp/room"+this.roomId+"/canvas";//临时文件保存路径  默认是
		this.files=["canvas.png"];//当前的资源文件
		this.index = 0;//当前播放的位置
		if (this.canvas.getContext) {

		}
		else {
			alert("您的浏览器不支持 canvas 标签");
			return;
		}
		this.cxt=this.canvas.getContext('2d');
		this.cxt.lineJoin = "round";//context.lineJoin - 指定两条线段的连接方
		this.cxt.lineWidth = 1;//线条的宽度
		this.iptClear=this.$("clear");
		//this.revocation=this.$("revocation");
		this.exportFile=this.$("exportFile");//导出文件
		this.nextPic = this.$("nextPic");//下一张图片按钮
		this.prePic = this.$("prePic");//上一张图片按钮
		this.w=this.canvas.width;//取画布的宽
		this.h=this.canvas.height;//取画布的高
		this.touch =("createTouch" in document);//判定是否为手持设
		this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替
		this.MoveEvent = this.touch ? "touchmove" : "mousemove";
		this.EndEvent = this.touch ? "touchend" : "mouseup";
		this.bind();

	},
	bind:function()
	{
		var t=this;
		/*清除画布*/
		this.iptClear.onclick=function()
		{
				var k=confirm('确定清除画布上面的内容？');
				if(k){
					t.clear();
					t.saveAsLocalImage();
					t.sendData(true);
					
				}
		};
		/*鼠标按下事件，记录鼠标位置，并绘制，解锁lock，打开mousemove事件*/
		this.canvas['on'+t.StartEvent]=function(e)
		{

		var touch=t.touch ? e.touches[0] : e;

		var _x=touch.clientX - touch.target.offsetLeft;//鼠标在画布上的x坐标，以画布左上角为起
		var _y=touch.clientY - touch.target.offsetTop+(e.pageY-touch.clientY);//鼠标在画布上的y坐标，以画布左上角为起

		if(t.isEraser)
		{
		/*
		t.cxt.globalCompositeOperation = "destination-out";
		t.cxt.beginPath();
		t.cxt.arc(_x, _y,t.eraserRadius, 0, Math.PI * 2);
		t.cxt.strokeStyle = "rgba(250,250,250,0)";
		t.cxt.fill();
		t.cxt.globalCompositeOperation = "source-over";
		*/
		t.movePoint(_x,_y);//记录鼠标位置
		t.resetEraser(_x,_y,touch);
	}
	else
		{
			t.movePoint(_x,_y);//记录鼠标位置
			t.drawPoint();//绘制路
		}
		t.lock=true;
	};
	/*鼠标移动事件*/
	this.canvas['on'+t.MoveEvent]=function(e)
	{
	var touch=t.touch ? e.touches[0] : e;
	if(t.lock)//t.lock为true则执行
	{
	var _x=touch.clientX - touch.target.offsetLeft;//鼠标在画布上的x坐标，以画布左上角为起
	var _y=touch.clientY - touch.target.offsetTop+(e.pageY-touch.clientY);//鼠标在画布上的y坐标，以画布左上角为起
	if(t.isEraser)
	{
	//if(t.Timer)clearInterval(t.Timer);
	//t.Timer=setInterval(function(){
	t.movePoint(_x,_y);//记录鼠标位置
	t.resetEraser(_x,_y,touch);
	//},10);
	}
	else
	{
	t.movePoint(_x,_y,true);//记录鼠标位置
	t.drawPoint();//绘制路
	}
	}
	};
	this.canvas['on'+t.EndEvent]=function(e)
	{
    t.sendData(false);
		/*重置数据*/
		t.lock=false;
		t.x=[];
		t.y=[];
		t.clickDrag=[];
		clearInterval(t.Timer);
		t.Timer=null;
		t.saveAsLocalImage();
		
	};
	//this.revocation.onclick=function()
	//{
	//t.redraw();
	//};
	this.prePic.onclick=function(){
		if(t.index==0){
			$(this).attr("disabled","disabled");
		}
		else{
			//切换图片之前先保存下来
			//t.saveAsLocalImage();
			t.index--;
			$("font#pageInf").html("共："+t.files.length+" 页     "+(t.index+1)+"/"+t.files.length);
			$(t.nextPic).removeAttr("disabled");
			t.clear();
			t.loadBg(t.resPath+"/"+t.files[t.index]);
			//t.saveAsLocalImage();
			t.loadPic(t.tempDocPath+"/"+t.files[t.index].substring(0,t.files[t.index].lastIndexOf("."))+".png");
			//t.saveAsLocalImage();
			t.sendData(false);
		}
	};
	this.nextPic.onclick=function(){
		if((t.files.length!=0)&&(t.index==t.files.length-1)){
			$(this).attr("disabled","disabled");
		}
		else{
			//t.saveAsLocalImage();
			t.index++;
			$("font#pageInf").html("共："+t.files.length+" 页     "+(t.index+1)+"/"+t.files.length);
			//$(this).removeAttr("disabled");
			$(t.prePic).removeAttr("disabled");
			t.clear();
			t.loadBg(t.resPath+"/"+t.files[t.index]);
			//t.saveAsLocalImage();
			t.loadPic(t.tempDocPath+"/"+t.files[t.index].substring(0,t.files[t.index].lastIndexOf("."))+".png");
			//t.saveAsLocalImage();
			t.sendData(false);
		}
	};
	this.changeColor();
	this.exportFile.onclick=function()
	{
		t.download();
	};
	/*橡皮擦*/
	this.$("eraser").onclick=function(e)
	{
	t.isEraser=true;
	t.$("error").style.color="red";
	t.$("error").innerHTML="您已使用橡皮擦！";
	};
	
	
	},
	loadBg:function(filePath){
		var t = this;
		//如果是同一个文件，就不加载
		var img = new Image();
		img.src = filePath;
		img.onload = function(){
				t.canvas.width = img.width;
				t.canvas.height = img.height;
		};
		$("#canvas").css("background-image","url('"+filePath+"')");
	},
	loadPic:function(filePath){
		var t = this;
		var img = new Image();
		img.src=filePath;
		img.onload=function(){
    			t.cxt.drawImage(img,0,0);
    };
	},
	movePoint:function(x,y,dragging)
	{
	/*将鼠标坐标添加到各自对应的数组里*/
	this.x.push(x);
	this.y.push(y);
	this.clickDrag.push(y);
	},
	drawPoint:function(x,y,radius)
	{
	for(var i=0; i < this.x.length; i++)//循环数组
	{
	this.cxt.beginPath();//context.beginPath() , 准备绘制一条路径
	if(this.clickDrag[i] && i)
	{//当是拖动而且i!=0时，从上一个点开始画线。
	this.cxt.moveTo(this.x[i-1], this.y[i-1]);//context.moveTo(x, y) , 新开一个路径，并指定路径的起
	}
	else
	{
	this.cxt.moveTo(this.x[i]-1, this.y[i]);
	}
	this.cxt.lineTo(this.x[i], this.y[i]);//context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起
	this.cxt.closePath();//context.closePath() , 如果当前路径是打开的则关闭它
	this.cxt.stroke();//context.stroke() , 绘制当前路径
	}
	},
	clear:function()
	{
		this.cxt.clearRect(0, 0, this.w, this.h);//清除画布，左上角为起
		//this.saveAsLocalImage();
	},
	redraw:function()
	{
	/*撤销*/
	this.cxt.restore();
	},
	preventDefault:function(e){
	/*阻止默认*/
	var touch=this.touch ? e.touches[0] : e;
	if(this.touch)touch.preventDefault();
	else window.event.returnValue = false;
	},
	changeColor:function()
	{
	/*为按钮添加事件*/
	var t=this,iptNum=this.$("color").getElementsByTagName("input"),fontIptNum=this.$("font").getElementsByTagName("input");
	for(var i=0,l=iptNum.length;i<l;i++)
	{
	iptNum[i].index=i;
	iptNum[i].onclick=function(){
	t.cxt.save();
	t.cxt.strokeStyle = t.color[this.index];
	t.storageColor=t.color[this.index];
	t.$("error").style.color="#000";
	t.$("error").innerHTML="如果有错误，请使用橡皮擦：";
	t.cxt.strokeStyle = t.storageColor;
	t.isEraser=false;
	}
	}
	for(var i=0,l=fontIptNum.length;i<l;i++)
	{
	t.cxt.save();
	fontIptNum[i].index=i;
	fontIptNum[i].onclick=function(){
	t.changeBackground(this.index);
	t.cxt.lineWidth = t.fontWeight[this.index];
	t.$("error").style.color="#000";
	t.$("error").innerHTML="如果有错误，请使用橡皮擦：";
	t.isEraser=false;
	t.cxt.strokeStyle = t.storageColor;
	}
	}
	},
	changeBackground:function(num)
	{
	/*添加画笔粗细的提示背景颜色切换，灰色为当前*/
	var fontIptNum=this.$("font").getElementsByTagName("input");
	for(var j=0,m=fontIptNum.length;j<m;j++)
	{
	fontIptNum[j].className="";
	if(j==num){
	fontIptNum[j].className="grea";
	}
	}
	},
	download:function()
	{
		//this.saveAsLocalImage();
		var t = this;
		var obj={
				'type':'exportFile',//类型是导出
				'filePath':t.tempDocPath //传入临时文件夹路径 temp/roomX/fileName
		}
		socket.emit("message",obj);
	},
	resetEraser:function(_x,_y,touch)
	{
	/*使用橡皮擦-提醒*/
	var t=this;
	//this.cxt.lineWidth = 30;
	/*source-over 默认,相交部分由后绘制图形的填充(颜色,渐变,纹理)覆盖,全部浏览器通过*/
	t.cxt.globalCompositeOperation = "destination-out";
	t.cxt.beginPath();
	t.cxt.arc(_x, _y, t.eraserRadius, 0, Math.PI * 2);
	t.cxt.strokeStyle = "rgba(250,250,250,0)";
	t.cxt.fill();
	t.cxt.globalCompositeOperation = "source-over";
	},
	//保存文件
saveAsLocalImage:function() {  
    var t = this;
    t.cxt.globalCompositeOperation="destination-over";//设置在原图下层绘制
    //t.loadPic(t.resPath+"/"+t.files[t.index]);//加载背景图片
    var img = new Image();
    img.src = t.resPath+"/"+t.files[t.index];
    img.onload=function(){
    	t.cxt.drawImage(img,0,0);
    	t.cxt.globalCompositeOperation = "source-over";
    	var imgData = t.canvas.toDataURL("image/png").replace("data:image/png;base64,", ""); //获取图片数据
    	var params ={
   			imgData:imgData,
    		imgName:t.files[t.index].substring(0,t.files[t.index].lastIndexOf("."))+".png",
    		imgPath:t.tempDocPath
    	};
    	//发送保存请求
    	$.ajax({ 
    		url: "/saveImg",
    		type:"post",
    		data: params,
    		dataType:"json",
    		success: function(msg){
    			if(msg.success==1){
    				console.log('ok'); 
    			//保存成功则同步数据
//    				var obj = {
//						'roomId':t.roomId,
//						'type':'syncCanvas',
//						'data':{
//								'resPath':t.resPath,
//								'tempDocPath':t.tempDocPath,
//								'files':t.files,
//								'index':t.index
//								}
//						};
//					socket.emit("message",obj);
    		}
    		else{
    			console.log('fail');
    			//alert("数据保存失败");  
    		} 			
      }  
      });
    };
    
    
  },
  syncCanvas:function(json){
  	
  	var t = this;
  	console.log(t);
  	var syncData = json.data;
  	
  	//如果返回数据为空,就代表有人要请求数据，需要调用一次同步请求
  	if(syncData==null){
  		//alert("null");
  		t.sendData(false);
  	}
  	//如果不为空,就加在返回数据
  	else{
  		var trackData = json.data.datas;
  		//console.log(trackData);
  		//获取数据
  		//如果是同一张图片
  		if(t.files[t.index]==syncData.files[syncData.index]){
  			
  			if(trackData.isClear){
  				t.clear();
  			}
  			else{
  				//空白画布同步，直接加载前景
  				if(trackData.x.length==0)
  				{
  						//alert(syncData.tempDocPath+"/"+t.files[t.index]);
  						t.loadPic(syncData.tempDocPath+"/"+t.files[t.index]);//加载前景
  				}
  				else{
  					var c = t.cxt.strokeStyle;
  					var l = t.cxt.lineWidth;
  					t.cxt.strokeStyle = trackData.color;
  					t.cxt.lineWidth = trackData.size;
  					if(trackData.isEraser){
  						for(var i= 0;i<trackData.x.length;i++){
  							t.resetEraser(trackData.x[i],trackData.y[i],null);
  						}
  					}
  					else{
  						for(var i= 0;i<trackData.x.length;i++){
  							t.movePoint(trackData.x[i],trackData.y[i],true);
  						}
  						t.drawPoint();
  					}
  					t.cxt.strokeStyle = c;
  					t.cxt.lineWidth = l;
 	 				}
  				t.lock=false;
					t.x=[];
					t.y=[];
					t.clickDrag=[];
					clearInterval(t.Timer);
					t.Timer=null;
  			}		
  		}
  		else{
  			//alert("new");
  			t.resPath = syncData.resPath;
  			t.tempDocPath = syncData.tempDocPath;
  			t.files = syncData.files;
  			t.index = syncData.index;
  			//alert("t.resPath="+t.resPath);
  			//alert("t.tempDocPath="+t.tempDocPath);
  			t.loadBg(t.resPath+"/"+t.files[t.index]);//加载背景
  			t.loadPic(t.tempDocPath+"/"+t.files[t.index]);//加载前景
  			$("font#pageInf").html("共："+t.files.length+" 页     "+(t.index+1)+"/"+t.files.length);//显示页码信息
  		}  		
  	}
  	//end
  	
  },
  getRes:function(pName){
  	var t = this;
  	var pathName = pName.substring(0,pName.lastIndexOf("."));
  	var params = {'roomId':t.roomId,
  			'pathName':pathName};
  	//console.log(params);
		$.ajax({ 
    	url: "/getRoomRes",
    	type:"get",
    	data: params,
    	dataType:"json",
    	success: function(msg){
    		if(msg.result==1){
    			console.log('获取文件成功');
    			t.resPath = msg.resPath;
    			t.tempDocPath = msg.tempDocPath;
    			t.files = msg.files;
    			console.log(t.files);
    			t.index = 0;
    			$(t.prePic).attr("disabled","disabled");
    			if(t.files.length==0){
    				//alert("无文件");
    				t.resPath="files";
    				t.tempDocPath="temp";
    				t.files=["canvas.png"];
    			}
    			else{
    				$("font#pageInf").html("共："+t.files.length+" 页     "+(t.index+1)+"/"+t.files.length);
    			}
    			
    			
    			
					
    		}
    		else{
    			//alert("获取文件失败");
    			t.resPath="files";
    			t.tempDocPath="temp";
    			t.files=["canvas.png"];
    			t.index = 0;
    			$("font#pageInf").html("空白画布!");
    		}
    		t.clear();
    		t.loadBg(t.resPath+"/"+t.files[t.index]);
    		t.saveAsLocalImage();
    		t.sendData(false);
      }  
   });
  },
  sendData:function(flag){
  	var t = this;
  	console.log(t);
  	var obj = {
				'roomId':t.roomId,
				'type':'syncCanvas',
				'data':{
						'resPath':t.resPath,
						'tempDocPath':t.tempDocPath,
						'files':t.files,
						'index':t.index,
						'datas':{
										'isClear':flag,//是否清空
										'x':t.x,//x坐标
										'y':t.y,//y坐标
										'color':t.cxt.strokeStyle,//颜色
										'size':t.cxt.lineWidth,//粗细
										"isEraser":t.isEraser,//是不是橡皮擦
										}
							}
					};
			socket.emit("message",obj);
	 }
  
};