
/* 
 *Web拓扑图形组件
 *作者： 刘金山
 *日期： 2014-07-01
 */
 
//WebChart画板对象
WebGraph.Controls.WebChart = {
	createNew: function(canvas_id) {
		var t = WebGraph.Model.CanvasBase.createNew(canvas_id);
		 
		t.layers = null; //图层[]
		//t.symbol=[]；
		t.groups = null; //分组[]	 
		t.serialDataX=[];
		t.serialDataY=[];
	 
		//根节点
		t.root = null;
  
		// //事件 处理
		// t.event = WebGraph.Model.Event.createNew(t);
		// //鼠标down
		// t.mouseDown = function(e) {
		// 	t.event.mouseDown(e);
		// };
		// t.mouseMove = function(e) {
		// 	t.event.mouseMove(e);
		// };
		// t.mouseUp = function(e) {
		// 	t.event.mouseUp(e);
		// };
		// t.mouseWheel = function(e) {
		// 	t.event.mouseWheel(e);
		// };
		  

		//绘制图形函数
		t.draw = function() {
			var ctx = t.context;
			if (t.doubleBuffer)
				ctx = bufferContext;

			//清空画板		
			ctx.clearRect(0, 0, t.canvas.width, t.canvas.height);
			ctx.save();
			ctx.scale(t.scale, t.scale);

			if (t.centerPoint)
				ctx.translate(t.centerPoint.X, t.centerPoint.Y);
			var n = 0;

			n = t.backShapes.length;
			for (var i = 0; i < n; i++)
				t.backShapes[i].draw(ctx);

			//连接器
			if (t.connector != null)
				t.connector.draw(ctx);

			n = t.shapes.length;
			for (var i = 0; i < n; i++)
				t.shapes[i].draw(ctx);

			//画选择器
			if (t.selector)
				t.selector.draw(ctx);
			//框选
			if (t.rectSelect)
 				t.rectSelect.draw(ctx);
			//画图例
			if (t.legend)
			{
				t.legend.draw(ctx);
			}

			//双缓冲输出	 
			if (t.doubleBuffer) {
				t.context.clearRect(0, 0, t.canvas.width, t.canvas.height);
				t.context.drawImage(bufferCanvas, 0, 0);
			}
			ctx.restore();
		};
		t.getSvgString = function() {
			var svg = WebGraph.Drawing.CanvasToSvg.createNew(t);
			return svg.getSvgString();
		};

		
		return t;
	}
};

   var data= [
                 { text: 'ABC Info', value: [45, 52, 54, 74, 90, 84], click: function (data) { alert('click！value is ' + data.value); } },
                 { text: 'SixGods', value: [60, 80, 105, 130, 108, 120] },
                 { text: 'YourSister', value: [20, 40, 35, 67, 130, 49] }
            ];

 var options = {
                valueType: 'n', animationSteps: 60,
                title: { content: 'Incomme of three IT companys from March to August in 2013' },
                valueAxis: { linewidth: 2 },
                subTitle: { content: 'SixGods shares the most income.' },
                labelAxis: { labels: ['March', 'April', 'May', 'June', 'July', 'Auguest'], linewidth: 2 },
                scale: { linewidth: 1, backcolors: ['rgba(175,238,238,0.4)', 'rgba(135,206,250,0.4)'] },
                cross: { linewidth: 3 },
                caption: { content: '(million)' },
                yAxisTitle: { content: 'Six Month in 2013' },
                footer: { content: 'This is test footer text.', fontcolor: '#f8d8d8' },
                shadow: { show: true, color: 'rgba(10,10,10,1)', blur: 3, offsetX: 3, offsetY: 3 }
            };

// define([],function(){
//     var myChart={
 
//         init:function(options){
//             this.ctx = options.ctx;
//             this.data = options.data;
//             this.yInterval =options.yInterval||10;
//             this.marginX=options.marginX||8
//             this.w1=options.w1||25
//             this.ox=options.ox||30
//             this.yearMoney=options.yearMonty
//             this.bottom=70
//             this.draw()
 
 
//         },
//         setUnderLine:function(a,b){
//             this.ctx.beginPath()
//             this.ctx.lineWidth = 0.6
//             this.ctx.strokeStyle="#999999"
//             var   dataCollection = this.dataarray[0].datacollection;
 
