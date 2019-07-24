/* 
 *Web拓扑图形组件
 *作者： 刘金山
 *日期： 2014-07-01
 */

//Web图形鹰眼对象
var hawkEye = null;
WebGraph.Controls.WebHawkEye = {
	createNew: function(canvas_id) {
		var me = WebGraph.Model.CanvasBase.createNew(canvas_id);
		me.divWorkArea = document.getElementById('workarea');
		me.groups = null; //分组[]	 
		me.sourceCanvas = null;
		me.sourceCanvasW = 0;
		me.sourceCanvasH = 0;

		me.canvasData = null;
		me.binaryData = null;		

		me.rectArea = null;
		me.rectView = null;
		me.viewWidth = 200;
		me.viewHeight = 200;
		//初始
		me.init = function(x, y, w, h, srcCanvas) {
			me.rectArea = null;
			me.rectView = null;
			me.sourceCanvas = srcCanvas;
			me.width = w;
			me.x = x;
			me.y = y;
			me.height = h;
			me.canvas.width = w;
			me.canvas.height = h;
			me.sourceCanvasW = srcCanvas.width;
			me.sourceCanvasH = srcCanvas.height;
			//复制图片
			// me.canvasData = srcCanvas.context.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
			// me.binaryData = me.canvasData.data;

			// //使用双缓冲	  
			// me.bufferCanvas= documenme.createElement("canvas");
			// me.bufferContext = me.bufferCanvas.getContext("2d");
			// //现在，保证缓冲canvas的大小与显示canvas大小一致
			// me.bufferCanvas.width =srcCanvas.width;
			// me.bufferCanvas.height =biz_canvas.height;

			// me.bufferContexme.putImageData(me.canvasData, 0, 0);
			//滚动条事件注册
			me.divWorkArea = document.getElementById('workarea');
			me.divWorkArea.removeEventListener('scroll', me.scroll, false);
			me.divWorkArea.addEventListener('scroll', me.scroll, false);

			//画布的宽高比例
			var scaleW = me.divWorkArea.clientWidth / srcCanvas.width;
			var scaleH = me.divWorkArea.clientHeight / srcCanvas.height;
			var whScale = me.sourceCanvas.width / me.sourceCanvas.height
			var areaW;
			var areaH;

			//计算缩放大小
			if (whScale > 1) {
				me.viewWidth = me.width;
				me.viewHeight = me.width / whScale;
			} else {
				me.viewWidth = me.height * whScale;
				me.viewHeight = me.height;
			}

			areaW = me.viewWidth * scaleW;
			areaH = me.viewHeight * scaleH

			if (me.rectView == null) {
				me.shapes = [];
				//view容器
				me.rectView = WebGraph.Shape.Rect.createNew();
				me.rectView.allowDrog = false;
				me.rectView.editSize = false;
				me.rectView.shadow = false;
				me.rectView.opacity = 0.1;
				me.rectView.groups = [];
				me.addShape(me.rectView);

				//矩形区域
				me.rectArea = WebGraph.Shape.Rect.createNew();

				me.rectArea.allowDrog = true;
				me.rectArea.editSize = false;
				me.rectArea.shadow = false;
				me.rectArea.stroke="#000000";
				me.rectArea.opacity = 0.3;
				me.rectArea.parent = me.rectView;
				me.addShape(me.rectArea);
				me.rectView.groups.push(me.rectArea);
				// //事件注册
				// me.canvas.addEventListener('mousedown', me.mouseDown, false);
				// me.canvas.addEventListener('mousemove', me.mouseMove, false);
				// me.canvas.addEventListener('mouseup', me.mouseUp, false);
				//      //添加事件
				me.addEvent(me.canvas, 'mousedown', me.mouseDown, false) ;
				me.addEvent(me.canvas,'mousemove', me.mouseMove, false);
				me.addEvent(me.canvas,'mouseup', me.mouseUp, false);
				me.addEvent(me.canvas,'touchmove', me.touchMove, false);	
				me.addEvent(me.canvas,'touchend', me.touchEnd, false);
				me.addEvent(me.canvas,'touchstart', me.touchStart, false);
			}
			//初始大小
			me.rectView.init(0, 0, me.viewWidth, me.viewHeight, 3, "DimGray", "black");
			me.rectArea.init(0, 0, areaW, areaH, "#000000", "blue");
		};
		//事件 处理
		me.event = WebGraph.Model.Event.createNew(me);

		me.scroll = function(e) {
			if (me.isMousedown) return;
			me.rectArea.x = me.divWorkArea.scrollLeft * (me.viewWidth / me.sourceCanvasW);
			me.rectArea.y = me.divWorkArea.scrollTop * (me.viewHeight / me.sourceCanvasH);
			me.draw();
		};

		//鼠标down
		me.mouseDown = function(e) {
			me.isMousedown = true;
			me.startPoint = {
				X: e.pageX,
				Y: e.pageY
			};
		    me.canvas.style.cursor = 'move';
			//me.event.mouseDown(e);
		};

		me.mouseMove = function(e) {
			if (me.isMousedown == false) return;
			var coor =me.event.getCoorConver(e.pageX, e.pageY);//{x:e.pageX, y:e.pageY};// 

			if (me.rectArea.isInside(coor.x, coor.y)) {
				var newX = e.pageX - me.startPoint.X;
				var newY = e.pageY - me.startPoint.Y;
				me.rectArea.setMove(newX, newY);

				me.draw();
				me.startPoint = {
					X: e.pageX,
					Y: e.pageY
				};
				//me.event.mouseMove(e);
				// if (me.hoverShape==me.rectArea && me.isMousedown && me.hoverShape.hovered)
				// {
				me.divWorkArea.scrollLeft = me.rectArea.x / (me.viewWidth / me.sourceCanvasW);
				me.divWorkArea.scrollTop = me.rectArea.y / (me.viewHeight / me.sourceCanvasH);
				// }	 
			}
		};
	    me.mouseUp = function(e) {
			me.isMousedown = false;
			me.operateState = 'none';
			me.downPoint = null;
			me.canvas.style.cursor = 'default';
			//	me.event.mouseUp(e);
		};
        //滑动事件
		me.touchStart = function(event) {
		 var touch = event.touches[0];
		 me.startPoint = {
				X: touch.pageX,
				Y: touch.pageY
			};

		};

		me.touchMove = function(event){
		 var touch = event.touches[0]; 
		 var coor = me.event.getCoorConver(touch.pageX, touch.pageY);
			if (me.rectArea.isInside(coor.x, coor.y)) {
				var newX = touch.pageX - me.startPoint.X;
				var newY = touch.pageY - me.startPoint.Y;
				me.rectArea.setMove(newX, newY);

				me.draw();
				me.startPoint = {
					X: touch.pageX,
					Y: touch.pageY
				}; 
				me.divWorkArea.scrollLeft = me.rectArea.x / (me.viewWidth / me.sourceCanvasW);
				me.divWorkArea.scrollTop = me.rectArea.y / (me.viewHeight / me.sourceCanvasH);
				 	 
			}
		   
		} ; 

		me.touchEnd=function (event){
		   //scrollTopVal=$("#touchBox").scrollTop();
		};		

		//绘制图形函数
		me.draw = function() {
			var ctx = me.context;
			ctx.save();
			//清空画板		
			ctx.clearRect(0, 0, me.width, me.height);
			ctx.drawImage(me.sourceCanvas.canvas, 0, 0, me.viewWidth, me.viewHeight);
			me.rectView.draw(ctx);
			me.rectArea.draw(ctx);
			// //ctx.drawImage(me.bufferCanvas, 0, 0,me.viewWidth,me.viewHeight);			
			ctx.restore();
		};

		return me;
	}
};


// 三种在规范中列出并获得跨移动设备广泛实现的基本触摸事件：

// 1. touchstart ：手指放在一个DOM元素上。
// 2. touchmove ：手指拖曳一个DOM元素。
// 3. touchend ：手指从一个DOM元素上移开。

// 每个触摸事件都包括了三个触摸列表：

// 1. touches ：当前位于屏幕上的所有手指的一个列表。
// 2. targetTouches ：位于当前DOM元素上的手指的一个列表。
// 3. changedTouches ：涉及当前事件的手指的一个列表。

// 例如，在一个touchend事件中，这就会是移开的手指。

// 这些列表由包含了触摸信息的对象组成：

// 1. identifier ：一个数值，唯一标识触摸会话（touch session）中的当前手指。
// 2. target ：DOM元素，是动作所针对的目标。
// 3. 客户/页面/屏幕坐标 ：动作在屏幕上发生的位置。
// 4. 半径坐标和 rotationAngle ：画出大约相当于手指形状的椭圆形。
