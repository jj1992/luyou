/*@示意图 地井单截截面和多截面绘制
 *2018-04-01  刘金山
 */
var keyCodeID = null;
var selectedShapes = [];
var danJieMianData;
var virtualShape;
var isEdit = 1;
var AB_MIAN = 'A';
var curGuanKongHao = "";
var cableMoveStart = false;
var isShowHoleNO = true;
// var legendData=[{"id":"1", "layoutType":"default","legendType":"color"，
// "items":[{"id":"1","symbol":"Gold","text":"空闲"},{"id":"2","symbol":"Turquoise","text":"预占"},
// {"id":"3","symbol":"DeepPink","text":"占用"},{"id":"4","symbol":"BlueViolet","text":"预留"},
// {"id":"5","symbol":"rgb(255,0,0)","text":"红色子管"}, {"id":"6","symbol":"rgb(0,0,255)","text":"蓝色子管"},
// {"id":"7","symbol":"rgb(255,255,255)","text":"白色子管"},
// , {"id":"8","symbol":"rgb(127,127,255)","text":"光缆颜色"}
// , {"id":"9","symbol":"rgb(255,255,0)","text":"电缆颜色"}]
// },
// {"id":"2", "layoutType":"default","legendType":"image"，
// "items":[{"id":"1","symbol":"../img/4guzhang.png","text":"故障"},
// {"id":"2","symbol":"../img/3yuliu.png","text":"预留"},
// {"id":"3","symbol":"../img/chuzu.png","text":"出租"}]
// }];

var imageList = [];
var imagPathList = [];
var loadCount = 0; //图片加载计数器
//批量加载图片
function loadImages(imagPathList, callback) {
    imageList = [];
    for (var i = 0; i < imagPathList.length; i++) {
        var img = new Image();
        img.onload = function() {
            loadCount++;
            if (loadCount == imagPathList.length) {
                //图片批量加载完后,回调函数
                callback();
            }
        }
        img.src = imagPathList[i].file;
        imageList.push(img);
    }
}

function getBasePath() {
    var localObj = window.location;
    var contextPath = localObj.pathname.split("/")[1];
    var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;

    return basePath;
}

function initImagePath() {
    //初始状态图片路径
    imagPathList.push({ "file": "img/state/legend.png", "name": "legend" });
    imagPathList.push({ "file": "img/state/4guzhang.png", "name": "guzhang" });
    imagPathList.push({ "file": "img/state/3yuliu.png", "name": "yuliu" });
    imagPathList.push({ "file": "img/state/chuzu.png", "name": "chuzu" });
}
var onloadCallback;
window.onload = function() {
    window.addEventListener('keydown', dokeyDown, true);
    window.addEventListener('keyup', dokeyUp, true);
    if (typeof onloadCallback == 'function')
        onloadCallback();
}


dokeyDown = function(e) {
    // alert('keydown');
    keyCodeID = e.keyCode ? e.keyCode : e.which;
    //ctrl=17
};
dokeyUp = function(e) {
    keyCodeID = null;
};


var _zoom = 0; //缩放系数
function doZoom(zoomSize) {
    if (_zoom + zoomSize > -300) {
        _zoom = _zoom + zoomSize;
        initDanJieMian();
    }
}
/*-----地井-单截面-----*/
var _zoom = 0; //缩放系数
function initDanJieMian() {
    myCanvas = WebGraph.Controls.WebTopology.createNew('danjiemian_canvas');
    //alert("地井截面");
    myCanvas.backColorTheme = null;
    myCanvas.backColor = "white"; //DimGray
    myCanvas.name = "地井截面";
    myCanvas.setCanvasBorder(0);
    var height = 400;
    var width = 400;
    if (danJieMianData.holes.length > 50) {
        height = 800;
        width = 800;
        myCanvas.init(0, 0, 850 + _zoom, 1000 + _zoom);
    } else
        myCanvas.init(0, 0, 650 + _zoom, 800 + _zoom);

    myCanvas.data = danJieMianData;
    myCanvas.allowRectSelect = true;

    // if (width + _zoom > 300)
    width = width + _zoom;
    // else myCanvas.init(0, 0, 500, 500);

    //if (height + _zoom > 300)
    height = height + _zoom;
    //else myCanvas.init(0, 0, 500, 500);

    createDanJieMian(myCanvas, danJieMianData, '管段截面', 10, 10, width, height, true, false);

    // //初始图例  状态 0	空闲 1	预占2	占用3	预留4	故障
    // var legendData=[{"id":"1","items":[{"id":"gy","symbol":"Gold","text":"空闲"},{"id":"yj","symbol":"Turquoise","text":"预占"},{"id":"dy","symbol":"DeepPink","text":"占用"},{"id":"zl","symbol":"BlueViolet","text":"预留"},{"id":"ups","symbol":"Blue","text":"故障"}],"layoutType":"default","legendType":"color"}];
    // myCanvas.legend=initLegend(legendData,myCanvas,50,80,650,500);		
    // myCanvas.legend.visible=false;
    // 水泥管孔
    // 2*3水泥管块
    // 2*2水泥管块
    // 塑料子管
    // 三色子管
    // 四色子管
    // 九孔格栅管
    // 梅花管(七孔)
    // 格删管子管
    // 梅花管子管
    // 2*3水泥管孔
    // 2*1水泥管块
    // 水泥管块组3
    // 四孔格栅管
    // 单孔格栅管
    //模拟批量数据同步加载
    //初始图例  
    var legendShape = WebGraph.Shape.Rect.createNew();
    legendShape.id = "图例";
    legendShape.editSize = false;
    legendShape.visible = false;
    legendShape.allowDrog = true;
    legendShape.init(550, 20, 80, 400, 1, "black", "white");
    legendShape.TopText = "图例";
    legendShape.image = imageList[0];
    legendShape.imageSrc = "egend.png";
    myCanvas.addShape(legendShape);
    // myCanvas.drawAfter = function(ctx) {
    //     for (var i = 0; i < selectedShapes.length; i++) {
    //         selectedShapes[i].selected = true;
    //         selectedShapes[i].draw(ctx);
    //     }
    // };
    myCanvas.draw();
    //创建右键菜单
    var guankongMenu ;
    var zikongMenu ;
    var lanMenu;
    var guanduanMenu ;
    if (isEdit == 1) 
    {
         guankongMenu = initGuanKongMenu(myCanvas);
         zikongMenu = initZiKongMenu(myCanvas);
         lanMenu = initLanMenu(myCanvas);
         guanduanMenu = initGuanDuanMenu(myCanvas); 
    }
    //缆移动时使用
    curCableShape = WebGraph.Shape.Rect.createNew();
    curCableShape.editSize = false;
    curCableShape.allowDrog = true;
    curCableShape.selectedStroke = "white";
    curCableShape.hoverStroke = "white";
    //curCableShape.xyIsOrigin = true; //x,y为圆心的圆 
    curCableShape.visible = false;
    curCableShape.init(20, 20, 6, 6, 2, 'white', null);

    curCableShape.mouseUpCallback = function(e, curShape) {
        if (e.button == 2) return;
        if (cableMoveStart == false) return;
        if (curCableShape.visible == false) return;
        // alert(curCableShape.data.name);
        curCableShape.visible = false;
        var mubiaoGuankongShape = myCanvas.getPointShape(curCableShape.x + 2, curCableShape.y + 2);
        myCanvas.setSelectedShape(mubiaoGuankongShape);
        curCableShape.visible = true;
        if (mubiaoGuankongShape && curGuanKongHao == mubiaoGuankongShape.id) return;


        var xuniguankong = "";
        if (mubiaoGuankongShape && mubiaoGuankongShape.type == "虚拟管孔") xuniguankong = "虚拟管孔";
        if (!mubiaoGuankongShape) xuniguankong = "虚拟管孔";
        if (xuniguankong == "虚拟管孔") {
            if (confirm("确定把缆编号【" + curCableShape.data.name + "】移动到1【" + xuniguankong + "】")) {
                $.ajax({
                    type: "POST",
                    url: getBasePath() + "/landuanluyou/moveKong.action",
                    data: { weizhiId: "", lanId: curCableShape.data.id },
                    dataType: "json",
                    success: function(response) {
                        alert("移动成功！");
                        localhostReload();
                    }
                });
            }
        } else {
            if (mubiaoGuankongShape.type == "管孔") {
                if (confirm("确定把缆编号【" + curCableShape.data.name + "】移动到【" + mubiaoGuankongShape.type + mubiaoGuankongShape.tipText + "】")) {
                    $.ajax({
                        type: "POST",
                        url: getBasePath() + "/landuanluyou/moveKong.action",
                        data: { weizhiId: mubiaoGuankongShape.data.id, lanId: curCableShape.data.id },
                        dataType: "json",
                        success: function(response) {
                            alert("移动成功！");
                            localhostReload();
                        }
                    });
                }
            }
            if (mubiaoGuankongShape.type == "子管") {
                if (confirm("确定把缆编号【" + curCableShape.data.name + "】移动到【" + mubiaoGuankongShape.parent.type + mubiaoGuankongShape.parent.tipText + mubiaoGuankongShape.type + mubiaoGuankongShape.tipText + "】")) {
                    $.ajax({
                        type: "POST",
                        url: getBasePath() + "/landuanluyou/moveKong.action",
                        data: { weizhiId: mubiaoGuankongShape.data.id, lanId: curCableShape.data.id },
                        dataType: "json",
                        success: function(response) {
                            alert("移动成功！");
                            localhostReload();
                        }
                    });
                }
            }
        }
        cableMoveStart = false;
        curCableShape.visible = false;

    }
    myCanvas.addShape(curCableShape);

    myCanvas.mouseUpCallback = function(e, curShape) {
        if (e.button == 2) { return; }
        if (isEdit == 0) return;
        if (curCableShape) curCableShape.visible = false;
        if (curShape != null) {

            if (curShape.type == '电缆' || curShape.type == '光缆') {
                curCableShape.x = curShape.x - curShape.width / 2 - 2;
                curCableShape.y = curShape.y - curShape.height / 2 - 2;
                curCableShape.width = curShape.width + 4;
                curCableShape.height = curShape.height + 4;
                // curCableShape.fill = curShape.fill;
                curCableShape.type = curShape.type;
                curCableShape.data = curShape.data;
                curCableShape.visible = true;
                curCableShape.id = curShape.id;
                //curShape.visible = false;
                // myCanvas.draw();
                curCableShape.draw(curShape.context);
                if (curShape.parent)
                    curGuanKongHao = curShape.parent.id;
                else
                    curGuanKongHao = "";
                cableMoveStart = true;
            }
        }
    }

    myCanvas.mouseDownCallback = function(e, curShape) {
        if (isEdit == 0) return;
        guanduanMenu.hidenMenu();
        myCanvas.contextMenu = null;
        if (e.button == 2) {
            //|| curShape.type == "虚拟管孔"
            if (curShape == null) {
                zikongMenu.hidenMenu();
                lanMenu.hidenMenu();
                guankongMenu.hidenMenu();
                guanduanMenu.showMenu(e, myCanvas.canvas);
                // myCanvas.contextMenu = guanduanMenu;
                return;
            }
            if (curShape.type == '管孔') {
                zikongMenu.hidenMenu();
                lanMenu.hidenMenu();
                myCanvas.contextMenu = guankongMenu;
            }
            if (curShape.type == '子管') {
                guankongMenu.hidenMenu();
                lanMenu.hidenMenu();
                myCanvas.contextMenu = zikongMenu;
            }
            if (curShape.type == '电缆' || curShape.type == '光缆') {

                guankongMenu.hidenMenu();
                zikongMenu.hidenMenu();
                myCanvas.contextMenu = lanMenu;
                // curCableShape.x = curShape.x - 3;
                // curCableShape.y = curShape.y - 3;
            }
        } else {
            //如果按键等于ctrl  多选操作
            //keyCodeID = 17;
            if (curShape && keyCodeID == 17) {
                if (!myCanvas.selectedShape) return;
                // alert(keyCodeID.toString());
                var isEexists = myCanvas.inSelectedShapes(myCanvas.selectedShape);
                if (isEexists == false) {
                    selectedShapes.push(myCanvas.selectedShape);
                    myCanvas.selectedShapes = selectedShapes;
                    myCanvas.selectedShape.selected = true;
                    //每次都要设置选中
                    for (var i = 0; i < myCanvas.selectedShapes.length; i++) {
                        myCanvas.selectedShapes[i].selected = true;
                    }
                    myCanvas.draw();
                }
            } else {
                keyCodeID = null;
                myCanvas.clearSelectedShape();
                selectedShapes = [];
                myCanvas.draw();
            }
        }
    }
}

