
 /* 
 *提示：toolTip
 *作者： 刘金山
 *日期： 2014-07-01
 */
WebGraph.Controls.ToolTip=function(data){
 this.dataList=data;
 this.tip=document.getElementById("toolTip");
 this.visible=false;
 this.showTooltip=function(evt, id) {
	var XPos = evt.clientX;
	var YPos = evt.clientY; 

 	if (id == null || id == "" || id == "-1") {
 		this.hideToolTip();
 		return;
 	}

 	var listString = "";
 	//查找业务实体对象属性  刘金山
 	if (this.dataList != null) {
 		var ty = 10;
 		for (i = 0; i < this.dataList.length; i++) {
 			if (this.dataList[i].ID == id) {
 				var json = eval(this.dataList[i].Info);
 				for (var n = 0; n < json.length; n++) {
 					listString = listString + '<tr><td width="70"  style="BORDER-RIGHT: medium none; BORDER-LEFT: medium none height:15px"> ' + json[n].key + '</td><td style="BORDER-RIGHT:medium none;height:15px">' + json[n].val + '</td></tr>';
 				}

 				break;
 			}
 		}
 	}

 	if (listString == "") {
 		this.hideToolTip();
 		return;
 	}

 	var tooltipText = '<table id="keyvalList"  style="font-family:宋体;font-size:12px" table-layout="fixed"  display="block"   width="220" border="1"  cellpadding="5" cellspacing="0" bordercolor="S0" bgcolor="DarkGray"  frame="below"  hspace="1" vspace="1">';
 	//var tooltipText='<table id="keyvalList" borderColor=#ff6600 bgColor=#FFD2D2 width="200" border="0" cellpadding="0" cellspacing="0"  frame="below">';
 	tooltipText = tooltipText + ' <tr><td width="70"  height="15" bgcolor="DimGray">属性名称</td><td bgcolor="DimGray">属性值</td></tr>';
 	tooltipText = tooltipText + listString;
 	tooltipText = tooltipText + ' </table>';

 	// var arrowDir = 'L',
 	// 	tipPosX, tipPosY;
 	// var pts, tipshOffset;

 

 	var s_Top = document.documentElement.scrollTop || document.body.scrollTop; //向下滚动了多少
 	var s_Left = document.documentElement.scrollLeft || document.body.scrollLeft; //向左滚动了多少

 	//var panel_Tooltip = document.getElementById("panel_Tooltip");
 //	var panel_Tooltip = document.getElementById("toolTip");
 	this.tip.style.top = parseInt(YPos) + 20 + s_Top + "px";
 	this.tip.style.left = parseInt(XPos) + 20 + s_Left + "px";
 	this.tip.style.visibility = "visible";
 	this.tip.style.display = "inline-block";

 	var tableList = document.getElementById("keyvalList");
 	tableList.innerHTML = tooltipText;
   this.visible=true;
 	//	 var tiptxt = document.getElementById("tiptxt");
 	//
 	//		 var tipText = document.createTextNode(tooltipText);
 	//		     tiptxt.replaceChild(tipText,tiptxt.firstChild);

 	//或者用
 	//tiptxt.textContent = tooltipText;


 	return;
 };

  this.hideToolTip=function() {
 	//var t = document.getElementById("toolTip");
 	this.tip.style.visibility = "hidden";
 	this.tip.style.display = "none";
 	this.visible=false;
 	//	    var topBrowser = document.getElementById("topCanvas");
 	//		 topBrowser.style.visibility = "hidden";
 	// topBrowser.style.display = "none";

 };
 
};
