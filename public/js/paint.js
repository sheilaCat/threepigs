
var paint={
	init:function(roomId)
	{
		this.load(roomId);
	},
	load:function(roomId)
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
		this.fontWeight=[2,5,8];
		this.$=function(id){return typeof id=="string"?document.getElementById(id):id;};
		this.canvas=this.$("canvas");
		this.imgName="";//输入文件名字
		this.resPath="";//资源文件路径
		this.roomId=roomId;//创建画布的房间的名字
		this.files=[];//当前的资源文件
		this.index = 0;//当前播放的位置
		if (this.canvas.getContext) {

		}
		else {
			alert("您的浏览器不支持 canvas 标签");
			return;
		}
		this.cxt=this.canvas.getContext('2d');
		this.cxt.lineJoin = "round";//context.lineJoin - 指定两条线段的连接方
		this.cxt.lineWidth = 5;//线条的宽度
		this.iptClear=this.$("clear");
		//this.revocation=this.$("revocation");
		this.exportFile=this.$("exportFile");//图片路径按钮
		this.nextPic = this.$("nextPic");//下一张图片按钮
		this.prePic = this.$("prePic");//上一张图片按钮
		this.w=this.canvas.width;//取画布的
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
					var obj = {
						'roomId':paint.roomId,
						'type':'syncCanvas',
						'data':{
								'isClear':true,//是否清空
								'x':t.x,//x坐标
								'y':t.y,//y坐标
								'color':t.cxt.strokeStyle,//颜色
								'size':t.cxt.lineWidth,//粗细
								"isEraser":t.isEraser,//是不是橡皮擦
								}
					};
					socket.emit("message",obj);
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
		//var touch=t.touch ? e.touches[0] : e;
	var obj = {
				'roomId':paint.roomId,
				'type':'syncCanvas',
				'data':{
								'isClear':false,//是否清空
								'x':t.x,//x坐标
								'y':t.y,//y坐标
								'color':t.cxt.strokeStyle,//颜色
								'size':t.cxt.lineWidth,//粗细
								"isEraser":t.isEraser,//是不是橡皮擦
								}
	};
	/*重置数据*/
	t.lock=false;
	t.x=[];
	t.y=[];
	t.clickDrag=[];
	clearInterval(t.Timer);
	t.Timer=null;
		socket.emit("message",obj);
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
			t.index--;
			$("font#pageInf").html("共："+t.files.length+" 页     "+(t.index+1)+"/"+t.files.length);
			$(t.nextPic).removeAttr("disabled");
			t.clear();
			t.loadBg(t.resPath+"/"+t.files[t.index]);
		}
	};
	this.nextPic.onclick=function(){
		if(t.index==t.files.length-1){
			$(this).attr("disabled","disabled");
		}
		else{
			t.index++;
			$("font#pageInf").html("共："+t.files.length+" 页     "+(t.index+1)+"/"+t.files.length);
			//$(this).removeAttr("disabled");
			$(t.prePic).removeAttr("disabled");
			t.clear();
			t.loadBg(t.resPath+"/"+t.files[t.index]);
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
	t.getRes();
	
	},
	loadBg:function(filePath){
		var t = this;
		t.imgName = filePath.substring(filePath.lastIndexOf("/")+1);
		$("#canvas").css("background-image","url('"+filePath+"')");
	},
	loadPic:function(filePath){
		
		var t = this;
		var img = new Image();
		img.src=filePath;
		img.onload=function(){
    		t.cxt.drawImage(img,0,0);
    		t.cxt.globalCompositeOperation = "source-over";    
    };
		t.cxt.drawImage(img,0,0);
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
		var obj={
			'type':'exportFile',
			'roomId':this.roomId
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
	saveAsLocalImage:function() {  
    var t = this;
    t.cxt.globalCompositeOperation="destination-over";//设置在原图下层绘制
    t.loadPic(t.resPath+"/"+t.imgName);//加载背景图片
    var img = t.canvas.toDataURL("image/png").replace("data:image/png;base64,", ""); //获取图片数据
    var params ={
   		imgData:img,
    		imgName:"track_"+t.imgName.substring(0,t.imgName.lastIndexOf("/"))+".png"
    };
    //发送保存请求
    $.ajax({ 
    	url: "/saveImg",
    	type:"post",
    	data: params,
    	dataType:"json",
    	success: function(msg){
    		if(msg.success==1){
    			alert('ok');  
    		}
    		else{
    			alert('fail');  
    		}
      			
      }  
      });
  },
  syncCanvas:function(x,y,color,size,isEraser,isClear){
  	var t = this;
  	if(isClear){
  		t.clear();
  	}
  	else{
  		var c = t.cxt.strokeStyle;
  		var l = t.cxt.lineWidth;
  		t.cxt.strokeStyle = color;
  		t.cxt.lineWidth = size;
  		if(isEraser){
  			for(var i= 0;i<x.length;i++){
  				t.resetEraser(x[i],y[i],null);
  			}
  		}
  		else{
  			for(var i= 0;i<x.length;i++){
  				t.movePoint(x[i],y[i],true);
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
  },
  getRes:function(){
  	var t = this;
  	var params = {'roomId':t.roomId};
		$.ajax({ 
    	url: "/getRoomRes",
    	type:"get",
    	data: params,
    	dataType:"json",
    	success: function(msg){
    		if(msg.result==1){
    			alert('获取文件成功');
    			t.resPath = msg.resPath;
    			t.files = msg.files;
    			console.log(t);
    			$(t.prePic).attr("disabled","disabled");
    			t.clear();
					t.loadBg(t.resPath+"/"+t.files[t.index]);
					$("font#pageInf").html("共："+t.files.length+" 页     "+(t.index+1)+"/"+t.files.length);
    		}
    		else{
    			alert("获取文件失败");
    		}
      			
      }  
   });
  }
  
};