/*-----地井-单截面打印-----*/
function jieMianPrint() {
    //A4纸 210mm×297mm 
    // A4纸的尺寸是210mm×297mm， 
    // 当设定的分辨率是72像素/英寸时，A4纸的尺寸的图像的像素是595×842， 
    // 当设定的分辨率是150像素/英寸时，A4纸的尺寸的图像的像素是1240×1754， 
    // 当设定的分辨率是300像素/英寸时，A4纸的尺寸的图像的像素是2479×3508， 
    // 你选择不同的分辨率，图像像素大小也随之变化。 
    // 1英寸＝25.4毫米。
// A0的尺寸为1189mm×841mm
// A1的尺寸为841mm×594mm
// A2的尺寸为594mm×420mm
// A3的尺寸为420mm×297mm
// A4的尺寸为297mm×210mm

// A0的尺寸=4	*A4
// A1的尺寸=2.8*A4
// A2的尺寸=2	*A4
// A3的尺寸=1.4*A4
// A4的尺寸=1	*A4


    printCanvas = WebGraph.Controls.WebTopology.createNew('print_canvas');
    //alert("地井截面");
    printCanvas.backColorTheme = null;
    printCanvas.backColor = "white";
    printCanvas.name = "地井截面打印";
    printCanvas.setCanvasBorder(5);
    printCanvas.init(0, 0,  768*2,1366*2);
    var guanduanName = '';
    if (danJieMianData && danJieMianData.guanduan)
        guanduanName = danJieMianData.guanduan.ashebeiMiaoshu + "—" + danJieMianData.guanduan.bshebeiMiaoshu;
    getJieMianPreview(printCanvas, danJieMianData, guanduanName, 0, 0,  768*2,1366*2);
    var height = 500;
    var width = 500;
    if (danJieMianData.holes.length > 50) {
        height = 500;
        width = 900;
    }
 
    var borderSize = createDanJieMian(printCanvas, danJieMianData, '地井截面', 60, 60, width+ _zoom, height+ _zoom, true, true);
      printCanvas.canvas.width = borderSize.width+150;
      printCanvas.canvas.height = borderSize.height+200;
    printCanvas.draw();
}
/*-----地井-单截面导出-----*/
function jieMianExport() {
    var imgCanvas = WebGraph.Controls.WebTopology.createNew();
    //alert("地井截面");
    imgCanvas.backColorTheme = null;
    imgCanvas.backColor = "rgba(255,255,255,0)"; //透明背景色   0到1  透明到不透明
    imgCanvas.name = "地井截面打印";
    imgCanvas.setCanvasBorder(0);
    var height = 400;
    var width = 400;
    if (danJieMianData.holes.length > 50) {
        height = 800;
        width = 800;
        imgCanvas.init(0, 0, 850 + _zoom, 1000 + _zoom);
    } else
        imgCanvas.init(0, 0, 650 + _zoom, 800 + _zoom);

    imgCanvas.data = danJieMianData;
    width = width + _zoom;
    height = height + _zoom;
    var guanduanName = '';
    if (danJieMianData && danJieMianData.guanduan)
        guanduanName = danJieMianData.guanduan.ashebeiMiaoshu + "—" + danJieMianData.guanduan.bshebeiMiaoshu;

    var borderWH = createDanJieMian(imgCanvas, danJieMianData, guanduanName, 5, 5, width, height, false, true);
    imgCanvas.canvas.width = borderWH.width + 30;
    imgCanvas.canvas.height = borderWH.height + 45;
    imgCanvas.draw();
    return imgCanvas;
}
/*-----获取截面图形-----*/
function getJieMianImage() {
    var jmcanvas = jieMianExport();
    return jmcanvas.canvas.toDataURL("image/png"); //.replace("image/png", "image/octet-stream"); 
}

function getJieMianImageInf() {
    var jmcanvas = jieMianExport();
    var obj = { 'img': '', 'width': 128, 'height': 128 };
    obj.img = jmcanvas.canvas.toDataURL("image/png");
    obj.width = jmcanvas.canvas.width;
    obj.height = jmcanvas.canvas.height;
    return obj;
}
/*-----地井-多单截面打印-----*/
function duoJieMianPrint() {
    printCanvas = WebGraph.Controls.WebTopology.createNew('print_canvas');
    //alert("地井截面");
    printCanvas.backColorTheme = null;
    printCanvas.backColor = "white";
    printCanvas.name = "地井截面打印";
    printCanvas.setCanvasBorder(0);
    printCanvas.init(0, 0, 1366, 1366);//0, 0, 1366, 768
    var guanduanName = '';
    if (duojiemianData)
        guanduanName = duojiemianData.name;
    getJieMianPreview(printCanvas, duojiemianData, guanduanName, 0, 0, 1300, 1300);
    var borderSize= createDuoJieMian(printCanvas, duojiemianData, guanduanName, 60, 60, 1000+ _zoom, 1000+ _zoom, true);
    printCanvas.canvas.width =borderSize.width+100;
    printCanvas.canvas.height = borderSize.height+100;
    printCanvas.draw();
}

function doDuoJieMianZoom(zoomSize) {
    if (_zoom + zoomSize > -300) {
        _zoom = _zoom + zoomSize;
        initDuoJieMian();
    }
}
/*
 *****地井-多截面初始*****
 */