//             if(b){
//                 x1=a*(this.w1+this.marginX)+this.ox
//                 x2=b*(this.w1+this.marginX)+this.ox
//                 x3=24*(this.w1+this.marginX)+this.ox
//             }
//             /*          this.ctx.moveTo(this.ox+this.w1, this.ctx.canvas.clientHeight -10);
//              this.ctx.lineTo(dataCollection.length*(this.w1+this.marginX)+this.ox-this.marginX, this.ctx.canvas.clientHeight -10 );
//              this.ctx.stroke();*/
//             var yearText= _.keys(this.yearMoney)
//             var yearValue= _.values(this.yearMoney)
 
//             for(var i=0;i<=(dataCollection.length-1)/12;i++){
//                 var x1=i*(this.w1+this.marginX)*12+this.ox+this.w1
//                 var y1=this.ctx.canvas.clientHeight -10
//                 var y2=this.ctx.canvas.clientHeight -30
//                 this.ctx.beginPath()
//                 this.ctx.moveTo(x1, y1 );
//                 this.ctx.lineTo(x1, y2 );
//                 this.ctx.stroke();
 
//                 this.ctx.beginPath()
 
//                 if(i<(dataCollection.length-1)/12){
//                     this.ctx.moveTo(x1, this.ctx.canvas.clientHeight-10);
//                     this.ctx.lineTo(x1+140, this.ctx.canvas.clientHeight-10)
//                 }
 
//                 if(i>0){
//                     this.ctx.moveTo(x1, this.ctx.canvas.clientHeight -10 );
//                     this.ctx.lineTo(x1-140,this.ctx.canvas.clientHeight -10);
//                 }
//                 this.ctx.stroke();
//                 this.ctx.fillStyle="black"
//                 this.ctx.fillText(yearText[i]+"年业绩", x1+165 ,this.ctx.canvas.clientHeight -15);
//                 /*this.ctx.fillStyle="#64B7E9"*/
//                 this.ctx.fillText(yearValue[i], x1+170 ,this.ctx.canvas.clientHeight -1);
 
//             }
//             this.ctx.fillStyle="#8dbb42"
//             this.ctx.fillText("入职",this.data.n1*(this.w1+this.marginX)+this.ox+this.w1-16,this.ctx.canvas.clientHeight -40);
//             /*      this.ctx.fillText("职",this.data.n1*(this.w1+this.marginX)+this.ox+this.w1-6,this.ctx.canvas.clientHeight -25);*/
//         },
//         drawCloumn:function(){
 
//             var x = this.ox+this.w1
//             var y = this.ctx.canvas.clientHeight;
//             var colors = ["#AEDAF5", "#FFCC00"];
 
//             for (var i = 0; i < this.dataarray.length; i++) {
//                 dataCollection = this.dataarray[i].datacollection;
//                 this.ctx.beginPath();
//                 this.ctx.lineWidth = this.w1;
//                 this.ctx.strokeStyle = colors[i];
 
//                 for (var j = 0; j < dataCollection.length; j++) {
 
//                     metaData = dataCollection[j];
//                     this.ctx.moveTo(x, y - this.bottom);
//                     this.ctx.lineTo(x, y - this.bottom  - (metaData.amount / this.yInterval) * 50 );
//                     this.ctx.stroke();
 
 
//                     this.ctx.fillStyle="black"
 
 
//                     //绘制柱的金额
//                     this.ctx.font = "10px Arial";this.ctx.textAlign = "start";
 
//                     if(metaData.amount!==""){
//                         this.ctx.fillStyle="black"
//                         var amountTMP=metaData.amount*1
//                         amountTMP= amountTMP.toFixed(2)
//                         if(amountTMP==0.00){
//                             amountTMP=" "
//                         }
//                     }
//                     else{
//                         this.ctx.fillStyle="#999999"
//                         amountTMP="  "
//                     }
 
//                     this.ctx.fillText(amountTMP, x-15, y - this.bottom - 1 - (metaData.amount /  this.yInterval) * 50);
 
//                     //绘制柱的标题
//                     this.ctx.font = "12px Arial";
 
 
//                     this.ctx.fillText(metaData.title, x-this.w1/2 , y -this.bottom+15);
 
//                     x += (this.categoryCount * this.w1 + this.marginX);
//                 }
 
 
//                 /*ffffffffffff*/
//                 var aa=this.ox+this.w1
//                 for (var j = 0; j < dataCollection.length; j++) {
//                     this.ctx.beginPath()
//                     this.ctx.lineWidth = 1
//                     this.ctx.strokeStyle="#999999"
//                     this.ctx.moveTo(aa, y - this.bottom);
//                     this.ctx.lineTo(aa, y - this.bottom+5);
//                     this.ctx.stroke();
 
