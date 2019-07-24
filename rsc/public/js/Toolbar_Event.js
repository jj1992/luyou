/* 
 *Web拓扑图形组件[UI] 工具条按钮事件
 *作者： 刘金山
 *日期： 2018-07-01
 */

/*  业务数据类型全局变量: */
/* Globals: */
/*  全局画布对象: */
var myCanvas = null;
var printCanvas = null;
var leftArrow = 37;
var upArrow = 38;
var rightArrow = 39;
var downArrow = 40;
var panRate = 10;
var zoomRate = 1.1;
var imgPath = "img/route/";
/*  业务数据类型全局变量: */
var bizDataType = 'XX系统';;

/*  业务实体属性数据全局变量: */
var entityData = null;
/*  拓扑数据全局变量: */
var topologyData = null;

//平移操作[按钮操作]   
function setMoveAll() {
    if (myCanvas == null) return;
    myCanvas.setMoveAll();
    // if (myCanvas.operateState == 'moveAll') {
    // 	myCanvas.operateState = 'none';
    // 	myCanvas.canvas.style.cursor = 'default'; //hand';// 

    // } else {
    // 	myCanvas.operateState = 'moveAll';
    // 	myCanvas.canvas.style.cursor = 'move'; //hand';// pointer
    // }

}

function loadThemes(val) {
    topologyBackColorType = val;
    Initialize();
    myCanvas.backColorTheme = val;
    myCanvas.draw();
}

function setShadow(isShadow) {
    if (myCanvas == null) return;
    myCanvas.isShadow = isShadow;
    Initialize();
}

function setDrog(allowDrog) {
    if (myCanvas == null) return;
    myCanvas.allowDrog = allowDrog;
    Initialize();
}

function rectSelect() {
    if (myCanvas == null) return;
    myCanvas.setRectSelect();
}

//平移操作[按钮操作]   
function setSelect() {
    if (myCanvas == null) return;
    myCanvas.setSelect();

    // myCanvas.operateState = 'none';
    // myCanvas.canvas.style.cursor = 'default';  
}
//缩放
function zoom(zoomType) {
    if (myCanvas == null) return;
    myCanvas.zoom(zoomType);
    // if (zoomType == 'zoomIn')
    // 	myCanvas.scale += 0.1;
    // else if (zoomType == 'zoomOut')
    // 	myCanvas.scale -= 0.1;
    // myCanvas.draw();

}
//缩放[鼠标滚轮]
function zoomViaMouseWheel(mouseWheelEvent) {
    // if (mouseWheelEvent.wheelDelta > 0)
    // 	zoom('zoomIn');
    // else
    // 	zoom('zoomOut');

    /* When the mouse is over the webpage, don't let the mouse wheel scroll the entire webpage: */
    //	mouseWheelEvent.cancelBubble = true;
    //return false;
}


function InitSmallMap() {
    //hawkEye=null;
    if (hawkEye == null)
        hawkEye = WebGraph.Controls.WebHawkEye.createNew('map_canvas');

    hawkEye.name = "鹰眼";
    hawkEye.init(0, 0, 150, 150, myCanvas);
    hawkEye.draw();
}


function GetTrueCoords(evt) {
    var newScale = SVGRoot.currentScale;
    var translation = SVGRoot.currentTranslate;
    TrueCoords.x = (evt.clientX - translation.x) / newScale;
    TrueCoords.y = (evt.clientY - translation.y) / newScale;
}

function loadNext(val) {
    var browserFrame = document.getElementById('topBrowser');
    browserFrame.contentWindow.allowDrop = false;
    browserFrame.contentWindow.bizDataType = val;
    browserFrame.contentWindow.Init();

}

function CloseTopBrowser() {
    // hideToolTip();
    var topBrowser = document.getElementById("topCanvas");
    topBrowser.style.visibility = "hidden";
    // topBrowser.style.display = "none";

}

function showLoader() {
    var loader = document.getElementById("loader");
    var s_Top = document.body.clientHeight / 2 - 100; //向下滚动了多少
    var s_Left = document.body.clientWidth / 2 - 100; //向左滚动了多少

    loader.style.top = s_Top.toString() + "px";
    loader.style.left = s_Left.toString() + "px";
    loader.style.visibility = "visible";
    loader.style.display = "inline-block";

}

function hideLoader() {
    var loader = document.getElementById("loader");
    loader.style.visibility = "hidden";
    loader.style.display = "none";
}

function doRefersh() {
    Initialize();

}

function doOpen() {

}

function imageDown() {
    if (myCanvas == null) return;
    myCanvas.saveAsLocalImage();
}

function saveAs() {
    if (myCanvas == null) return;
    myCanvas.saveImage();
}

function saveJson() {
    if (myCanvas == null) return;
    var txt = document.getElementById("txtBox");
    txt.value = myCanvas.toJsonString();
}

function doPrint() {
    //jieMianPrint(); 
    // $("#danjiemian_canvas").print({iframe:true,prepend:'<br/>'});  
    // $('#danjiemian_canvas').printPreview();
}