function initDuoJieMian() {

    myCanvas = WebGraph.Controls.WebTopology.createNew('duojiemian_canvas');
    myCanvas.backColorTheme = null;
    myCanvas.backColor = "white";
    myCanvas.name = "地井多截面";
    myCanvas.setCanvasBorder(0);
    myCanvas.init(0, 0, 1280 + _zoom, 1280 + _zoom);
    createDuoJieMian(myCanvas, duojiemianData, '地井多截面', 10, 10, 1000 + _zoom, 1000 + _zoom, false);
    myCanvas.draw();
    //创建右键菜单
    // myCanvas.contextMenu = initMenu(myCanvas);
    // //初始图例  状态 0	空闲 1	预占2	占用3	预留4	故障
    // var legendData=[{"id":"1","items":[{"id":"gy","symbol":"Gold","text":"空闲"},{"id":"yj","symbol":"Turquoise","text":"预占"},{"id":"dy","symbol":"DeepPink","text":"占用"},{"id":"zl","symbol":"BlueViolet","text":"预留"},{"id":"ups","symbol":"Blue","text":"故障"}],"layoutType":"default","legendType":"color"}];
    // myCanvas.legend=initLegend(legendData,myCanvas,50,80,800,800);		

    //  myCanvas.mouseDownCallback = function(e, curShape) {}

}
var curCableShape; //当前选择光缆对象选择器

/*
 *****创建地井单截面*****
 */