//                     aa+= (this.categoryCount * this.w1 + this.marginX);
//                 }
//                 /*ddddddd*/
 
 
 
//                 x = 80 + 30 * (i + 1);
 
//             }
//         },
//         draw:function(){
//             //柱状图标题
//             var title = this.data.title;
 
//             //Y轴标题
//             var verticaltitle = this.data.verticaltitle;
 
//             //X轴标题
//             var horizontaltitle = this.data.horizontaltitle;
 
//             //颜色
//             var colors = ["#AEDAF5", "#FFCC00"];
 
 
//             this.dataarray = this.data.data;
//             var dataCollection;
//             var metaData;
//             var maxamount = 0;
//             this.categoryCount = this.dataarray.length;
//             this.dataCount = this.dataarray[0].datacollection.length;
 
//             //找出最大的数值，以便绘制Y轴的刻度。
//             for (var i = 0; i < this.dataarray.length; i++) {
//                 dataCollection = this.dataarray[i].datacollection;
//                 for (var j = 0; j < dataCollection.length; j++) {
//                     metaData = dataCollection[j]; /*alert(metaData.amount);*/
//                     maxamount = (new Number(metaData.amount) > maxamount) ? metaData.amount : maxamount;
//                 }
//             }
 
//             this.maxAmount=maxamount
 
 
//             //动态设置 canvas 的尺寸
//             this.ctx.canvas.height = Math.ceil(this.maxAmount / this.yInterval) * 50 + 100;    //120 is for the chart title.
//             this.ctx.canvas.width = this.categoryCount * this.dataCount * this.w1 + this.dataCount*this.marginX  + 50;  //150 is for right side index
//             $("#myCanvasDiv").scrollLeft($("#myCanvasDiv")[0].scrollWidth)
//             /*            this.verticalbar()*/
//             this.horizontalbar()
//             this.drawCloumn()
//             this.setUnderLine()
 
//         },
//         verticalbar:function(){
 
//             //计算需要绘制几个刻度
//             var segmentcount = Math.ceil(this.maxAmount / this.yInterval);
 
//             //Y轴的高度
//             var height = segmentcount * 50;
//             this.height=height
//             //绘制Y轴
//             this.ctx.beginPath();
//             this.ctx.lineWidth = 1;
//             this.ctx.strokeStyle = "#999999";
//             this.ctx.moveTo(this.ox, this.ctx.canvas.clientHeight - this.bottom);
//             this.ctx.lineTo(this.ox, this.ctx.canvas.clientHeight - this.bottom - height - 20);
//             this.ctx.stroke();
 
//             //绘制刻度数
//             this.ctx.font = "12px Arial";
//             this.ctx.textAlign = "end";
 
 
 
//             this.ctx.fillText("0", this.ox-10, this.ctx.canvas.clientHeight - this.bottom);
//             for (var j = 1; j < segmentcount + 1; j++) {
//                 /*  this.ctx.lineWidth = 1;
//                  this.ctx.strokeStyle = "#999999";*/
//                 this.ctx.beginPath();
//                 this.ctx.moveTo(this.ox,  this.ctx.canvas.clientHeight - this.bottom - (j ) * 50 );
//                 this.ctx.lineTo(this.ox-10,  this.ctx.canvas.clientHeight -this.bottom - (j ) * 50 );
//                 this.ctx.stroke();
 
//                 this.ctx.fillText(this.yInterval * j, this.ox-10 , this.ctx.canvas.clientHeight - this.bottom - (j - 1) * 50 -40);
 
//             }
 
//         },
//         horizontalbar:function(){
 
 
//             var width = this.categoryCount * this.dataCount *  this.w1 + this.dataCount*this.marginX;
//             //绘制X轴
//             this.ctx.beginPath();
//             this.ctx.lineWidth = 1;
//             this.ctx.strokeStyle = "#999999";
//             this.ctx.moveTo(this.ox, this.ctx.canvas.clientHeight - this.bottom);
//             this.ctx.lineTo(this.ox+width+50, this.ctx.canvas.clientHeight - this.bottom);
//             this.ctx.stroke();
//         }
//     }
 
//     return myChart
// })