// function doPreview() {
//     //临时绘制
//     jieMianPrint();
//     var image = printCanvas.getImage();
//     //myCanvas.saveImage();
//     // //window.document.write("<img src='" + image + "' alt='打印预览'/>");	
//     var strhtml = [];
//     strhtml.push(' <script  type="text/javascript" src="../../content/web-graph/jquery.min.js"></script>');
//     strhtml.push(' <script  type="text/javascript" src="../../content/web-graph/jQuery.print.min.js"></script> ');
//     strhtml.push(' <script  type="text/javascript" src="../../content/web-graph/jquery.print-preview.js"></script>');
//     strhtml.push(' <script> function doPrint(){ $("#imgPrint").print();}</script>');
//     strhtml.push('<div><input type="image" title="打印" src="img/toolbar/print.png"  onClick="doPrint()"></input>打印</div>');
//     strhtml.push("<img id='imgPrint'  src='" + image + "' alt='打印预览'/>");
//     var win = window.open('about:blank'); //打开预览页面
//     win.document.write(strhtml.join('\n'));
// }

// function duoJieMianPreview() {
//     duoJieMianPrint()
//     var image = printCanvas.getImage();

//     var strhtml = [];
//     strhtml.push(' <script  type="text/javascript" src="../../content/web-graph/jquery.min.js"></script>');
//     strhtml.push(' <script  type="text/javascript" src="../../content/web-graph/jQuery.print.min.js"></script> ');
//     strhtml.push(' <script  type="text/javascript" src="../../content/web-graph/jquery.print-preview.js"></script>');
//     strhtml.push(' <script> function doPrint(){ $("#imgPrint").print();}</script>');
//     strhtml.push('<div><input type="image" title="打印" src="img/toolbar/print.png"  onClick="doPrint()"></input>打印</div>');
//     strhtml.push("<img id='imgPrint'  src='" + image + "' alt='打印预览'/>");
//     var win = window.open('about:blank'); //打开预览页面
//     win.document.write(strhtml.join('\n'));

// }

function addShape(shapeType) {
    if (myCanvas == null) return;
    cancelActiveLayer();
    myCanvas.createShapeType = shapeType;
    myCanvas.activeState = 'create'; //'create' 'none'
    myCanvas.newShape = null;

}

function activeLayer(index) {
    if (myCanvas == null && myCanvas.layers.length < index) return;
    myCanvas.layers.activeLayer = myCanvas.layers[index];

}

function cancelActiveLayer() {
    if (myCanvas == null) return;
    myCanvas.layers.activeLayer = null;
}

function delLayer() {

    var index = document.getElementById("layer").value;
    if (myCanvas == null) return;
    myCanvas.layers.removeLayer(index);
    myCanvas.selectedShape = null;
    myCanvas.selectedShapes = null;
    myCanvas.hoverShape = null;
    myCanvas.draw();
}

function setLocation(coor) {
    if (window.event.keyCode == 13) {
        var p = coor.split(',');
        if (myCanvas == null) return;
        myCanvas.setLocation(parseInt(p[0]), parseInt(p[1]));
    }
}

function setCenterLocation() {

    if (myCanvas == null) return;
    myCanvas.setCenterLocation();

}

function setShapeWidth(width) {
    if (window.event.keyCode == 13) {
        if (myCanvas == null || myCanvas.selectedShape == null) return;
        myCanvas.layers.activeLayer.shapes[0].width = width;
        //myCanvas.selectedShape.width=width;
        // myCanvas.setSelectedShape(myCanvas.selectedShape);
        // myCanvas.selectedShape.setSelected(true);
        // var shp=myCanvas.selectedShape;
        //  shp.setBounds(shp.x,shp.y,width,shp.height); 
        myCanvas.draw();
    }
}

function setShapeHeight(height) {
    if (window.event.keyCode == 13) {
        if (myCanvas == null || myCanvas.selectedShape == null) return;
        //myCanvas.selector=null;
        myCanvas.layers.activeLayer.shapes[0].height = height;
        // myCanvas.selectedShape.height=height;
        // myCanvas.setSelectedShape(myCanvas.selectedShape);
        //myCanvas.selectedSpe.setSelected(true);
        // var shp=myCanvas.selectedShape;
        //  shp.setBounds(shp.x,shp.y,shp.width,height); 

        myCanvas.draw();
    }
}

function doClear() {
    if (myCanvas == null) return;
    myCanvas.selectedShape = null;
    myCanvas.selectedShapes = null;
    myCanvas.hoverShape = null;
    myCanvas.shapes = [];
    myCanvas.connector = null;
    myCanvas.draw();
}

function undo() {
    if (myCanvas == null) return;
    if (myCanvas.shapes.length == 0) return;
    myCanvas.selectedShape = null;
    myCanvas.selectedShapes = null;
    myCanvas.hoverShape = null;
    myCanvas.shapes.splice(myCanvas.shapes.length - 1, 1);

    if (myCanvas.connector && myCanvas.connector.linkLines.length > 0) {
        myCanvas.connector.linkLines = [];
        for (var i = 0; i < myCanvas.shapes.length; i++) {
            if (myCanvas.shapes.length > i + 1)
                myCanvas.connector.addLinkLine(myCanvas.shapes[i], myCanvas.shapes[i + 1], "");
        }
    }
    myCanvas.draw();
}