function createDanJieMian(canvas, data, title, x, y, width, height, isSingle, isPrint) {
    var rectShape;
    var borderShape;
    var lineShape;
    //将字符串Json数据转换对象
    var objData = data;
    var duanLeiXing = objData.duanLeixingId; //207 管道  212 通道
    var topOffset = y + 20;
    var leftOffset = x + 10;
    var shapeWidth = 60;
    var shapeHeight = 50;
    var left = leftOffset;
    var colorIndex = 0;
    var n = 0;
    var count = 1;
    var backColor = "black";
    var fontColor = "white"; //前景字体颜色
    var holeShape; //管孔
    var holeBorderColor = "white"; //管孔边框色
    var holeBackColor = "black"; //管孔
    var holeSpaceX = 10; //管孔间隙
    var holeSpaceY = 18; //管孔间隙
    var childHole; //子孔
    var cableShape; //电光缆
    var childHoleCoors; //子孔坐标集合
    var childHoleColor; //子管边框颜色
    var childholeBackColor = "black"; //子管背景颜色
    var holeX; //管孔中心坐标x
    var holeY; //管孔中心坐标y
    var holeRadius = 90; //管孔直径
    var cableColor = "yellow"; //缆颜色 默认光缆颜色黄色
    var virtualPoleHeight = 0;
    var max_width;//管孔水平放置最大宽度
    if (objData.rows == null || objData.rows == "") objData.rows = 1;
    if (objData.cols == null || objData.cols == "") objData.cols = 1;
    if (duanLeiXing == '212') {
        objData.rows = 1;
        objData.cols = 1;
    }
    var rows = objData.rows;
    var cols = objData.cols;

    var isHasVirtualPole = false;
    if (objData.xnholes && objData.xnholes.cables) isHasVirtualPole = true;
    // width=(cols+1)*(holeRadius+10);
    // height=(rows+1)*(holeRadius+10);
    // var drawImg = new Image();
    // drawImg.src = "img/toolbar/chuzu.png";
    var guanduanName = title;
    if (objData.guanduan) {
        if (AB_MIAN == 'A') //显示A面
            guanduanName = objData.guanduan.ashebeiMiaoshu + "—" + objData.guanduan.bshebeiMiaoshu;
        else
            guanduanName = objData.guanduan.bshebeiMiaoshu + "—" + objData.guanduan.ashebeiMiaoshu;
    }
    //如果不显示管孔编号，间隙变小
    if (isShowHoleNO == false) {
        holeSpaceX = 8;
        holeSpaceY = 8; //管孔间隙
    };

    if (cols >= rows)
        holeRadius = (width - (cols + 1) * holeSpaceX - virtualPoleHeight) / cols;
    else
        holeRadius = (width - (rows + 1) * holeSpaceY - virtualPoleHeight) / rows;

    //如果管孔太小，间隙调整
    if (holeRadius < holeSpaceY) {
        holeSpaceX = holeRadius;
        holeSpaceY = holeRadius; //管孔间隙
        if (cols >= rows)
            holeRadius = (width - (cols + 1) * holeSpaceX - virtualPoleHeight) / cols;
        else
            holeRadius = (width - (rows + 1) * holeSpaceY - virtualPoleHeight) / rows;
    };

    //内边框
   
    var h = rows  * (holeRadius + holeSpaceY) + 15 + virtualPoleHeight;
    
    if (h > height) //如果高大于指定的外边框
    {
        holeRadius = holeRadius - (h - height) / rows;
        h = height;
    }
    var w = cols  * (holeRadius + holeSpaceX);
    var borderSize = { "width": w, "height": h };
    
    if (isPrint == true) {
        backColor = "white";
        fontColor = "black";
        holeBorderColor = "black";
        childholeBackColor = "white";
        childholeColor = "black";
    }
    if (!isSingle) {
        leftOffset =x+ (width- w+45 ) / 2 ;
        left = leftOffset;
       
    }
    max_width=w;
    //绘制外边框
    if (isSingle) {
        borderShape = WebGraph.Shape.Rect.createNew();
        borderShape.init(x, y, w + 20, h + 40,2, "DimGray", backColor);
        canvas.addBackShape(borderShape);

        rectShape = WebGraph.Shape.Rect.createNew();
        rectShape.init(x - 5, y + h + 40, w + 30, 4, 1, "DimGray", "blue"); //canvas.context.crewatePattern(drawImg,"repeat")
        canvas.addBackShape(rectShape);

        //绘制内边框（截面下边条）		
        var InnerBorderShape = WebGraph.Shape.Rect.createNew();
        InnerBorderShape.init(leftOffset, topOffset, w + 0, h, 2, "DimGray", backColor);
        InnerBorderShape.allowActive = false;
        InnerBorderShape.rx = 10;
        InnerBorderShape.type = '截面';
        InnerBorderShape.fontColor = fontColor;
        // InnerBorderShape.BottomText = guanduanName;
        InnerBorderShape.TopText = guanduanName;
        canvas.addShape(InnerBorderShape);
        borderSize = { "width": w, "height": h+10 };
    }
    if (!isSingle) {
        rectShape = WebGraph.Shape.Rect.createNew();
        rectShape.allowActive = false;
        // rectShape.init(x + 5, y + h + 5, w + 30, 20, 1, "DimGray", "blue"); //canvas.context.createPattern(drawImg,"repeat")
        rectShape.fontColor = 'red';
        rectShape.textWrapLine = false;
        if (isPrint == true) {
            rectShape.init(leftOffset -5, y + h + 15, w , 10, 1, "DimGray", "DarkGray");
            rectShape.font = "bold 14px 宋体";
        } else {
            rectShape.init(leftOffset-5 , y + h + 15, w, 10, 1, "DimGray", "blue");
            rectShape.font = "bold 12px 宋体";
        }

        rectShape.Text = guanduanName;
        canvas.addShape(rectShape);
    }
    //开始绘制截面管孔信息
    var holeData = null;
    var childHoleData = null;
    var duanID = objData.id;

    var duan_leixing_id = ""; //objData.leixing;
    var lanShapeSize = 3; //绘制缆的大小
    if (holeRadius / 12 > lanShapeSize) lanShapeSize = holeRadius / 12;
    if (lanShapeSize > 8) lanShapeSize = 8;
    topOffset = y + h - (holeRadius + holeSpaceY);
     //清除初始异网光缆统计数据
    clearSumData();
    //如果管段类型是 通道objData.xnholes
    if (duanLeiXing == '212') {
        drawTongDao(canvas, leftOffset + 10, topOffset + 20, holeRadius, objData, isSingle, isPrint);
        return;
    }
    for (var r = 1; r <= rows; r++) {
        for (var c = 1; c <= cols; c++) {
            //根据行列号取管孔数据
            holeData = getHoleData(objData.holes, r, c);
            holeX = left + 4;
            holeY = topOffset + 12;
            if (holeData != null) {
                //管孔				
                //holeX=leftOffset+10*holeData.ax;
                // holeY=10*holeData.by;
                if (holeData != null && holeData.type == "格栅管")
                    holeShape = WebGraph.Shape.Rect.createNew();
                else
                    holeShape = WebGraph.Shape.Ellipse.createNew();
                holeShape.editSize = false;
                holeShape.allowDrog = false;
                holeShape.type = "管孔";
                holeBackColor = backColor;
                if (holeData != null) {
                    holeShape.tag = holeData.state;
                    holeShape.tipText = holeData.bianhao;
                    holeShape.temp = holeData.bianhao;
                    holeShape.id = holeData.id; //管孔ID
                    holeShape.guanduan_id = duanID; //保存管段ID 
                    holeShape.duan_leixing_id = duan_leixing_id;
                    holeShape.data = holeData;
                    if (isShowHoleNO)
                        holeShape.BottomText = holeData.bianhao;
                    //状态:空闲=0 	预占=1	占用=2	预留=3	故障=4
                    if (holeData.state == "故障") {
                        holeBackColor = "DarkGray";
                        holeShape.allowActive = false;
                        holeBackColor = "red";
                        // holeBackColor= canvas.context.createPattern(imageList[1],"repeat");
                    }
                    if (holeData.state == "预留") {
                        if (imageList.length > 0)
                            holeBackColor = canvas.context.createPattern(imageList[2], "repeat");
                        //holeShape.allowActive=false;
                    }
                    if (holeData.state == "预占") {
                        if (imageList.length > 0)
                            holeBackColor = canvas.context.createPattern(imageList[3], "repeat");
                    }
                    if (holeData.state == "出租") {
                        if (imageList.length > 0)
                            holeBackColor = canvas.context.createPattern(imageList[3], "repeat");
                    }

                    if (holeData.chanquandanweiId && holeData.chanquandanweiId != '无') {
                        holeBackColor = '#ff6a00'; //橙红 
                    }
                    holeShape.fontColor = fontColor;

                }
                if (isPrint) {
                    backColor = "white";
                    //holeBorderColor = "black";
                    childholeBackColor = "white";
                    childholeColor = "black";
                } else { //获取管材颜色
                    holeBorderColor = getGuanCaiColor(holeData.guancai_ID, holeData.guan_cai);
                }
                //holeBackColor= canvas.context.createPattern(imageList[2],"repeat");
                //初始管孔
                holeShape.init(holeX, holeY, holeRadius, holeRadius, 4, holeBorderColor, holeBackColor);
                canvas.addShape(holeShape);
                //如果已分配
                if (holeData.chanquandanweiId && holeData.chanquandanweiId != '无') {
                    holeShape.Text = '分配';
                    holeShape.tipText = '【' + holeData.bianhao + '】已分配【' + holeData.chanquandanweiMingcheng + '】';
                }

                //如果有子管
                if (holeData != null && holeData.childHoles != null && holeData.childHoles.length > 0) {
                    if (holeShape.groups == null) holeShape.groups = [];
                    var holeCoors;

                    if (holeData.type == "格栅管")
                        holeCoors = getGeShanXY(holeRadius, holeX, holeY, holeData.childHoles.length);
                    if (holeData.type == "梅花管") {
                        //管孔圆形布局坐标点
                        holeCoors = WebGraph.Layout.CircleLayout(holeX + holeRadius / 3, holeY + holeRadius / 3, holeRadius / 3, holeData.childHoles.length - 1);
                        holeCoors.push({ "X": holeX + holeRadius / 3, "Y": holeY + holeRadius / 3 }); //中间管孔 						
                    }
                    if (holeData.type == "管孔" || holeData.type == "水泥管")
                    //管孔圆形布局坐标点
                        holeCoors = holeCircleLayout(holeX + holeRadius / 3, holeY + holeRadius / 3, holeRadius / 5, holeData.childHoles.length, 30);


                    for (var i = 0; i < holeData.childHoles.length; i++) {

                        //3孔子管
                        if (holeData.type == "格栅管") {
                            childHole = WebGraph.Shape.Rect.createNew();
                            childHoleData = getChildHoleData(holeData.childHoles, holeCoors[i].BH);
                            if (childHoleData == null)
                                childHoleData = holeData.childHoles[i];
                        } else {
                            childHole = WebGraph.Shape.Ellipse.createNew();
                            childHoleData = holeData.childHoles[i];
                        }
                        childHole.editSize = false;
                        childHole.allowDrog = false;
                        childHole.type = "子管";
                        childHole.tipText = childHoleData.name;
                        childHole.temp = childHoleData.name;
                        childHole.id = childHoleData.id; //子管ID
                        childHole.data = childHoleData; //子管属性
                        //子管颜色设置
                        childHoleColor = "white";
                        childholeBackColor = "black";
                        if (childHoleData.name == 'B')
                            childHoleColor = "blue";
                        if (childHoleData.name == 'R')
                            childHoleColor = "red";
                        if (childHoleData.name == 'W')
                            childHoleColor = "white";
                        if (holeData.type == "梅花管")
                            childHoleColor = holeBorderColor;
                        if (childHoleData.state == "预留") {
                            if (imageList.length > 0)
                                childholeBackColor = canvas.context.createPattern(imageList[2], "repeat");
                        }
                        childHole.fontColor = fontColor;
                        childHole.BottomText = "";
                        childHole.Text = "";
                        if (isPrint) {
                            if (holeData.type == "格栅管")
                                childHole.init(holeCoors[i].X, holeCoors[i].Y, holeCoors[i].W, holeCoors[i].W, 1, holeBorderColor, "white");
                            else
                                childHole.init(holeCoors[i].X, holeCoors[i].Y, holeRadius / 3, holeRadius / 3, 2, holeBorderColor, "white");

                        } else {
                            if (holeData.type == "格栅管")
                                childHole.init(holeCoors[i].X, holeCoors[i].Y, holeCoors[i].W, holeCoors[i].W, 1, holeBorderColor, childholeBackColor);
                            else
                                childHole.init(holeCoors[i].X, holeCoors[i].Y, holeRadius / 3, holeRadius / 3, 2, childHoleColor, childholeBackColor);

                        }

                        if (holeData.type == "格栅管" && holeShape.Text == '分配') {
                            childHole.fill = holeShape.fill;
                            childHole.tipText = holeShape.tipText;
                        }
                        canvas.addShape(childHole);
                        childHole.parent = holeShape;
                        holeShape.groups.push(childHole);
                        //如果子管有缆
                        if (childHoleData.cables != null && childHoleData.cables.length > 0) {
                            var cableCoors = holeCircleLayout(holeCoors[i].X + holeRadius / 7, holeCoors[i].Y + holeRadius / 7, lanShapeSize, childHoleData.cables.length, 30);
                            //缆
                            if (childHole.groups == null) childHole.groups = [];
                            for (var j = 0; j < childHoleData.cables.length; j++) {
                                drawCable(canvas, cableCoors[j].X, cableCoors[j].Y, lanShapeSize, childHole, childHoleData.cables[j], duanID, isPrint);
                            }
                        }
                    }

                }
                //如果管孔里有缆
                if (holeData != null && holeData.cables != null && holeData.cables.length > 0) {
                    if (holeShape.groups == null) holeShape.groups = [];
                    //管控圆形布局坐标点
                    var holeCoors = holeCircleLayout(holeX + holeRadius / 2, holeY + holeRadius / 2, holeRadius / 2 - lanShapeSize - 1, holeData.cables.length, 15);
                    for (var i = 0; i < holeCoors.length; i++) {
                        drawCable(canvas, holeCoors[i].X, holeCoors[i].Y, lanShapeSize, holeShape, holeData.cables[i], duanID, isPrint);
                    }
                }
            } else //如果没有管孔
            {
                holeShape = WebGraph.Shape.Ellipse.createNew();
                holeShape.editSize = false;
                holeShape.allowDrog = false;
                //初始管孔
                if (isPrint)
                    holeShape.init(holeX, holeY, holeRadius, holeRadius, 3, 'rgb(240,240,240)', 'white');
                else
                    holeShape.init(holeX, holeY, holeRadius, holeRadius, 3, 'rgb(32,32,32)', 'rgb(32,32,32)');
                holeShape.allowActive = false;
                holeShape.type = "无";
                holeBackColor = backColor;
                canvas.addShape(holeShape);
            }

            left = left + holeRadius + holeSpaceX;
        }
        //水平方向最大宽度
       // max_width=left-leftOffset;
        left = leftOffset;
        topOffset = topOffset - (holeRadius + holeSpaceY);
    }
    //console.info(max_width);
    //绘制虚拟管孔
   //  if (isSingle) {
        virtualPoleHeight = 30;
        var virtualPoleData = objData.xnholes; //getVirtualPoleData(objData.xnholes);
        if (InnerBorderShape)
            topOffset =y + InnerBorderShape.height + virtualPoleHeight*2-5; 
        else
            topOffset = y+ borderSize.height+virtualPoleHeight+5;//x + InnerBorderShape.height + 60; //
        virtualShape = WebGraph.Shape.Rect.createNew();
        virtualShape.init(leftOffset, topOffset,max_width-5, virtualPoleHeight, 2, holeBorderColor, "rgba(132,132,132,0.5)"); //canvas.context.createPattern(drawImg,"repeat")
        virtualShape.allowActive = true;
        virtualShape.editSize = false;
        virtualShape.fontColor = fontColor;
       // virtualShape.Text = "虚拟管孔";
        virtualShape.type = "虚拟管孔";
        virtualShape.tipText = "虚拟管孔";
         virtualShape.rx = 5;
        canvas.addShape(virtualShape);
        virtualShape.groups = [];
        left = leftOffset + 5;
        var cable_r=5
        if (!isSingle) cable_r=4 ;
        if (virtualPoleData && virtualPoleData.cables) {
            for (var i = 0; i < virtualPoleData.cables.length; i++) {
                left = left + holeSpaceX * 1.5;
                if (left > leftOffset + w - 10) {
                    left = leftOffset + 20;
                    topOffset = topOffset + 15;
                }
                drawCable(canvas, left, topOffset + 10, cable_r, virtualShape, virtualPoleData.cables[i], duanID, isPrint);
            }
        }
        borderSize.height=borderSize.height+virtualPoleHeight;
    //}
    
    if (isSingle) {
         drawLegend("光缆",canvas,  chanQuanConfig, "光缆合计:"+guanglanSum+"条", x, borderSize.height+y+100, borderSize.width,50);
         drawLegend("电缆",canvas,  chanQuanConfig, "电缆合计:"+dianlanSum+"条", x, borderSize.height+y+150, borderSize.width,50);
     }
        borderSize.height=borderSize.height+100;
    return borderSize;
}
//绘制管段类型是通道的截面
function drawTongDao(canvas, x, y, width, objData, isSingle, isPrint) {
    var tongDaocables = [];
    var holeData;
    var childHoleData;
    //获取管孔里的缆
    for (var r = 0; r <= objData.holes.length; r++) {
        holeData = objData.holes[r];
        //如果管孔里有缆
        if (holeData != null && holeData.cables != null && holeData.cables.length > 0) {
            for (var i = 0; i < holeData.cables.length; i++) {
                tongDaocables.push(holeData.cables[i]);
            }
        }
        //如果有子管
        if (holeData != null && holeData.childHoles != null && holeData.childHoles.length > 0) {
            for (var i = 0; i < holeData.childHoles.length; i++) {
                childHoleData = holeData.childHoles[i];
                //如果子管有缆
                if (childHoleData.cables != null && childHoleData.cables.length > 0) {
                    for (var rr = 0; rr < childHoleData.cables.length; rr++)
                        tongDaocables.push(childHoleData.cables[rr]);
                }
            }
        }
    }
    //获取虚拟管孔里的缆
    holeData = objData.xnholes;
    //如果虚拟管孔里有缆
    if (holeData != null && holeData.cables != null && holeData.cables.length > 0) {
        for (var rr = 0; rr < holeData.cables.length; rr++) {
            tongDaocables.push(holeData.cables[rr]);
        }
    }

    var fontColor = "white"; //前景字体颜色
    var tongDaoShape = WebGraph.Shape.Rect.createNew();
    if (isPrint) {
        tongDaoShape.init(x, y, width, width, 3, 'black', "white");
        fontColor = 'black';
    } else
        tongDaoShape.init(x, y, width, width, 3, 'white', "rgba(32,32,32,0.5)"); //canvas.context.createPattern(drawImg,"repeat")
    tongDaoShape.allowActive = false;
    tongDaoShape.editSize = false;
    tongDaoShape.fontColor = fontColor;
    tongDaoShape.Text = "通道";
    tongDaoShape.type = "通道";
    tongDaoShape.tipText = "通道";
    tongDaoShape.rx = width / 3;
    canvas.addShape(tongDaoShape);
    tongDaoShape.groups = [];
    tongDaoShape.data = tongDaocables; // data;
    if (tongDaocables) {

        var n = tongDaocables.length;
        var nn = parseInt(n / 2) + 1;
        var nnn = n - nn;
        //管控圆形布局坐标点
        //外环
        var holeCoors = holeCircleLayout(x + width / 2, y + width / 2, width / 2 - 10, nn, 15);

        for (var i = 0; i < holeCoors.length; i++) {
            if (i < n) {
                drawCable(canvas, holeCoors[i].X, holeCoors[i].Y, 5, tongDaoShape, tongDaocables[i], isPrint);
            }
        }
        if (nnn > 0) {
            //内环
            holeCoors = null;
            holeCoors = holeCircleLayout(x + width / 2, y + width / 2, width / 2 - 30, nnn, 15);
            for (var i = 0; i < holeCoors.length; i++) {
                if (nn + i < n)
                    drawCable(canvas, holeCoors[i].X, holeCoors[i].Y, 5, tongDaoShape, tongDaocables[nn + i], isPrint);
            }
        }
    }
}
//绘制截面管孔中的缆
function drawCable(canvas, x, y, lanShapeSize, parentShape, data, duanID, isPrint) {
    var cableColor = "blue";
    var fontColor = "white"; //前景字体颜色
    if (isPrint)
        fontColor = 'black';
    var cableShape = WebGraph.Shape.Ellipse.createNew();
    cableShape.editSize = false;
    cableShape.xyIsOrigin = true; //x,y为圆心的圆
    cableShape.allowDrog = true;
    cableShape.id = data.id;
    cableShape.landuan_id = ""; //缆段ID
    cableShape.guanduan_id = duanID; //保存管段ID
    cableShape.weizhi_id = ""; //保存位置ID
    //属性信息
    cableShape.data = data;
    cableShape.tipText = data.name + "（管孔未知）";
    cableShape.tipContext = [];
    if (cableShape.data.name) cableShape.tipContext.push('缆编号:' + cableShape.data.name);
    if (cableShape.data.lanDuanBianhao) cableShape.tipContext.push('缆段号:' + cableShape.data.lanDuanBianhao);
    if (cableShape.data.luYou) cableShape.tipContext.push('路由:' + cableShape.data.luYou);
    if (cableShape.data.changdu) cableShape.tipContext.push('长度:' + cableShape.data.changdu);
    if (cableShape.data.xinshu) cableShape.tipContext.push('芯数:' + cableShape.data.xinshu);
    if (cableShape.data.chanquan) cableShape.tipContext.push('产权:' + cableShape.data.chanquan);
    cableShape.selectedStroke = "white";
    cableShape.hoverStroke = "white";
    cableShape.BottomText = "";
    cableShape.temp = data.name
    cableShape.fontColor = fontColor;
    //cableShape.BottomText ="未知";
    cableShape.lan_leixing = data.type;
    cableShape.type = data.type;
   // if (data.type == "光缆")
   //     cableColor = "RGB(51,51,255)";
   // else
   //     cableColor = "yellow";
   cableColor=getCableColor(-1, data.chanquan,data.type);
     //   getCableColor();
    cableShape.init(x, y, lanShapeSize, lanShapeSize, 1, "green", cableColor);

    canvas.addShape(cableShape);
    cableShape.parent = parentShape;
    parentShape.groups.push(cableShape);
      if (data.type == "电缆")  dianlanSum ++;
      if (data.type == "光缆") guanglanSum ++;
    //统计光缆数
    if (data.chanquan){
        switch (data.chanquan) {  
        case '移动':
         if (data.type == "光缆") chanQuanConfig[2].sum=chanQuanConfig[2].sum+1;
         if (data.type == "电缆") chanQuanConfig[2].dsum=chanQuanConfig[2].dsum+1;
        break;
        case '歌华':
          if (data.type == "光缆") chanQuanConfig[1].sum=chanQuanConfig[1].sum+1;
          if (data.type == "电缆") chanQuanConfig[1].dsum=chanQuanConfig[1].dsum+1;
        break;
        case '电信': 
          if (data.type == "光缆") chanQuanConfig[3].sum=chanQuanConfig[3].sum+1;
          if (data.type == "电缆") chanQuanConfig[3].dsum=chanQuanConfig[3].dsum+1;
        break;
        case '无主':  
          if (data.type == "光缆") chanQuanConfig[4].sum=chanQuanConfig[4].sum+1;    
          if (data.type == "电缆") chanQuanConfig[4].dsum=chanQuanConfig[4].dsum+1;
        case '其他':  
          if (data.type == "光缆")  chanQuanConfig[5].sum=chanQuanConfig[5].sum+1;   
          if (data.type == "电缆")  chanQuanConfig[5].dsum=chanQuanConfig[5].dsum+1; 
        break;	  
        default://联通
             if (data.type == "光缆")  chanQuanConfig[0].sum=chanQuanConfig[0].sum+1; 
             if (data.type == "电缆")  chanQuanConfig[0].dsum=chanQuanConfig[0].dsum+1; 
        }
    }
    else//联通
    {
             if (data.type == "光缆")  chanQuanConfig[0].sum=chanQuanConfig[0].sum+1; 
             if (data.type == "电缆")  chanQuanConfig[0].dsum=chanQuanConfig[0].dsum+1; 
     }

    return cableShape;
}

var guanCaiConfig = [{ 'id': '102', 'guancai': '陶瓷管', 'yanse': '192,192,192', 'xianse': '128,128,128' },
    { 'id': '104', 'guancai': '格栅管', 'yanse': '255,0,0', 'xianse': '217,217,217' },
    { 'id': '105', 'guancai': '水泥管', 'yanse': '255,255,255', 'xianse': '255,255,255' },
    { 'id': '106', 'guancai': '波纹塑料管 ', 'yanse': '243,165,252', 'xianse': '243,165,252' },
    { 'id': '107', 'guancai': '石棉管', 'yanse': '243,165,252', 'xianse': '243,165,252' },
    { 'id': '108', 'guancai': '钢管', 'yanse': '11,24,225', 'xianse': '11,24,225' },
    { 'id': '109', 'guancai': '塑料管', 'yanse': '209,84,190', 'xianse': '209,84,190' },
    { 'id': '110', 'guancai': '梅花管', 'yanse': '188,188,188', 'xianse': '188,188,188' }
];

// 光缆【产权单位】图例：
// 歌华（紫色）rgb(200,0,200)
// 移动（绿色）rgb(0,255,0)
// 电信 （红色）rgb(255,0,0)
// 无主 （棕色）rgb(210,105,30)
// 其他（灰色）rgb(128,128,128)  ,    { 'id': '5', 'name': '其他', 'val': 'rgb(128,128,128)', } 'sum': 0
//缆个数求和
var dianlanSum =0;
var guanglanSum =0;
var chanQuanConfig = [
    { 'id': '0', 'name': '联通', 'val': 'rgb(0,0,255)', 'sum': 0, 'dsum': 0 },
    { 'id': '1', 'name': '歌华', 'val': 'rgb(200,0,200)', 'sum': 0, 'dsum': 0 },
    { 'id': '2', 'name': '移动', 'val': 'rgb(0,255,0)', 'sum': 0, 'dsum': 0 },
    { 'id': '3', 'name': '电信', 'val': 'rgb(255,0,0)', 'sum': 0, 'dsum': 0 },
    { 'id': '4', 'name': '无主', 'val': 'rgb(165,42,42)', 'sum': 0, 'dsum': 0 } ,
    { 'id': '4', 'name': '其他', 'val': 'rgb(128,128,128)', 'sum': 0, 'dsum': 0 } 
];
//清除初始异网光缆统计数据 
function clearSumData() {
        dianlanSum =0;
        guanglanSum =0;
    for (var i=0;i<chanQuanConfig.length;i++){
          chanQuanConfig[i].sum=0;
          chanQuanConfig[i].dsum=0;
      }
}
//获取缆颜色
function getCableColor(id, name,cableType) {
    for (var i = 0; i < chanQuanConfig.length; i++) {
        if (chanQuanConfig[i].id == id || chanQuanConfig[i].name == name)
            return   chanQuanConfig[i].val  ;
    }
    var cableColor = "RGB(51,51,255)";
    if (cableType != "光缆") 
        cableColor = "yellow";
    return cableColor;
}
//获取管材颜色
function getGuanCaiColor(id, name) {
    for (var i = 0; i < guanCaiConfig.length; i++) {
        if (guanCaiConfig[i].id == id || guanCaiConfig[i].guancai == name)
            return 'rgb(' + guanCaiConfig[i].yanse + ')';
    }
    return 'white';
}

//初始图例  
function initLegend(legendData, canvas, x, y, width, height) {
    var legend = WebGraph.Controls.Legend.createNew();
    legend.allowDrog = true;
    var h = legend.getHeight(legendData[0].items.length, 15, 12, 5);
    legend.init(canvas, legendData, x + width + 200, y + height - 50, 80, h);
    return legend;
}

//格栅管坐标生成
function getGeShanXY(width, xx, yy, count) {
    var nodeXY = [];
    var w = width;
    var x = xx;
    var y = yy
    if (count == 1)
        nodeXY.push({ "X": x, "Y": y, "W": width });
    if (count == 4) {
        w = width / 2 - 2;
        // nodeXY.push({ "X": x, "Y": y, "W": w });   //1
        // nodeXY.push({ "X": x + w + 4, "Y": y, "W": w });//2
        // nodeXY.push({ "X": x, "Y": y + w + 4, "W": w });//3
        // nodeXY.push({ "X": x + w + 4, "Y": y + w + 4, "W": w });//4
        //从左下角0101开始
        nodeXY.push({ "X": x, "Y": y + w + 4, "W": w, "BH": "0101" }); //3    0101
        nodeXY.push({ "X": x + w + 4, "Y": y + w + 4, "W": w, "BH": "0102" }); //4   0102
        nodeXY.push({ "X": x, "Y": y, "W": w, "BH": "0201" }); //1    0201
        nodeXY.push({ "X": x + w + 4, "Y": y, "W": w, "BH": "0202" }); //2    0202

    }
    if (count == 9) {
        w = width / 3 - 2;;
        // nodeXY.push({ "X": x, "Y": y, "W": w });//1
        // nodeXY.push({ "X": x + w + 4, "Y": y, "W": w });//2
        // nodeXY.push({ "X": x + w * 2 + 6, "Y": y, "W": w });//3

        // nodeXY.push({ "X": x, "Y": y + w + 4, "W": w });//4
        // nodeXY.push({ "X": x + w + 4, "Y": y + w + 4, "W": w });//5
        // nodeXY.push({ "X": x + w * 2 + 6, "Y": y + w + 4, "W": w });//6

        // nodeXY.push({ "X": x, "Y": y + w * 2 + 6, "W": w });//7
        // nodeXY.push({ "X": x + w + 4, "Y": y + w * 2 + 6, "W": w });//8
        // nodeXY.push({ "X": x + w * 2 + 6, "Y": y + w * 2 + 6, "W": w });//9
        //从左下角0101开始  
        nodeXY.push({ "X": x, "Y": y + w * 2 + 6, "W": w, "BH": "0101" }); //7   0101
        nodeXY.push({ "X": x + w + 4, "Y": y + w * 2 + 6, "W": w, "BH": "0102" }); //8   0102
        nodeXY.push({ "X": x + w * 2 + 6, "Y": y + w * 2 + 6, "W": w, "BH": "0103" }); //9 0103
        nodeXY.push({ "X": x, "Y": y + w + 4, "W": w, "BH": "0201" }); //4   0201
        nodeXY.push({ "X": x + w + 4, "Y": y + w + 4, "W": w, "BH": "0202" }); //5   0202
        nodeXY.push({ "X": x + w * 2 + 6, "Y": y + w + 4, "W": w, "BH": "0203" }); //6  0203
        nodeXY.push({ "X": x, "Y": y, "W": w, "BH": "0301" }); //1  0301
        nodeXY.push({ "X": x + w + 4, "Y": y, "W": w, "BH": "0302" }); //2  0302 
        nodeXY.push({ "X": x + w * 2 + 6, "Y": y, "W": w, "BH": "0303" }); //3   0303    


    }
    return nodeXY;

}

//拓扑圆形布局算法			  
holeCircleLayout = function(centerX, centerY, radius, count, start) {
    //var centerX = 400;//圆心坐标  
    //var centerY = 300;  
    //var radius = 200;//半径  
    //count: 节点数目  
    var nodes = new Array();
    var x = 0;
    var y = 0;
    for (var i = 0; i < count; i++) {
        x = centerX + radius * Math.cos(Math.PI / 180 * (start - 360 / count * i)); //cos(0)=1
        y = centerY + radius * Math.sin(Math.PI / 180 * (start - 360 / count * i)); //sin(0)=0  
        // 角度转弧度 π/180×角度
        // 弧度变角度 180/π×弧度 
        nodes.push({ X: x, Y: y });
    }
    return nodes;
};
//根据行列号取管孔数据  
function getHoleData(holes, row, col) {
    if (row < 10) row = "0" + row.toString();
    if (col < 10) col = "0" + col.toString();
    var id = row.toString() + "" + col.toString();;
    for (var i = 0; i < holes.length; i++) {
        if (AB_MIAN == 'A') {
            if (holes[i].bianhao == id)
                return holes[i];
        } else {
            if (holes[i].bbianhao == id)
                return holes[i];
        }

    }
    return null;
}


//根据子孔编号取子孔数据  
function getChildHoleData(childHoles, bianhao) {
    for (var i = 0; i < childHoles.length; i++) {
        if (childHoles[i].name == bianhao)
            return childHoles[i];
    }
    return null;
}
/*
 *****创建地井多截面*****
 */
function createDuoJieMian(canvas, data, title, x, y, width, height, isPrint) {
    //data = { "id": "1", "type": "地井", "name": "地井名称:XXXX##22",  "sum": 3, "sections":[			]			 }; 
    var top = y;
    var borderShape;
    var lineShape;
    //将字符串Json数据转换对象
    var objData = data;
    var topOffset = y + 2;
    var leftOffset = x + 2;
    var shapeWidth = 250;
    var shapeHeight = 50;
    var left = leftOffset;
    var colorIndex = 0;
    var n = 0;
    var count = 1;
    var jieMianShape;
    var fontColor = "white";
    var backColor = "black";
    if (isPrint) {
        fontColor = "black";
        backColor = "white";
    }
    var cellData = { "dir": '', 'count': 0, };
    //E—东；S—南；W—西；N—北；ES—东南；EN—东北；WS—西南；WN—西北。
    var dirList = ['N', 'S', 'W', 'E', 'ES', 'EN', 'WS', 'WN'];
    var gridData = [];
    for (var i = 0; i < 8; i++)
        gridData.push({ "dir": dirList[i], 'count': 0 });

    for (var m = 0; m < objData.sections.length; m++) {
        for (var i = 0; i < 8; i++) {
            if (gridData[i].dir == objData.sections[m].dir) { gridData[i].count = gridData[i].count + 1; break; }
        }
    }

    //判定有几圈
    var rc = 3; // data.sum; //3;//3  5  7  9
    var max = 1;
    for (var i = 0; i < 8; i++)
        if (gridData[i].count > 1) { if (max < gridData[i].count) max = gridData[i].count; }

    if (max > 0) rc = max * 2 + 1;
    //rc = 5;
    var centerRC = parseInt(rc / 2);

    if (rc == 3)
        shapeWidth = width / rc - 3;
    if (rc == 5)
        shapeWidth = width / rc - 5;
    if (rc == 7)
        shapeWidth = width / rc - 7;
    //9宫格
    var girdShapes = [];

    //坐标
    for (var r = 0; r < rc; r++) {
        for (var c = 0; c < rc; c++) {
            //9宫格
            jieMianShape = WebGraph.Shape.Rect.createNew();
            jieMianShape.editSize = false;
            jieMianShape.allowDrog = false;
            jieMianShape.id = r.toString() + c.toString();
            jieMianShape.init(left, topOffset, shapeWidth, shapeWidth, 1, fontColor, backColor);
            //设置单元格方向
            setCellDir(canvas, centerRC, r, c, jieMianShape);
            girdShapes.push(jieMianShape);
            if (c == centerRC && r == centerRC) //中心井
            {
                jieMianShape.groups = [];
                var centerShape = WebGraph.Shape.Ellipse.createNew();
                centerShape.editSize = false;
                centerShape.allowDrog = false;
                centerShape.init(left + shapeWidth / 4, topOffset + shapeWidth / 4, shapeWidth / 2, shapeWidth / 2, 2, fontColor, backColor);
                canvas.addShape(centerShape);
                centerShape.fontColor = fontColor;
                centerShape.Text = objData.name;
                centerShape.BottomText = "南";
                centerShape.TopText = "北";
                centerShape.LeftText = "西";
                centerShape.RightText = "东";
                centerShape.parent = jieMianShape;
                jieMianShape.groups.push(centerShape);
            }

            //不显示编号
            isShowHoleNO = true;
            left = left + shapeWidth + 2;
        }
        left = leftOffset;
        topOffset = topOffset + shapeWidth + 2;
    }
    var borderSize = { "width": x+shapeWidth*rc, "height": y+shapeWidth*rc };
    var cell;
    //对应方向位置，绘制截面
    for (var m = 0; m < objData.sections.length; m++) {
        cell = getCell(girdShapes, objData.sections[m].dir);
        if (cell) {
            cell.temp = objData.sections[m].tag; //防止画两次
            createDanJieMian(canvas, objData.sections[m], 'A地井-B地井', cell.x, cell.y, cell.width - 40, cell.height - 40-60, false, isPrint);
        }
    }
    return borderSize;
}

function getCell(girdShapes, dir) {
    if (girdShapes.length > 9) {
        //先从内圈开始，再从外圈查找
        var dirList25 = [6, 7, 8, 11, 12, 13, 16, 17, 18, 0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24];
        var idx = 0;
        for (var i = 0; i < dirList25.length; i++) {
            idx = dirList25[i];
            if (girdShapes[idx].temp == '' && girdShapes[idx].tag == dir)
                return girdShapes[idx];
        }
    } else {
        for (var i = 0; i < girdShapes.length; i++) {
            if (girdShapes[i].temp == '' && girdShapes[i].tag == dir) {
                return girdShapes[i];
            }
        }
    }
    return null;
}

function setCellDir(canvas, centerRC, r, c, jieMianShape) { //9宫格
    //E—东；S—南；W—西；N—北；ES—东南；EN—东北；WS—西南；WN—西北。
    if (r < centerRC && c == centerRC) {
        jieMianShape.Text = "北";
        jieMianShape.tag = "N";
    }
    if (r > centerRC && c == centerRC) {
        jieMianShape.Text = "南";
        jieMianShape.tag = "S";
    }
    if (c < centerRC && r == centerRC) {
        jieMianShape.Text = "西";
        jieMianShape.tag = "W";
    }
    if (c > centerRC && r == centerRC) {
        jieMianShape.Text = "东";
        jieMianShape.tag = "E";
    }
    if (r < centerRC && c < centerRC) {
        jieMianShape.Text = "西北";
        jieMianShape.tag = "WN";
    }
    if (r < centerRC && c > centerRC) {
        jieMianShape.Text = "东北";
        jieMianShape.tag = "EN";
    }
    if (r > centerRC && c < centerRC) {
        jieMianShape.Text = "西南";
        jieMianShape.tag = "WS";
    }
    if (r > centerRC && c > centerRC) {
        jieMianShape.Text = "东南";
        jieMianShape.tag = "ES";
    }
    jieMianShape.Text = "";
    jieMianShape.temp = "";
    canvas.addBackShape(jieMianShape);
}
//根据行、列获取管孔数据
function getPoleData(poles, row, col) {
    if (row < 10) row = "0" + row.toString();
    if (col < 10) col = "0" + col.toString();
    var id = row.toString() + "" + col.toString();;
    for (var i = 0; i < poles.length; i++) {
        if (poles[i].id == id)
            return poles[i];

    }
    return null;
}
//获取虚拟管孔数据
function getVirtualPoleData(poles) {
    for (var i = 0; i < poles.length; i++) {
        if (poles[i].type == "虚拟管孔")
            return poles[i];
    }
    return null;
}
//绘制图例
function drawLegend(cableType,canvas,  dataInf, title, x, y, width, height) {
 //标题1
 var rectShape = WebGraph.Shape.Rect.createNew();
 rectShape.fontColor = "#000000";
 rectShape.init(x, y, width, height, 1, "", "");
 rectShape.TopText =title;
 //rectShape.allowDrog=false;
 rectShape.editSize = false;
 rectShape.font = "12px 宋体";
  rectShape.drawChilds=function(ctx, rx, ry, width, height){
    var top = y;
    var rectShape;
    var borderShape;
    var lineShape; 
    ctx.font = "12px 宋体";
    var left = width - 50 - 260 - 3;
    var rowHeight = 15;
    var topOffset = height - 50 - rowHeight * 5 - 3;
    var titleWidth = 20;
    var textWidth = 200;
    //垂直
    // for (var i=0;i<dataInf.length;i++){
    //     ctx.fillStyle = dataInf[i].val;
    //    // ctx.stroke = dataInf[i].val;
    //     WebGraph.Drawing2D.Rect(ctx, rx+10, ry+rowHeight*i+10, titleWidth, rowHeight, true, false);
    //     ctx.fillText(dataInf[i].name, rx+titleWidth+20, ry+rowHeight*i+20);
    //     ry=ry+5;
    // }
        //水平
        for (var i=0;i<dataInf.length;i++){
        	if (cableType == "光缆") 
                ctx.fillStyle = dataInf[i].val;
            else
            	ctx.fillStyle = "yellow";
            WebGraph.Drawing2D.Rect(ctx, rx+1, ry, titleWidth, rowHeight, true, false);
            rx=rx+titleWidth+16;
            	ctx.fillStyle = "black";
            	if (cableType == "光缆") 
          		  ctx.fillText(dataInf[i].name+dataInf[i].sum+'条', rx-9 , ry+12);
            	else
            		ctx.fillText(dataInf[i].name+dataInf[i].dsum+'条', rx-9 , ry+12);
            rx=rx+titleWidth+25;
        }

 };
 canvas.addShape(rectShape);

}

//截面打印预览
function getJieMianPreview(canvas, dataInf, title, x, y, width, height) {
    return;
    var myDate = new Date(); //获取系统当前时间
    var curDatatime = myDate.toLocaleString(); //获取日期与时间
    var data = { "name": title, "author": "", "department": "", "company": "", "datetime": curDatatime.toString() };
    var top = y;
    //var templateData=''; 
    var rectShape;
    var borderShape;
    var lineShape;

    //外边框
    // borderShape = WebGraph.Shape.Rect.createNew();
    // borderShape.init( 50, y + 50, 200, height - 100, 0, "#FFFFFF", "#FFFFFF");
    // borderShape.TopText = data.name;
    // canvas.addBackShape(borderShape);

    var left = width - 50 - 260 - 3;
    var rowHeight = 20;
    var topOffset = height - 50 - rowHeight * 5 - 3;
    var titleWidth = 60;
    var textWidth = 200;
    //右下角标注

    //标题1
    rectShape = WebGraph.Shape.Rect.createNew();
    rectShape.fontColor = "#000000";
    rectShape.init(left, topOffset, titleWidth, rowHeight, 1, "black", "#FFFFFF");
    rectShape.Text = "名    称";
    canvas.addBackShape(rectShape);
    //内容
    rectShape = WebGraph.Shape.Rect.createNew();
    rectShape.init(left + titleWidth, topOffset, textWidth, rowHeight, 1, "#000000", "#FFFFFF");
    rectShape.Text = data.name;
    canvas.addBackShape(rectShape);
    topOffset = topOffset + rowHeight;
    //标题2
    rectShape = WebGraph.Shape.Rect.createNew();
    rectShape.init(left, topOffset, titleWidth, rowHeight, 1, "#000000", "white");
    rectShape.Text = "作    者";
    canvas.addBackShape(rectShape);
    //内容
    rectShape = WebGraph.Shape.Rect.createNew();
    rectShape.init(left + titleWidth, topOffset, textWidth, rowHeight, 1, "#000000", "white");
    rectShape.Text = data.author;
    canvas.addBackShape(rectShape);
    topOffset = topOffset + rowHeight;

    //标题3
    rectShape = WebGraph.Shape.Rect.createNew();
    rectShape.init(left, topOffset, titleWidth, rowHeight, 1, "#000000", "white");
    rectShape.Text = "部    门";
    canvas.addBackShape(rectShape);
    //内容
    rectShape = WebGraph.Shape.Rect.createNew();
    rectShape.init(left + titleWidth, topOffset, textWidth, rowHeight, 1, "black", "white");
    rectShape.Text = data.department;
    canvas.addBackShape(rectShape);
    topOffset = topOffset + rowHeight;

    //标题4
    rectShape = WebGraph.Shape.Rect.createNew();
    rectShape.init(left, topOffset, titleWidth, rowHeight, 1, "#000000", "white");
    rectShape.Text = "公    司";
    canvas.addBackShape(rectShape);
    //内容
    rectShape = WebGraph.Shape.Rect.createNew();
    rectShape.init(left + titleWidth, topOffset, textWidth, rowHeight, 1, "#000000", "white");
    rectShape.Text = data.company;
    canvas.addBackShape(rectShape);
    topOffset = topOffset + rowHeight;

    //标题5
    rectShape = WebGraph.Shape.Rect.createNew();
    rectShape.init(left, topOffset, titleWidth, rowHeight, 1, "#000000", "white");
    rectShape.Text = "打印时间";
    canvas.addBackShape(rectShape);
    //内容
    rectShape = WebGraph.Shape.Rect.createNew();
    rectShape.init(left + titleWidth, topOffset, textWidth, rowHeight, 1, "#000000", "white");
    rectShape.Text = data.datetime;
    canvas.addBackShape(rectShape);

    //return  canvas.toDataURL("image/png");		
}


function danJieMianPreview() {
    //临时绘制
    jieMianPrint();
    initPreview();
}

function duoJieMianPreview() {
    duoJieMianPrint();
    initPreview();
}

function initPreview() {

    var image = printCanvas.getImage();
    var ww=printCanvas.width+150;
    // var hh=printCanvas.height+50;
    // var heigth_screen = window.screen.height-200;    //获取整个屏幕的分辨率
    // var width_screen = window.screen.width;

    var strhtml = [];
    strhtml.push(' <script  type="text/javascript" src="../../content/web-graph/jquery.min.js"></script>');
    strhtml.push(' <script  type="text/javascript" src="../../content/web-graph/jQuery.print.min.js"></script> ');
    strhtml.push(' <script  type="text/javascript" src="../../content/web-graph/jquery.print-preview.js"></script>');
    strhtml.push(' <script> function doPrint(){ $("#imgPrint").print();} </script>');//  function doZoom(v){    var image = document.getElementById("imgPrint");    var w=image.width+v;    var h=image.height+v;     image.style.width=w+"px"; image.style.height=h+"px";    }</script>');
    strhtml.push('<body style="overflow:auto" >');//style=" width:100%; height:100%;"hidden
    strhtml.push(' <div><input type="image" title="打印" src="img/toolbar/print.png"  onClick="doPrint()">打印 【右键图片另存本地】</input> ');
    // strhtml.push(' <input type="image" title="打印" src="img/toolbar/print.png"  onClick="doZoom(100)">放大</input></div>');
    // strhtml.push(' <input type="image" title="打印" src="img/toolbar/print.png"  onClick="doZoom(-100)">缩小</input></div>');
   //  strhtml.push('<div style="overflow:auto; width:calc(100%-50px); height:'+heigth_screen+'px;border:1px solid #000;padding:30px;">');
   strhtml.push('<div style="overflow:hidden; width:'+ww+'px;border:1px solid #000;padding:30px;">');
   //strhtml.push('<div style=" overflow:none;  width:100%;border:1px solid #000;">');
    strhtml.push("<img id='imgPrint'   src='" + image + "'  alt='打印预览'/>");
    //strhtml.push('</div>');
     strhtml.push('</div>');
    // strhtml.push(' <script>  var image = document.getElementById("imgPrint");      image.style.width="'+ww+'px"; image.style.height="'+hh+'px";   </script>');
    strhtml.push('</body>');
    var win = window.open('about:blank'); //打开预览页面
    win.document.write(strhtml.join('\n'));

   
}
// //初始图例  
// function initLegend(legendData,canvas,x,y,width,height)
// { 
// var	drawImg = new Image();
// drawImg.src="img/legend.png";
// var legend=WebGraph.Controls.Legend.createNew();
// legend.allowDrog=true;
// legend.visible=false;
// var h=legend.getHeight(legendData[0].items.length,15,12,5) ;
// legend.init(canvas,legendData,x+width-170,y+50,150,h);
// return legend;
// }

//计算出最小孔的坐标，并算出左下角的坐标返回
// function   GetMinHoleXY( holesData)
// {
// var drow = null;
// foreach(var row in holesData)
// {
// if(drow == null)
// {
// drow = row;
// }
// else
// { 
// if(float.Parse(drow["A_X"].ToString())>float.Parse(row["A_X"].toString())||float.Parse(drow["A_Y"].ToString())>float.Parse(row["A_Y"].ToString())&&row["GUANKONG_LEIXING"].ToString().Equals("0"))
// {
// drow = row;
// }					 
// }

// }
// //转换成坐标
// var x = float.Parse(drow["A_JING_KONGWEI_X"].toString());
// var y = float.Parse(drow["A_JING_KONGWEI_Y"].toString());
// PointF f = new PointF(x,y);	

// return f;

// }


/*var danJieMianData ={ "id": "1", "type": "管段", "name": "管段编号XXXX地井截面-#001", "dir": "N", "rows": 4 ,"cols":6,
			     "holes":[
				 { "id": "0101", "type": "管孔","state": "占用",
							"childHoles": [ { "id": "zikong_1", "name": "B","type": "子管","cables": [{ "id": "lan_1", "type": "光缆", "name": "xx光缆"},{ "id": "lan_2", "type": "光缆", "name": "端口2"}]},
											{ "id": "zikong_2", "name": "R","type": "子管","cables": [{ "id": "lan_1", "type": "光缆", "name": "xx光缆"},{ "id": "lan_2", "type": "光缆", "name": "端口2"}]},
											{ "id": "zikong_3", "name": "W","type": "子管","cables": []}
										  ],
							"cables": [{ "id": "lan_1","type": "光缆", "name": "xx光缆"},{ "id": "lan_2", "type": "光缆","name": "端口2"}]
			     },
			   { "id": "0102", "type": "格栅管","state": "占用",
			   "childHoles":[ { "id": "zikong_1", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_2", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_3", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_4", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_5", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_6", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_7", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_8", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_9", "name": "子管-1","type": "子管","cables": []} 
							] ,
				"cables":[]},
			   { "id": "0103", "type": "梅花管","state": "空闲",
			   "childHoles": [{ "id": "zikong_1", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_2", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_3", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_4", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_5", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_6", "name": "子管-1","type": "子管","cables": []} , 
							  { "id": "zikong_7", "name": "子管-1","type": "子管","cables": []} 		   
			   ], "cables":[]},
			   { "id": "0104", "type": "梅花管","state": "占用",
			   "childHoles": [{ "id": "zikong_1", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_2", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_3", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_4", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_5", "name": "子管-1","type": "子管","cables": []} 
							 ], "cables":[]},
			   { "id": "0105", "type": "管孔","state": "占用",
			   "childHoles": [], "cables":[{ "id": "zikong_1", "name": "缆1","type": "电缆" }]},
			   { "id": "0201", "type": "管孔","state": "占用",
			   "childHoles": [{ "id": "B", "name": "B","type": "子管","cables": []},
											 { "id": "R", "name": "R","type": "子管","cables": []},
											 { "id": "W", "name": "W","type": "子管","cables": []}], "cables":[]},
			   { "id": "0202", "type": "格栅管","state": "空闲",
			   "childHoles": [{ "id": "zikong_1", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_2", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_3", "name": "子管-1","type": "子管","cables": []}, 
							  { "id": "zikong_4", "name": "子管-1","type": "子管","cables": []}
							  ], "cables":[]},
			   { "id": "0203", "type": "管孔","state": "预占","childHoles": [], "cables":[]},
			   { "id": "0204", "type": "管孔","state": "预占","childHoles": [], "cables":[]},
			   { "id": "0205", "type": "管孔","state": "故障","childHoles": [], "cables":[]},
			   { "id": "0301", "type": "管孔","state": "预留","childHoles": [], "cables":[]},
			   { "id": "0302", "type": "管孔","state": "预留","childHoles": [], "cables":[]},
			   { "id": "0303", "type": "管孔","state": "出租","childHoles": [], "cables":[]},
			   { "id": "0304", "type": "管孔","state": "占用","childHoles": [{ "id": "zikong_1", "name": "子管-1","type": "子管","cables": []},
											 { "id": "zikong_2", "name": "B","type": "子管","cables": []},
											 { "id": "zikong_3", "name": "R","type": "子管","cables": []},
											 { "id": "zikong_3", "name": "W","type": "子管","cables": []}], "cables":[]},
			   { "id": "0305", "type": "管孔","state": "占用","childHoles": [
											 { "id": "zikong_1", "name": "B","type": "子管","cables": [{ "id": "lan_1", "type": "光缆", "name": "xx光缆"} ]},
											 { "id": "zikong_2", "name": "R","type": "子管","cables": [{ "id": "lan_1", "type": "光缆", "name": "xx光缆"} ]},
											 { "id": "zikong_3", "name": "W","type": "子管","cables": []}
											],
											"cables": []},
			  { "id": "-1", "type": "虚拟管孔","state": "占用",
			   "childHoles": [], "cables":[{ "id": "zikong_1", "name": "缆1","type": "电缆" }]},
	]
 }; 
 
 */


function convertCanvasToImage(w, h, guanduan_id) {
    //  let canvas = document.createElement('canvas') ;

    //  canvas.width = w ;
    //  canvas.height = h ;
    //  let context = canvas.getContext('2d') // 获取对应的2D对象(画笔) 

    //   return canvas.toDataURL('image/png')
}