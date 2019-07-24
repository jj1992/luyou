/*
namespace.js
layer.js
canvas-base.js
element.js
connector.js
shape.js
math.js
drawing.js
render.js
event.js
layout.js
legend.js
lineSelector.js
selector.js
symbol.js
controls.js
*/
//用来注册命名空间 直接定义
//var WebGraph = {};
//WebGraph.Drawing = {}; 
//WebGraph.BizApp = {}; 
//var WebGraph = window.NameSpace || {};
// 声明一个全局对象Namespace，用来注册命名空间
var Namespace = new Object();
// 全局对象仅仅存在register函数，参数为名称空间全路径，WebGraph.Drawing"
Namespace.register = function(fullNS) {
    // 将命名空间切成N部分, 比如Grandsoft、GEA等
    var nsArray = fullNS.split('.');
    var sEval = "";
    var sNS = "";
    for (var i = 0; i < nsArray.length; i++) {
        if (i != 0) sNS += ".";
        sNS += nsArray[i];
        // 依次创建构造命名空间对象（假如不存在的话）的语句
        // 比如先创建Grandsoft，然后创建Grandsoft.GEA，依次下去
        sEval += "if (typeof(" + sNS + ") =='undefined') " + sNS + " = new Object();";
    }
    if (sEval != "") eval(sEval);
}

//精简写法
function namespace(ns) {
    if (typeof(ns) != "string") return;
    ns = ns.split(".");
    var o, ni;
    for (var i = 0, len = ns.length; i < len, ni = ns[i]; i++) {
        try { o = (o ? (o[ni] = o[ni] || {}) : (eval(ni + "=" + ni + "||{}"))) } catch (e) { o = eval(ni + "={}") }
    }
}
// 注册命名空间
Namespace.register("WebGraph.Controls");
Namespace.register("WebGraph.Layout");
Namespace.register("WebGraph.Math");
Namespace.register("WebGraph.Shape");
Namespace.register("WebGraph.Model");
Namespace.register("WebGraph.Drawing2D");
Namespace.register("WebGraph.Drawing3D");
Namespace.register("WebGraph.Utils");


/*-*/
//Web图形Layer对象
WebGraph.Model.baseLayer = {
    createNew: function() {
        var me = {};
        me.id = "";
        me.name = "";
        me.visible = true;
        //背景底图
        me.backShapes = [];
        //shape对象集合
        me.shapes = []; //创建一个数组
        me.connector = null;
        //添加底图shape对象
        me.addBackShape = function(newShape) {
            me.backShapes.push(newShape);
        };

        //添加shape对象
        me.addShape = function(newShape) {
            me.shapes.push(newShape);
        };

        //插入shape对象
        me.insertShape = function(insertPos, count, newShape) {
            me.shapes.splice(insertPos, count, newShape);
        };

        //根据Id取shape对象
        me.getShape = function(id) {
            var n = me.shapes.length;

            for (var i = 0; i < n; i++) {
                if (me.shapes[i].id == id)
                    return me.shapes[i];
            }
            //线对象
            if (me.connector)
                return me.connector.getShape(id);
            return null;
        };
        //获取点所在的图形对象
        me.getPointShape = function(x, y) {
            if (me.visible == false) return null;
            var n = me.shapes.length;
            var shape = null;
            for (var i = n - 1; i >= 0; i--) {
                shape = me.shapes[i];
                if (shape.allowActive && shape.visible && shape.isInside(x, y)) {
                    return shape;
                }

            }
            //线对象
            if (me.connector)
                return me.connector.getPointShape(x, y)
            return null;
        };



        //绘制图形函数
        me.draw = function(ctx) {
            if (me.visible == false) return;
            var n = me.backShapes.length;
            for (var i = 0; i < n; i++) { if (me.backShapes[i].visible) me.backShapes[i].draw(ctx); }


            n = me.shapes.length;
            for (var i = 0; i < n; i++) { if (me.shapes[i].visible) me.shapes[i].draw(ctx); }

            //连接器
            if (me.connector != null)
                me.connector.draw(ctx);

        };

        return me;
    }
};
/*-*/
WebGraph.Model.layer = {
    createNew: function() {
        var me = WebGraph.Model.baseLayer.createNew();
        me.remark = "";
        me.enable = true;

        me.selected = false;
        me.clear = function() {
            me.backShapes = [];
            me.shapes = [];
            me.connector = null;
        };

        return me;
    }
};
/*-*/
//Web图形Layers对象
WebGraph.Model.layers = {
    createNew: function() {
        var me = [];
        // //背景底图
        // me.backShapes = [];
        // //shape对象集合
        // me.layerList = []; //创建一个数组

        me.selectedLayer = null;
        me.activeLayer = null; //激活图层
        //创建连接关系
        me.addLayer = function(newLayer) {
            me.push(newLayer);
        };

        me.removeLayer = function(index) {
            var layer = me[index];
            layer.backShapes = [];
            layer.shapes = [];
            layer.connector = null;
            // splice() 方法可删除从 index 处开始的零个或多个元素，并且用参数列表中声明的一个或多个值来替换那些被删除的元素。
            // 如果从 arrayObject 中删除了元素，则返回的是含有被删除的元素的数组。
            me.splice(index, 1);
        };
        me.moveTop = function(id) {

        };
        me.moveBottom = function(id) {

        };
        me.moveUp = function(id) {

        };
        me.moveDown = function(id) {

        };
        //插入layer对象
        me.insertLayer = function(insertPos, count, newLayer) {
            me.splice(insertPos, count, newLayer);
        };

        //根据Id取layer对象
        me.getLayer = function(id) {
            var n = me.length;

            for (var i = 0; i < n; i++) {
                if (me[i].id == id) {
                    return me[i];
                }
            }
        };


        //根据Id取shape对象
        me.getShape = function(id) {
            var m = me.length;
            var n = 0;
            var lr = null;
            for (var i = 0; i < m; i++) {
                n = me[i].shapes.length;
                lr = me[i];
                for (var j = 0; j < n; j++) {
                    if (lr.shapes[j].id == id)
                        return lr.shapes[j];
                }
            }
            return null;
        };

        //获取点所在的图形对象
        me.getPointShape = function(x, y) {
            var m = me.length;
            var n = 0;
            var lr = null;
            var shp = null;
            if (me.activeLayer) {
                shp = me.activeLayer.getPointShape(x, y);
                if (shp)
                    return shp;
            } else {
                for (var i = m - 1; i >= 0; i--) {
                    lr = me[i];
                    shp = lr.getPointShape(x, y);
                    if (shp)
                        return shp;
                }
            }
            return null;
        };


        //修改连接关系位置（节点移动时）
        me.modifyRelations = function(shape) {
            var m = me.length;
            for (var i = 0; i < m; i++) {
                if (me[i].connector)
                    me[i].connector.modifyRelations(shape);
            }
        };

        //绘制图形函数
        me.draw = function(ctx) {
            // var n = me.backShapes.length;
            // 	for (var i = 0; i < n; i++)
            // 		me.backShapes[i].draw(ctx); 
            var n = me.length;
            for (var i = 0; i < n; i++)
                me[i].draw(ctx);
        };

        return me;
    }
};
/*-*/

/* 
 *Web拓扑图形组件
 *作者： 刘金山
 *日期： 2014-07-01
 */

//Web图形画板基类对象[Model]
WebGraph.Model.CanvasBase = {
    createNew: function(container_id) {
        var me = WebGraph.Model.baseLayer.createNew();
        me.id = container_id + '-1314520';
        me.parentID = container_id;
        me.canvasBorder = 1;
        //初始Canvas标签20180411
        if (container_id) {
            var canvasPanel = document.getElementById(container_id);
            var canvasHtml = '<canvas id="' + me.id + '"  style="background-color:white; border: ' + me.canvasBorder.toString() + 'px DimGray solid; "></canvas>';
            canvasPanel.innerHTML = canvasHtml;
            //canvasPanel.append( '<canvas id="'+me.id+'"  style="background-color:white; border: 1px DimGray solid; "></canvas>');
            //获取画布对象
            me.canvas = document.getElementById(me.id);
        } else {
            //创建无标签对象
            me.canvas = document.createElement('canvas');
        }
        if (me.canvas == null)
            return false;
        me.context = me.canvas.getContext("2d");

        me.context.clearRect(0, 0, me.canvas.width, me.canvas.height);
        me.doubleBuffer = false;
        me.scale = 1; //scalewidth	缩放当前绘图的宽度 (1=100%, 0.5=50%, 2=200%, 依次类推)
        me.type = "";
        //me.name = "";
        me.x = 10;
        me.y = 10;
        me.width = 20;
        me.height = 20;
        me.backColor = "#111111"; //背景颜色
        me.tag = null;
        me.data = null; //存储属性信息对象
        //背景底图
        // me.backShapes = [];
        // //shape对象集合
        // me.shapes = []; //创建一个数组
        // 		//连接器
        // me.connector = null;
        me.selectedShape = null;
        me.selectedShapes = null;
        me.hoverShape = null;

        //右键菜单	
        me.contextMenu = null;
        me.toolTip = null;
        me.tipBox = null;
        //图例
        me.legend = null;
        me.showRuler = false; //是否显示标尺
        me.centerPoint = {
            X: 0,
            Y: 0
        };
        me.startPoint = null;
        me.isMousedown = false;
        me.operateState = 'none'; //'move','zoom','resize'，'rectSelect'，'link','new'，''
        me.shapeType = 'canvas'; //'circle','line','polygon'，'rhombus'
        //编辑选择器
        me.selector = null;
        //框选对象
        me.rectSelect = null;
        me.isRectSelect = false;
        me.allowRectSelect = false; //设置是否允许框选
        //初始函数
        me.init = function(x, y, width, height) {
            me.x = x;
            me.y = y;
            me.width = width;
            me.height = height;
            //me.viewBox = viewBox;
            me.canvas.width = width;
            me.canvas.height = height;
            me.canvas.left = x;
            me.canvas.top = y;
            //me.canvas.clientWidth=width;me.canvas.clientHeight=height;
        };
        me.setCanvasBorder = function(width) {
            me.canvasBorder = width;
            me.canvas.style.border = width.toString();
        }
        me.clear = function() {
            me.backShapes = [];
            me.shapes = [];
            me.connector = null;
            me.selectedShape = null;
            me.selectedShapes = null;
            me.hoverShape = null;
            me.contextMenu = null;
            me.toolTip = null;
            me.tipBox = null;
            me.legend = null;
            me.context.clearRect(0, 0, me.canvas.width, me.canvas.height);
        };
        //通用注册事件方法
        me.addEvent = function(elm, evType, fn, useCapture) {
            if (elm.addEventListener) {
                me.delEvent(elm, evType, fn, useCapture);
                elm.addEventListener(evType, fn, useCapture); //DOM2.0
                return true;
            } else if (elm.attachEvent) {
                elm.detachEvent('on' + evType, fn);
                var r = elm.attachEvent('on' + evType, fn); //IE5+
                return r;
            } else {
                elm['on' + evType] = fn; //DOM 0
            }
        };

        //删除事件监听
        me.delEvent = function(elm, evType, fn, useCapture) {
            if (elm.removeEventListener) {
                elm.removeEventListener(evType, fn, useCapture);
                return true;
            } else if (elm.detachEvent) {
                elm.detachEvent('on' + evType, fn);
                var r = elm.detachEvent('on' + evType, fn); //IE5+
                return r;
            } else {
                elm['on' + evType] = null; //DOM 0
            }
        };
        //事件 处理
        me.event = WebGraph.Model.Event.createNew(me);
        //鼠标down
        me.mouseDown = function(e) {
            me.event.mouseDown(e);
            me.mouseDownCallback(e, me.selectedShape);
        };
        me.mouseMove = function(e) {
            me.event.mouseMove(e);
            me.mouseMoveCallback(e, me.hoverShape);
        };
        me.mouseUp = function(e) {
            me.event.mouseUp(e);
            me.mouseUpCallback(e, me.selectedShape);
        };
        me.mouseWheel = function(e) {
            me.event.mouseWheel(e);
            me.mouseWheelCallback(e);
        };
        me.click = function(e) {
            //me.event.click(e);
            me.clickCallback(e, me.selectedShape);
        };
        me.dblclick = function(e) {
            //me.event.dblclick(e);
            me.dblclickCallback(e, me.selectedShape);
        };
        // me.keyDown = function(e) {
        //     //me.event.dblclick(e);
        //     me.keyDownCallback(e, me.selectedShape);
        // };
        //回调函数
        me.mouseDownCallback = function(e, curshape) {};
        me.mouseMoveCallback = function(e, curshape) {};
        me.mouseUpCallback = function(e, curshape) {};
        me.mouseWheelCallback = function(e) {};
        me.clickCallback = function(e, curshape) {};
        me.dblclickCallback = function(e, curshape) {};
        // me.keyDownCallback = function(e, curshape) {};
        //添加事件
        // addEvent(me.canvas, 'mousedown', function(){mouseDown(window.event||arguments[0],me); } , false) ;
        // addEvent(me.canvas,'mousemove', function(){mouseMove(window.event||arguments[0],me); }, false);
        // addEvent(me.canvas,'mouseup', function(){mouseUp(window.event||arguments[0],me); }, false);
        // addEvent(me.canvas,'mousewheel', function(){ mouseWheel(window.event||arguments[0],me);}, false);	
        // //addEvent(me.canvas,'click', click, false);
        // addEvent(me.canvas,'dblclick', function(){dblclick(window.event||arguments[0],me);}, false);
        me.addEvent(me.canvas, 'mousedown', me.mouseDown, false);
        me.addEvent(me.canvas, 'mousemove', me.mouseMove, false);
        me.addEvent(me.canvas, 'mouseup', me.mouseUp, false);
        me.addEvent(me.canvas, 'mousewheel', me.mouseWheel, false);
        //addEvent(me.canvas,'click', click, false);
        me.addEvent(me.canvas, 'dblclick', me.dblclick, false);
        //  me.addEvent(me.canvas, 'keyDown', me.keyDown, false);

        //拉框选择[框选操作]   
        me.setRectSelect = function() {
            if (me.allowRectSelect == false) return;
            me.operateState = 'rectSelect';
            me.canvas.style.cursor = 'default';
            me.rectSelect = WebGraph.Shape.Rect.createNew();
            me.rectSelect.opacity = 0.3;
            me.isRectSelect = true;
            me.rectSelect.init(-100, -100, 0, 0, 1, "DimGray", "SteelBlue");
        };
        //获取框选所在的图形对象
        me.getRecShapes = function(x, y, w, h) {
            me.clearSelectedShape();
            var n = me.shapes.length;
            var shape = null;
            var r1 = { x: x, y: y, w: w, h: h };
            var r2 = null;
            for (var i = n - 1; i >= 0; i--) {
                shape = me.shapes[i];
                r2 = { x: shape.x, y: shape.y, w: shape.width, h: shape.height };
                if (WebGraph.Math.iSCross2Rect(r1, r2)) {
                    shape.selected = true;
                    me.selectedShapes.push(shape);
                }
            }
        };
        //隐藏指定的Shape对象
        me.hiddenShape = function(shp) {
            shp.visible = false;
            if (me.connector) {
                var n = me.connector.linkLines.length;
                for (var i = 0; i < n; i++) {
                    if (me.connector.linkLines[i].fromShape == shp || me.connector.linkLines[i].toShape == shp)
                        me.connector.linkLines[i].visible = false;
                }
            }
            me.draw();
        };
        //取消隐藏指定的Shape对象
        me.showShape = function(shp) {
            shp.visible = true;
            if (me.connector) {
                var n = me.connector.linkLines.length;
                for (var i = 0; i < n; i++) {
                    if (me.connector.linkLines[i].fromShape == shp || me.connector.linkLines[i].toShape == shp)
                        me.connector.linkLines[i].visible = true;
                }
            }
            me.draw();
        };

        //清除选中集合
        me.clearSelectedShape = function() {
            if (me.selectedShapes) {
                var n = me.selectedShapes.length;
                for (var i = n - 1; i >= 0; i--)
                    me.selectedShapes[i].selected = false;

            }
            me.selectedShapes = [];
        };
        //判断选中的对象是否在选中集合里
        me.inSelectedShapes = function(shape) {
            for (i in me.selectedShapes) {
                if (me.selectedShapes[i] == shape) return true;
            }
            return false;
        }
        me.setSelectedShape = function(shape) {
            if (shape == null) return;
            if (me.selectedShape)
                me.selectedShape.selected = false;
            me.selectedShape = shape;
            shape.selected = true;
            var inArr = false;
            if (me.selectedShapes) {
                var n = me.selectedShapes.length;
                var sh;
                for (var i = n - 1; i >= 0; i--) {
                    sh = me.selectedShapes[i];
                    if (sh == shape) {
                        inArr = true;
                        //sh.selected=true;
                        break;
                    }
                }
                if (inArr == false)
                    me.clearSelectedShape();
            }
        };

        //移动选中Shape对象
        me.moveSelectedShape = function(x, y) {
            if (me.selectedShape == null) return;
            me.selectedShape.setMove(x, y);
            if (me.connector) {
                me.connector.modifyRelations(me.selectedShape);
                //如果有分组
                if (me.selectedShape.groups && me.selectedShape.groups.length > 0) {
                    for (var i = me.selectedShape.groups.length - 1; i >= 0; i--) {
                        me.connector.modifyRelations(me.selectedShape.groups[i]);
                    }
                }
            }

            if (me.selectedShapes) {
                var n = me.selectedShapes.length;
                var sh;
                for (var i = n - 1; i >= 0; i--) {
                    sh = me.selectedShapes[i];
                    if (sh != me.selectedShape)
                        sh.setMove(x, y);

                    if (me.connector) {
                        me.connector.modifyRelations(sh);
                        //如果有分组
                        if (sh.groups && sh.groups.length > 0) {
                            for (var i = sh.groups.length - 1; i >= 0; i--) {
                                me.connector.modifyRelations(sh.groups[i]);
                            }
                        }
                    }

                }
            }
        };


        //获取转换后的坐标
        me.getCoorConver = function(mx, my) {
            if (me.canvas == null) return { x: mx, y: my };
            var bbox = me.canvas.getBoundingClientRect();
            var s_Top = document.documentElement.scrollTop || document.body.scrollTop;  //向下滚动了多少
            var s_Left = document.documentElement.scrollLeft || document.body.scrollLeft;  //向左滚动了多少

            var xv = (mx - bbox.left * (me.canvas.width / bbox.width)) * 1 - s_Left;
            var yv = (my - bbox.top * (me.canvas.height / bbox.height)) * 1 - s_Top;

            if (xv < 0) xv = 0;
            return { x: xv / me.scale - me.centerPoint.X, y: yv / me.scale - me.centerPoint.Y };
        };

        //平移操作[按钮操作]   
        me.setMoveAll = function() {
            if (me.operateState == 'moveAll') {
                me.operateState = 'none';
                me.canvas.style.cursor = 'default'; //hand';
            } else {
                me.operateState = 'moveAll';
                me.canvas.style.cursor = 'move'; //hand';// pointer
            }
        };
        //缺省操作   
        me.setSelect = function() {
            me.operateState = 'none';
            me.canvas.style.cursor = 'default';
        };



        me.setCenterLocation = function() {
            var divWorkArea = document.getElementById('workarea');

            var w = me.canvas.width - divWorkArea.clientWidth;
            var h = me.canvas.height - divWorkArea.clientHeight;
            var x = w / 2; //me.canvas.width/2
            var y = h / 2; //me.canvas.height/2-h
            if (w > 0)
                divWorkArea.scrollLeft = x; ///divWorkArea.clientWidth;
            if (h > 0)
                divWorkArea.scrollTop = y; ///divWorkArea.clientWidth;
        };
        me.setLocation = function(x, y) {

            var divWorkArea = document.getElementById('workarea');
            var centerX = divWorkArea.clientWidth / 2;
            var centerY = divWorkArea.clientHeight / 2;
            var offsetX = 0;
            var offsetY = 0;
            //if (x>divWorkArea.clientWidth) 
            offsetX = x - centerX;
            //  if (y>divWorkArea.clientHeight) 
            offsetY = y - centerY;
            var w = me.canvas.width - divWorkArea.clientWidth;
            var h = me.canvas.height - divWorkArea.clientHeight;

            if (w > 0)
                divWorkArea.scrollLeft = offsetX; ///divWorkArea.clientWidth;
            if (h > 0)
                divWorkArea.scrollTop = offsetY; ///divWorkArea.clientWidth;
        };


        //缩放当前绘图的宽度
        me.zoom = function(zoomType) {
            if (zoomType == 'zoom') {
                me.scale = 1;
                me.canvas.width = me.width * me.scale;
                me.canvas.height = me.height * me.scale;
                me.draw();
                // 	var divWorkArea = document.getElementById('workarea');

                // 	divWorkArea.scrollLeft =0;
                // divWorkArea.scrollTop = 0;
                return;
            }
            if (zoomType == 'zoomIn') {
                me.scale += 0.1;
                me.canvas.width = me.width * me.scale;
                me.canvas.height = me.height * me.scale;
                // var divWorkArea = document.getElementById('workarea');
                // 	// x=divWorkArea.clientWidth/2;
                // 	// y=divWorkArea.clientHeight/2;
                // 	divWorkArea.scrollLeft =divWorkArea.scrollLeft+10;///divWorkArea.clientWidth;
                // divWorkArea.scrollTop = divWorkArea.scrollTop+10;
                // if (me.centerPoint == null)
                // 	me.centerPoint = {
                // 		X: 0,
                // 		Y: 0
                // 	};
                // me.centerPoint = {
                // 	X: me.centerPoint.X - 10,
                // 	Y: me.centerPoint.Y - 10
                // };
            } else if (zoomType == 'zoomOut') {
                me.scale -= 0.1;
                me.canvas.width = me.width * me.scale;
                me.canvas.height = me.height * me.scale;
                // 	var divWorkArea = document.getElementById('workarea'); 
                // 	divWorkArea.scrollLeft =divWorkArea.scrollLeft-10;///divWorkArea.clientWidth;
                // divWorkArea.scrollTop = divWorkArea.scrollTop-10;
                // if (me.centerPoint == null)
                // 	me.centerPoint = {
                // 		X: 0,
                // 		Y: 0
                // 	};
                // me.centerPoint = {
                // 	X: me.centerPoint.X + 10,
                // 	Y: me.centerPoint.Y + 10
                // };
            }
            me.draw();
        };
        //缩放[鼠标滚轮]
        me.zoomViaMouseWheel = function(mouseWheelEvent) {
            if (mouseWheelEvent.wheelDelta > 0)
                zoom('zoomIn');
            else
                zoom('zoomOut');

            mouseWheelEvent.cancelBubble = true;
            return false;
        };
        //本地另存
        me.saveImage = function() {
            var image = me.canvas.toDataURL("image/png");
            var win = window.open('about:blank'); //,'图片另存');
            win.document.write("<img src='" + image + "' alt='from canvas'/>");
        };
        //保存到本地
        me.saveAsLocalImage = function() {
            var image = me.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            window.location.href = image;
        };

        //本地另存
        me.getImage = function() {
            return me.canvas.toDataURL("image/png");
        };

        //设置双缓冲
        me.bufferCanvas = null;
        me.bufferContext = null;

        me.setDoubleBuffer = function() {
            me.doubleBuffer = true;
            //使用双缓冲	  
            me.bufferCanvas = document.createElement("canvas");
            me.bufferContext = me.bufferCanvas.getContext("2d");
            //现在，保证缓冲canvas的大小与显示canvas大小一致
            me.bufferCanvas.width = me.canvas.width;
            me.bufferCanvas.height = me.canvas.height;
            me.bufferContext.clearRect(0, 0, me.canvas.width, me.canvas.height);
        };

        //绘制图形函数
        me.draw = null;
        me.drawAfter = null;
        me.getSvgString = null;
        me.toString = null;

        me.setJsonConfig = function(jsonConfig) {
            if (jsonConfig) {

                for (var i = 0; i < jsonConfig.length; i++) {
                    if (jsonConfig[i].id != undefined) {}
                };
            }
        };
        me.getJsonString = function() {
            var jsonData = [];
            for (var i = 0; i < me.shapes.length; i++) {
                jsonData.push(me.shapes[i].toJsonString());
            };

            return "[" + jsonData.join(",") + "]";
        };
        me.getCoor = function() {
            var jsonData = [];
            for (var i = 0; i < me.shapes.length; i++) {
                jsonData.push(me.shapes[i].getCoor());
            };

            return "[" + jsonData.join(",") + "]";
        };


        me.toJsonString = function() {
            var jsonObj = [];
            // var data = {"shapes": [{ "id": "A_1", "name":"HLR"},{"id":"A_2","name":"GWSC"}]},
            //     	{ "linkLines":[{"fromId": "A_1",  "toId": "B_2","name":"10条"},{"fromId": "A_2",  "toId": "B_2"}]},
            //         { "group":[{"id":"B_2"},{"id":"B_3"},{"id":"B_4"}]}
            //         ;

            var shps = me.shapes;
            var links = null;
            if (me.connector)
                links = me.connector.linkLines;
            if (me.layers) {
                shps = me.layers[0].shapes;
                if (me.layers[0].connector)
                    links = me.layers[0].connector.linkLines;
            }
            jsonObj.push('{"shapes": [');
            for (var i = 0; i < shps.length; i++) {
                jsonObj.push('{');
                jsonObj.push('"id":"' + shps[i].id + '",');
                jsonObj.push('"x":"' + shps[i].x + '",');
                jsonObj.push('"y":"' + shps[i].y + '",');
                jsonObj.push('"width":"' + shps[i].width + '",');
                jsonObj.push('"height":"' + shps[i].height + '",');
                jsonObj.push('"fill":"' + shps[i].fill + '",');
                jsonObj.push('"stroke":"' + shps[i].stroke + '",');
                jsonObj.push('"strokeWidth":"' + shps[i].strokeWidth + '",');
                jsonObj.push('"Text":"' + shps[i].Text + '",');
                jsonObj.push('"TopText":"' + shps[i].TopText + '",');
                jsonObj.push('"BottomTex":"' + shps[i].BottomTex + '",');
                jsonObj.push('"LeftText":"' + shps[i].LeftText + '",');
                jsonObj.push('"RightText":"' + shps[i].RightText + '",');
                jsonObj.push('"fontSize":"' + shps[i].fontSize + '",');
                jsonObj.push('"font":"' + shps[i].font + '",');
                jsonObj.push('"fontFamily":"' + shps[i].fontFamily + '",');
                jsonObj.push('"tipText":"' + shps[i].tipText + '",');
                jsonObj.push('"fontColor":"' + shps[i].fontColor + '"');
                if (i == shps.length - 1)
                    jsonObj.push('}');
                else
                    jsonObj.push('},');
            }
            jsonObj.push(']');
            if (links && links.length) {
                jsonObj.push(',"linkLines":[');
                for (var i = 0; i < links.length; i++) {
                    jsonObj.push('{');
                    jsonObj.push('"id":"' + links[i].id + '",');
                    jsonObj.push('"fill":"' + links[i].fill + '",');
                    jsonObj.push('"stroke":"' + links[i].stroke + '",');
                    jsonObj.push('"strokeWidth":"' + links[i].strokeWidth + '",');
                    jsonObj.push('"Text":"' + links[i].Text + '",');
                    jsonObj.push('"tipText":"' + shps[i].tipText + '",');
                    jsonObj.push('"fontSize":"' + links[i].fontSize + '",');
                    jsonObj.push('"font":"' + links[i].font + '",');
                    jsonObj.push('"fontFamily":"' + links[i].fontFamily + '",');
                    jsonObj.push('"fontColor":"' + links[i].fontColor + '",');
                    jsonObj.push('"lineType":"' + links[i].lineType + '",');
                    jsonObj.push('"lineColor":"' + links[i].lineColor + '",');
                    jsonObj.push('"hasArrow":"' + links[i].hasArrow + '",');
                    jsonObj.push('"fromPoint":"' + links[i].fromPoint + '",');
                    jsonObj.push('"toPoint":"' + links[i].toPoint + '",');
                    jsonObj.push('"useCrossPoint":"' + links[i].useCrossPoint + '",');
                    jsonObj.push('"points":"' + links[i].points + '",');
                    jsonObj.push('"fromId":"' + links[i].fromId + '",');
                    jsonObj.push('"toId":"' + links[i].toId + '",');
                    jsonObj.push('"showStartArrow":"' + links[i].showStartArrow + '",');
                    jsonObj.push('"showEndArrow":"' + links[i].showEndArrow + '"');
                    if (i == links.length - 1)
                        jsonObj.push('}');
                    else
                        jsonObj.push('},');
                }
                jsonObj.push(']} ');
            }
            var str = "";
            for (var i = 0; i < jsonObj.length; i++) {
                str = str + jsonObj[i];
            };
            return str; //jsonObj.toString();
        };
        return me;
    }
};

/*function mouseDown(evt) {
	myCanvas.mouseDown(evt);
	//mouseDownEvent(evt, myCanvas.selectedShape);
}
function mouseMove(evt) {
	// if (evt == null || evt.target == null) return;
	// var XPos = evt.clientX;
	// var YPos = evt.clientY;
	// document.getElementById("xyCoord").innerHTML = XPos + "," + YPos;
	myCanvas.mouseMove(evt);
}
//单击事件
function mouseUp(evt) {
	myCanvas.mouseUp(evt);
	//mouseUpEvent(evt, myCanvas.selectedShape);
}
function click(evt) {
	myCanvas.click(evt, myCanvas.selectedShape);
	//mouseClickEvent(evt, myCanvas.selectedShape);
}

function dblclick(evt) {
	myCanvas.dblclick(evt, myCanvas.selectedShape);
	//mouseDblClickEvent(evt, myCanvas.selectedShape);
}

function mouseWheel(evt) {
	myCanvas.mouseWheel(evt);
	//mouseDblClickEvent(evt, myCanvas.selectedShape);
}*/
// function mouseDown(e,obj) {
// 	obj.mouseDown(e);
// 	//mouseDownEvent(evt, myCanvas.selectedShape);
// }
// function mouseMove(e,obj) {
// 	// if (evt == null || evt.target == null) return;
// 	// var XPos = evt.clientX;
// 	// var YPos = evt.clientY;
// 	// document.getElementById("xyCoord").innerHTML = XPos + "," + YPos;
// 	obj.mouseMove(e);
// }
// //单击事件
// function mouseUp(e,obj) {
// 	obj.mouseUp(e);
// 	//mouseUpEvent(evt, obj.selectedShape);
// }
// function click(e,obj) {
// 	obj.click(e, obj.selectedShape);
// 	//mouseClickEvent(evt, myCanvas.selectedShape);
// }

// function dblclick(e,obj) {
// 	obj.dblclick(e, obj.selectedShape);
// 	//mouseDblClickEvent(evt, myCanvas.selectedShape);
// }

// function mouseWheel(e,obj) {
// 	obj.mouseWheel(obj,e);
// 	//mouseDblClickEvent(evt, myCanvas.selectedShape);
// }

/*-*/

//图形基类
WebGraph.Model.Element = {
    createNew: function() {
        var elt = {};
        elt.id = "";
        elt.shapeType = "";
        // elt.class=""; 
        elt.x = 10;
        elt.y = 10;
        elt.width = 50;
        elt.height = 50;
        // elt.isFill=true;//是否填充
        // elt.isStroke=true;//是否画边框
        elt.fill;
        elt.stroke = "black";
        elt.strokeWidth = 1;

        elt.Text = null;
        elt.TopText = null;
        elt.BottomText = null;
        elt.LeftText = null;
        elt.RightText = null;
        elt.fontSize = "12";
        elt.font = "12px 宋体";
        elt.fontFamily = "宋体";
        elt.fontColor = "#000000";
        elt.textWrapLine = true; //文字是否自动换行
        elt.textAnchor = "center";
        // elt.fillOpacity="";
        // elt.strokeOpacity="";
        // opacity 属性定义整个元素的透明值（合法的范围是：0 - 1）
        elt.opacity = 1;
        elt.rotate = 0;
        elt.rotateCenter = 0; //旋转的中心参考点
        elt.tipContext = null;
        elt.tipText = null;
        elt.shadow = false; //是否阴影
        elt.shadowOffsetX = 5;
        elt.shadowOffsetY = 5;
        elt.shadowBlur = 10;
        elt.shadowColor = "rgba(0, 0, 255, 0.5)";

        elt.linearGradient = null; //使用渐变色渲染
        // elt.beginColor ="green";
        //    elt.endColor ="white";

        //扩展属性可选项
        elt.showMenu = true;
        elt.showLinkPoint = false;
        elt.linkPoints = null;
        elt.enable = true;
        elt.visible = true;
        elt.selected = false;
        elt.mousePoint = null;
        //编辑选择器
        elt.selector = null;
        elt.selectedStroke = "red";
        elt.selectedFill = null;
        elt.hovered = false;
        elt.hoverStroke = "blue";

        elt.editSize = true;
        elt.allowActive = true; //允许激活

        elt.allowDrog = true;
        elt.allowMoveY = true; //允许垂直方向移动
        elt.allowMoveX = true; //允许水平方向移动
        elt.data = null; //存储属性信息对象
        elt.tag = null;
        elt.temp = null;
        elt.type = null;
        elt.children; //子数组对象
        elt.groups; //分组对象
        elt.parent;
        elt.webCanvas; //画板对象
        elt.href; //属性用于指定超链接目标的 URL


        elt.editSize = true;
        // elt.rotatePoint;//鼠标点根据中心点旋转后的点
        //elt.targetElement=null;//html 节点实际元素

        //elt.setSelected = function(tf,elt){ 			
        //			     elt.selected=tf;
        //				// elt.targetElement=elt;
        //				 if (tf=='true')
        //				   elt.setAttribute("stroke", elt.selected);
        //				 else
        //				    elt.setAttribute("stroke", elt.stroke);
        //			}
        //回调函数
        elt.mouseDownCallback = function(e, curshape) {};
        elt.mouseMoveCallback = function(e, curshape) {};
        elt.mouseUpCallback = function(e, curshape) {};
        // elt.mouseWheelCallback = function(e) {};
        // elt.clickCallback = function(e,curshape) {};
        // elt.dblclickCallback = function(e,curshape) {};

        //事件可以被重写
        elt.mouseDown = function(e, p) {
            if (elt.selector)
                elt.selector.mouseDown(e, p.x, p.y);
            // if (elt.linkPoints)
            // {
            // 	elt.linkPoints.mouseDown(e);
            // }
            elt.mouseDownCallback(e, this);
        };

        elt.mouseUp = function(e, p) {
            if (elt.selector)
                elt.selector.mouseUp(e, p.x, p.y);
            if (elt.linkPoints) {
                elt.linkPoints.mouseUp(e);
            }
            elt.mouseUpCallback(e, this);
        };

        elt.mouseMove = function(e, p) {

            // if (elt.linkPoints)
            // {
            // 	elt.linkPoints.mouseMove(e,p.x, p.y);
            // 	//连接点  
            // //if (w.selected&&w.linkPoints && w.linkPoints.visible)
            // 	//elt.webCanvas.canvas.style.cursor = 'default';
            // }

            if (elt.selector)
                elt.selector.mouseMove(e, p.x, p.y);
            elt.mouseMoveCallback(e, this);
        };

        elt.setBounds = function(x, y, w, h) {
            elt.x = x;
            elt.y = y;
            elt.width = w;
            elt.height = h;
        };

        elt.setMoveAfter = function(newX, newY) {};
        elt.shapeMoveAfter = function(shp, newX, newY) {};

        elt.setMove = function(newX, newY) {

            if (elt.allowMoveX)
                elt.x += newX;
            if (elt.allowMoveY)
                elt.y += newY;

            //如果是分组节点，移动时子节点也移动
            if (elt.groups && elt.groups.length > 0) {
                for (var i = elt.groups.length - 1; i >= 0; i--) {
                    elt.groups[i].x += newX;
                    elt.groups[i].y += newY;
                };

            }
            //如果是分组里的节点，移动时不能超出父节点
            if (elt.parent != null) {
                if (elt.x < elt.parent.x) elt.x = elt.parent.x;
                if (elt.y < elt.parent.y) elt.y = elt.parent.y;

                if (elt.x > elt.parent.x + elt.parent.width - elt.width) elt.x = elt.parent.x + elt.parent.width - elt.width;
                if (elt.y > elt.parent.y + elt.parent.height - elt.height) elt.y = elt.parent.y + elt.parent.height - elt.height;
            }
            elt.shapeMoveAfter(elt, newX, newY);
            elt.setMoveAfter(newX, newY);
        };

        elt.setSelected = function(tf) {
            elt.selected = tf;

            if (elt.editSize) {
                if (!tf && elt.selector != null) {
                    elt.selector.hideHandles();
                    elt.selector = null;
                    return;
                }
                //选择器事件处理
                if (tf && elt.selector == null) {
                    elt.selector = WebGraph.Model.Selector.createNew();
                    elt.selector.init(elt.webCanvas);
                }
            }

            if (elt.showLinkPoint) {
                if (!tf && elt.linkPoints != null) {
                    elt.linkPoints.hideLinkPoint();
                    elt.linkPoints = null;
                    return;
                }
                //选择器事件处理
                if (tf && elt.linkPoints == null) {
                    elt.linkPoints = WebGraph.Model.linkPoints.createNew();
                    elt.linkPoints.init(elt.webCanvas);
                }

            }
        };


        elt.getString = function() {
            var str = '';
            if (elt.id != "") str = str + ' id="' + elt.id + '"';
            if (elt.x != "") str = str + ' x=' + elt.x;
            if (elt.y != "") str = str + ' y=' + elt.y;
            if (elt.width != "") str = str + ' width=' + elt.width;
            if (elt.height != "") str = str + ' height=' + elt.height;

            if (elt.fill != "") str = str + ' fill="' + elt.fill + '"';
            if (elt.stroke != "") str = str + ' stroke="' + elt.stroke + '"';
            if (elt.strokeWidth != "") str = str + ' stroke-width="' + elt.strokeWidth + '"';;

            // str=str+' x='+elt.x
            //					 +' y='+elt.y
            //					 +' width='+elt.width
            //					 +' height='+elt.height
            //					 +' fill='+elt.fill
            //					 +' stroke='+elt.stroke
            //					 +' stroke-width='+elt.strokeWidth; 



            //透明色
            if (elt.fillOpacity != "") str = str + ' fill-opacity=' + elt.fillOpacity;
            if (elt.strokeOpacity != "") str = str + ' stroke-opacity=' + elt.strokeOpacity;
            if (elt.opacity != "") str = str + ' opacity=' + elt.opacity;
            if (elt.rotate != "") str = str + ' rotate=' + elt.rotate;
            if (elt.tooltipText != "") str = str + ' textContent=' + elt.tooltipText;

            // //添加事件	 
            // if (elt.Event!="") str=str+' '+elt.Event;	
            // if (elt.onkeydown!="") str=str+' onkeydown='+elt.onkeydown;	
            // if (elt.onkeypress!="") str=str+' onkeypress='+ elt.onkeypress;	
            // if (elt.onkeyup!="") str=str+' onkeyup='+  elt.onkeyup;		
            // if (elt.onclick!="") str=str+' onclick='+  elt.onclick;		
            // if (elt.ondblclick!="") str=str+' ondblclick='+ elt.ondblclick;	
            // if (elt.onmousedown!="") str=str+' onmousedown='+ elt.onmousedown;	
            // if (elt.onmousemove!="") str=str+' onmousemove='+ elt.onmousemove;	
            // if (elt.onmouseout!="") str=str+' onmouseout='+  elt.onmouseout;	
            // if (elt.onmouseover!="") str=str+' onmouseover='+ elt.onmouseover;	
            // if (elt.onmouseup!="") str=str+' onmouseup='+elt.onmouseup;		

            return str;
        };

        elt.setJsonConfig = function(jsonConfig) {
            if (jsonConfig) {

                for (var i = 0; i < jsonConfig.length; i++) {
                    if (jsonConfig[i].id != undefined) elt.id = jsonConfig[i].id;
                    if (jsonConfig[i].x != undefined) elt.x = jsonConfig[i].x;
                    if (jsonConfig[i].y != undefined) elt.y = jsonConfig[i].y;
                    if (jsonConfig[i].width != undefined) elt.width = jsonConfig[i].width;
                    if (jsonConfig[i].height != undefined) elt.height = jsonConfig[i].height;
                    if (jsonConfig[i].fill != undefined) elt.fill = jsonConfig[i].fill;
                    if (jsonConfig[i].stroke != undefined) elt.stroke = jsonConfig[i].stroke;
                    if (jsonConfig[i].strokeWidth != undefined) elt.strokeWidth = jsonConfig[i].strokeWidth;
                    if (jsonConfig[i].opacity != undefined) elt.opacity = jsonConfig[i].opacity;
                    if (jsonConfig[i].rotate != undefined) elt.rotate = jsonConfig[i].rotate;
                    if (jsonConfig[i].shapeType != undefined) elt.shapeType = jsonConfig[i].shapeType;
                    if (jsonConfig[i].text != undefined) elt.text = jsonConfig[i].text;
                };

                // for(var o in jsonConfig){ 

                // }
            }
        };

        elt.getCoor = function() {
            var jsData = []; //{"id":"1","name":"","xy":"344,779"}
            //jsData.push('"shapeType":"' + elt.shapeType+ '"');		
            jsData.push('"id":"' + elt.id.toString() + '"');
            jsData.push('"xy":"' + elt.x.toFixed(2).toString() + ',' + elt.y.toFixed(2).toString() + '"');
            //jsData.push('"y":"' + elt.y.toString()+ '"');  
            // jsData.push('"points":"' + elt.points+ '"');
            return "{" + jsData.join(',') + "}";
        };
        elt.toJsonString = function() {
            var jsData = [];
            jsData.push('"shapeType":"' + elt.shapeType + '"');
            jsData.push('"id":"' + elt.id.toString() + '"');
            jsData.push('"x":"' + elt.x.toString() + '"');
            jsData.push('"y":"' + elt.y.toString() + '"');
            jsData.push('"width":"' + elt.width.toString() + '"');
            jsData.push('"height":"' + elt.height.toString() + '"');
            jsData.push('"points":"' + elt.points + '"');
            jsData.push('"fill":"' + elt.fill + '"');
            jsData.push('"stroke":"' + elt.stroke + '"');
            jsData.push('"strokeWidth":"' + elt.strokeWidth + '"');
            jsData.push('"opacity":"' + elt.opacity + '"');
            jsData.push('"rotate":"' + elt.rotate + '"');
            jsData.push('"text":"' + elt.text + '"');

            return "{" + jsData.join(',') + "}";
        };
        return elt;
    }
};

/*-*/

//Shape基类对象
WebGraph.Shape.ShapeBase = {
    createNew: function(id) {
        var me = WebGraph.Model.Element.createNew();

        if (id != undefined)
            me.id = id;

        //背景底图
        me.backShapes = null;
        me.addBackShape = function(newShape) {
            if (me.backShapes == null)
                me.backShapes = [];
            me.backShapes.push(newShape);
        };

        //初始化函数
        me.init = function(x, y, w, h, strokeWidth, strokeColor, fillColor) {
            me.x = x;
            me.y = y;
            me.width = w;
            me.height = h;
            me.strokeWidth = strokeWidth;
            me.stroke = strokeColor;
            me.fill = fillColor;
        };

        //用json数据初始化
        me.config = function(jsonConfig) {
            var json_Config = [{ "id": "2", "text": "" }];
        };
        //判断鼠标是否在图形内部
        me.isInside = function(mx, my) {
            var x = mx;
            var y = my;
            var h = 0;

            if (me.selector) h = 15;
            //如果旋转
            if (me.rotate != 0) {
                var rotatePoint = WebGraph.Math.getRotatePoint({ x: mx, y: my }, { x: me.x + me.width / 2, y: me.y + me.height / 2 }, -me.rotate);
                x = rotatePoint.x;
                y = rotatePoint.y;
            }

            if (x >= me.x - 2 && x <= (me.x + me.width + 4) && y >= me.y - 2 - h && y <= (me.y + me.height + 4 + h)) {
                return true;
            } else {
                return false;
            }
        };
        //初始
        me.initContext = function(ctx) {
            //ctx.clearRect(me.x-1, me.y-1, me.width+2, me.height+2);
            //旋转
            var rx = me.x;
            var ry = me.y;
            //旋转[默认以矩形中心点]
            //任何原来的坐标点p(ox, oy)在translate之后的坐标点为p(ox-x, oy-y),其中点(x, y)为平移点坐标translate(x, y)
            if (me.rotate != 0) {
                var centerPoint = { x: me.x + me.width / 2, y: me.y + me.height / 2 };

                if (me.rotateCenter)
                    centerPoint = me.rotateCenter;

                ctx.translate(centerPoint.x, centerPoint.y);
                ctx.rotate(me.rotate * Math.PI / 180);
                rx = -me.width / 2;
                ry = -me.height / 2;
            }

            // 设置图形透明度
            // 使用gloabalAlpha属性，值介于0到1，0：完全透明，1：完全不透明	 
            ctx.globalAlpha = me.opacity;
            //ctx.font = me.font;
            // 设置渐变色
            if (me.linearGradient) {
                // var grd=ctx.createLinearGradient(me.x, me.y, me.width, me.height);
                // grd.addColorStop(0,me.beginColor);
                // grd.addColorStop(1,me.endColor);
                // ctx.fillStyle=grd;  
                ctx.fillStyle = me.linearGradient;
            } else {
                if (me.fill)
                    ctx.fillStyle = me.fill; //设置纯色 
            }
            if (me.backShapes) {
                var n = me.backShapes.length;
                for (var i = 0; i < n; i++)
                    me.backShapes[i].draw(ctx);
            }
            // ctx.globalAlpha =1;
            ctx.lineWidth = me.strokeWidth;
            if (me.allowActive == false) {
                me.selected = false;
                me.hovered = false;

            }
            if (me.selected) {
                ctx.strokeStyle = me.selectedStroke;
                ctx.lineWidth = me.strokeWidth;
                if (me.selectedFill) ctx.fillStyle = me.selectedFill; //设置选中颜色 

            }
            if (me.hovered) {
                ctx.strokeStyle = me.hoverStroke;
                ctx.lineWidth = me.strokeWidth + 1;
                ctx.globalAlpha = 0.7;
            }
            if (me.selected == false && me.hovered == false)
                ctx.strokeStyle = me.stroke;
            //设置透明度实践证明透明度值>0,<1值越低，越透明，值>=1时为纯色，值<=0时为完全透明
            // context.fillStyle = "rgba(255,0,0,0.2)";
            //context.strokeStyle = "rgba(255,0,0,0.2)";

            // 为图形添加阴影
            /*
             * context.shadowOffsetX - 阴影相对于实体的水平偏移值
             * context.shadowOffsetY - 阴影相对于实体的垂直偏移值
             * context.shadowBlur - 阴影模糊程度。默认值是 0 ，即不模糊
             * context.shadowColor - 阴影的颜色
             */

            if (me.shadow) {
                ctx.shadowOffsetX = me.shadowOffsetX;
                ctx.shadowOffsetY = me.shadowOffsetY;
                ctx.shadowBlur = me.shadowBlur;
                ctx.shadowColor = me.shadowColor;
            }

            return { X: rx, Y: ry };
        };

        me.drawChilds = function(ctx, left, top, w, h) {};
        me.draw = function(ctx) {};
        //上下左右中的5个文本
        me.draw5Text = function(r, rx, ry, ctx) {

            // if (r.image) {
            // 	r.image.x = rx + r.imageX;
            // 	r.image.y = ry + r.imageY;
            // 	r.image.draw(ctx);
            // }
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.font = r.font;
            var w = r.width;
            var h = r.height;
            var x = rx;
            var y = ry;
            if (w < 20) {
                w = 40;
                x = x + r.width / 2 - 20
            }
            if (h < 20) { h = 15; }

            if (r.Text) {
                var t = WebGraph.Shape.Text.createNew();
                t.x = x;
                t.y = y;
                t.width = w;
                t.height = h;
                t.font = r.font;
                t.wrapLine = me.textWrapLine;
                t.Text = r.Text;
                t.fill = r.fontColor;
                t.strokeWidth = 0;
                t.textAnchor = r.textAnchor;
                t.draw(ctx);
            }
            if (r.TopText) {
                var t = WebGraph.Shape.Text.createNew();
                t.x = x;
                t.y = y - 18;
                t.width = w;
                t.height = 15;
                t.font = r.font;
                t.Text = r.TopText;
                t.fill = r.fontColor;
                t.strokeWidth = 0;
                t.textAnchor = "center";
                t.draw(ctx);
            }

            if (r.BottomText) {
                var t = WebGraph.Shape.Text.createNew();
                t.width = w;
                t.height = 20;
                if (h < 20)
                    t.height = h;
                t.x = x; //+ r.width / 2;
                t.y = y + h + 1; // r.height + 12;
                t.font = r.font;
                t.Text = r.BottomText;
                t.fill = r.fontColor;
                t.strokeWidth = 0;
                t.textAnchor = "center";
                t.wrapLine = false;
                t.draw(ctx);
            }
            if (r.LeftText) {
                var t = WebGraph.Shape.Text.createNew();
                t.x = x - 10;
                t.y = y;
                t.width = w;
                t.height = h;
                t.font = r.font;
                t.Text = r.LeftText;
                t.fill = r.fontColor;
                t.strokeWidth = 0;
                t.textAnchor = "end";
                t.draw(ctx);
            }
            if (r.RightText) {
                var t = WebGraph.Shape.Text.createNew();
                t.x = x + w + 5;
                t.y = y; // + h/2;
                t.width = w;
                t.height = h;
                t.font = r.font;
                t.Text = r.RightText;
                t.fill = r.fontColor;
                t.strokeWidth = 0;
                t.textAnchor = "start";
                t.draw(ctx);
            }
            ctx.restore();
        };

        me.ToString = function() {
            var textString = "";
            return "";
        };




        return me;
    }
};

/*-*/

// 节点拓扑连接器
WebGraph.Model.Connector = {
    createNew: function() {
        var c = {};

        //连接线集合connectio 连接;联系，关系;连接点;亲戚
        c.webCanvas = null;
        //c.lines = [];
        c.linkLines = [];
        c.curLinkLine = null;
        c.lineType = "1"; //线类型 1=直线和 2=三折线  3=贝赛尔曲线
        c.lineColor = "SteelBlue";
        c.hasArrow = false; //是否有箭头
        c.editSize = false;
        //关系集合
        c.relations = []; //	
        c.startPoint = null;
        c.endPoint = null;
        c.selectedLine = null;
        c.useCrossPoint = true;
        //初始化函数
        c.init = function(webCanvas) {
            c.webCanvas = webCanvas;

        };
        //事件可以被重写
        c.mouseDown = function(e, p) {
            // if (c.startPoint==null)
            //             {
            //          c.startPoint= WebGraph.Shape.Rect.createNew();
            // c.startPoint.id ="startPointID";
            // c.startPoint.allowDrog=true;
            // c.startPoint.editSize=false; 
            // c.startPoint.shadow=false;
            // c.startPoint.showLinkPoint=false;

            // c.startPoint.init(0, 0, 5, 5, 0, "#000000", "#111111" );
            // c.webCanvas.addShape(c.startPoint);
            //             }
            //             if (c.endPoint==null)
            //             {
            //          c.endPoint= WebGraph.Shape.Rect.createNew();
            // c.endPoint.id ="endPointID";
            // c.endPoint.allowDrog=true;
            // c.endPoint.editSize=false; 
            // c.endPoint.shadow=false;
            // c.endPoint.showLinkPoint=false;

            // c.endPoint.init(0, 0, 5, 5, 0, "#000000", "#111111" );
            // c.webCanvas.addShape(c.endPoint);
            //             }
            //             if (c.selectedLine)
            //             {
            //     c.selectedLine = c.addRelations(c.startPoint, c.endPoint, c.selectedLine.Text);
            //             }
        };

        c.mouseUp = function(e) {

        };

        c.mouseMove = function(e, p) {

        };
        //创建连接关系[根据relations提供的数据]
        c.createRelations = function(relations, lineType, lineWidth) {
            c.relations = relations;
            c.lineType = lineType;

            if (lineWidth == null) lineWidth = 3;
            c.strokeWidth = lineWidth;
            var n = c.relations.length;
            if (n > 0) {
                c.linkLines = [];
                for (var k = 0; k < n; k++) {
                    var fromShape = c.webCanvas.getShape(c.relations[k].fromId);
                    var toShape = c.webCanvas.getShape(c.relations[k].toId);
                    var text = c.relations[k].name;
                    var lineId = c.relations[k].id;
                    var tipText = c.relations[k].tipText
                    if (tipText == null) tipText = text;
                    var newline = c.addRelations(fromShape, toShape, text, tipText);

                    if (newline != null) {
                        if (lineId)
                            newline.id = lineId;
                        if (c.relations[k].tipContext) {
                            newline.tipContext = [];
                            newline.tipContext.push(c.relations[k].tipContext);
                        }
                        c.linkLines.push(newline);
                    }

                }
            }
        };
        //加一条连接线
        c.addLinkLine = function(fromShape, toShape, text, tipText) {
            if (c.linkLines == null) c.linkLines = [];
            var newline = c.addRelations(fromShape, toShape, text);

            if (newline != null) {
                newline.tipText = tipText;
                // newline.useCrossPoint=c.useCrossPoint;
                // newline.editSize=c.editSize;
                c.linkLines.push(newline);
            }
            return newline;
        };

        c.getLinkLine = function(fromId, toId, name, lineType, lineWidth, lineColor, hasArrow) {
            c.lineType = lineType;
            if (lineWidth == null) lineWidth = 3;
            c.strokeWidth = lineWidth;
            c.lineColor = lineColor;
            c.hasArrow = hasArrow;
            var fromShape = c.webCanvas.getShape(fromId);
            var toShape = c.webCanvas.getShape(toId);

            if (fromShape == null || toShape == null) return null;
            var newline = c.addRelations(fromShape, toShape, name);
            // newline.editSize=c.editSize;
            return newline;

            //return c.addRelations(fromShape, toShape, name);
        };

        c.addRelations = function(fromShape, toShape, name, tipText) {
            var newLine = WebGraph.Model.linkLine.createNew();
            newLine.editSize = c.editSize;
            newLine.useCrossPoint = c.useCrossPoint;
            newLine.tipText = tipText;

            newLine.initLine(fromShape, toShape, name, c.lineType, c.strokeWidth, c.lineColor, c.hasArrow);

            return newLine;
        };
        //修改连接关系位置（节点移动时）
        c.modifyRelations = function(shape) {
            var n = c.linkLines.length;
            if (n > 0) {
                for (var k = 0; k < n; k++) {
                    if (shape == c.linkLines[k].toShape || shape == c.linkLines[k].fromShape)
                        c.linkLines[k].refershPoints(c.linkLines[k].fromShape, c.linkLines[k].toShape);
                }
            }
        };
        c.modifyLink = function(lineshape, fromShape, toShape) {
            if (lineshape)
                lineshape = c.addRelations(fromShape, toShape, lineshape.Text);
        };

        //两点间有多条连线处理
        c.modifyLinkPoint = function(fromShape, toShape) {
            var links = [];
            for (var i = 0; i < c.linkLines.length; i++) {
                if (c.linkLines[i].flag == null && c.linkLines[i].fromShape == fromShape && c.linkLines[i].toShape == toShape) {
                    // ||(c.linkLines[i].fromShape == toShape && c.linkLines[i].toShape == fromShape)
                    links.push(c.linkLines[i]);
                    c.linkLines[i].flag = 1;
                }
            }
            if (links.length > 1) {
                var n = links.length;


                var w1 = (fromShape.width - 2) / (n - 1);
                var px1 = 2;
                var w2 = (toShape.width - 2) / (n - 1);
                var px2 = 2;
                if (n == 2) {
                    px1 = fromShape.width / 3;
                    px2 = toShape.width / 3;
                    w1 = (fromShape.width) / 3;
                    w2 = (toShape.width) / 3;
                }

                for (var i = 0; i < n; i++) {

                    links[i].fromPoint = {
                        x: px1 - fromShape.width / 2,
                        y: i * 5
                    };

                    links[i].toPoint = {
                        x: px2 - toShape.width / 2,
                        y: i * 5
                    };
                    px1 = px1 + w1;
                    px2 = px2 + w2;
                    links[i].refershPoints(fromShape, toShape);
                }
            }
        };
        c.modifyLinkPoints = function() {
            //  	var links=[];
            //  	var linkIndex=-1;
            //  	var n=c.linkLines.length;
            // for (var i = 0; i <n; i++) {
            // 	if (c.linkLines[i].flag==null)
            // 	{
            // 		for (var j = 0; j < n; j++) {				 
            // 			if (c.linkLines[j].flag==null && 
            // 				c.linkLines[i].fromShape == c.linkLines[j].fromShape && 
            // 				c.linkLines[i].toShape == c.linkLines[j].toShape) {
            // 				c.linkLines[j].flag=1；	
            // 				linkIndex=j;
            // 			}
            // 			if (linkIndex>0)
            // 				links.push(linkIndex);
            // 			linkIndex=-1;
            // 		}
            //     }
            // }

            for (var i = 1; i < c.linkLines.length; i++) {
                if (c.linkLines[i].flag == null)
                    c.modifyLinkPoint(c.linkLines[i].fromShape, c.linkLines[i].toShape);
            }
        };


        //根据Id取shape对象
        c.getShape = function(id) {
            var n = c.linkLines.length;
            for (var i = 0; i < n; i++) {
                if (c.linkLines[i].id == id)
                    return c.linkLines[i];
            }
        };

        //判断鼠标是否在图形内部
        c.getPointShape = function(x, y) {

            var n = c.linkLines.length;
            var shape = null;
            //线对象
            for (var i = 0; i < n; i++) {
                shape = c.linkLines[i]; //.lineShape;
                if (shape.visible && shape.isInside(x, y)) {
                    c.curLinkLine = c.linkLines[i];
                    break;
                } else
                    shape = null;
            }

            c.selectedLine = shape;
            return shape;
        };

        c.draw = function(ctx) {
            // var n = c.lines.length;
            // for (var i = 0; i < n; i++)
            // 	c.lines[i].draw(ctx);

            var n = c.linkLines.length;
            for (var i = 0; i < n; i++)
                c.linkLines[i].draw(ctx);

        };
        return c;
    }
};

/*-*/
WebGraph.Model.linkLine = {
    createNew: function() {
        var c = WebGraph.Shape.Polyline.createNew(); //{};//
        //连接线集合connectio 连接;联系，关系;连接点;亲戚
        //c.webCanvas = null; 
        c.strokePattern = 0; //大于0虚线//stroke-dasharray  虚线设置（5,5）
        c.ShapeType = "连接线"
        c.lineType = "1"; //线类型 1=直线和 2=三折线  3=贝赛尔曲线
        c.lineColor = "SteelBlue";
        c.hasArrow = false; //是否有箭头 
        c.fromPoint = { x: 0, y: 0 }; //相对位置才
        c.toPoint = { x: 0, y: 0 }; //相对位置，偏移量
        c.fromShape = null;
        c.toShape = null;
        c.useCrossPoint = true;
        c.flag = null; //临时变量
        //初始化函数
        c.setFromPoint = function(fromShape, mouseX, mouseY) {
            //
            if (fromShape)
                c.fromPoint = { x: mouseX - (fromShape.x + fromShape.width / 2), y: mouseY - (fromShape.y + fromShape.height / 2) };
            else {
                c.fromPoint = { x: mouseX, y: mouseY };
                c.fromShape = fromShape;
            }
        };


        c.setToPoint = function(toShape, mouseX, mouseY) {
            //	
            if (toShape)
                c.toPoint = { x: mouseX - (toShape.x + toShape.width / 2), y: mouseY - (toShape.y + toShape.height / 2) };
            else {
                c.toPoint = { x: mouseX, y: mouseY };
                c.toShape = toShape;
            }
        };

        // c.modifyLink = function(linkLine,fromShape,toShape) {			 
        // 	if (lineshape)
        // 		lineshape = c.initLine(fromShape, toShape, lineshape.Text);

        // };
        c.refershPoints = function(fromShape, toShape) {
            return c.initLine(fromShape, toShape, c.Text, c.lineType, c.strokeWidth, c.lineColor, c.hasArrow);
        };
        c.initLine = function(fromShape, toShape, name, lineType, strokeWidth, lineColor, hasArrow) {
            var shapeSpace = 0;
            c.fromShape = fromShape;
            c.toShape = toShape;
            var fromId = "A1-";
            var toId = "-Z1";
            c.lineType = lineType;
            if (strokeWidth == null) strokeWidth = 3;
            c.strokeWidth = strokeWidth;
            c.lineColor = lineColor;
            c.hasArrow = hasArrow;
            c.showEndArrow = hasArrow;

            //c.editSize=true;	 
            if (name)
                c.Text = name;
            c.id = lineId;
            var points = "";
            var pointsList = [];
            var fromX = 0;
            var fromY = 0;
            var fromW = 0;
            var fromH = 0;
            var toX = 0;
            var toY = 0;
            var toW = 0;
            var toH = 0;
            if (fromShape) {
                fromId = fromShape.id;
                fromX = fromShape.x;
                fromY = fromShape.y;
                fromW = fromShape.width;
                fromH = fromShape.height;
            }
            if (toShape) {
                toId = toShape.id;
                toX = toShape.x;
                toY = toShape.y;
                toW = toShape.width;
                toH = toShape.height;
            }
            if (toX == 0)
                toX = fromX + fromW / 2;
            if (toY == 0)
                toY = fromY + fromH * 2;

            c.fromId = fromId;
            c.toId = toId;
            var lineId = "line_" + fromId + "_" + toId;
            switch (c.lineType) {
                case '1':
                case '2':
                    // 连接线(直线)
                    if (c.lineType == "1") {
                        var x1 = fromX + fromW / 2 + c.fromPoint.x;
                        var y1 = fromY + fromH / 2 + c.fromPoint.y;
                        var x2 = toX + toW / 2 + c.toPoint.x;
                        var y2 = toY + toH / 2 + c.toPoint.y;
                        pointsList.push({ x: x1, y: y1 });
                        pointsList.push({ x: x2, y: y2 });
                    }
                    // 连接线(三折线)
                    if (c.lineType == "2") {
                        //折线垂直间距中心
                        shapeSpace = (toY - fromY - fromH) / 2;

                        var x1 = fromX + fromW / 2 + c.fromPoint.x;
                        var y1 = fromY + fromH / 2 + c.fromPoint.y;
                        var x2 = toX + toW / 2 + c.toPoint.x;
                        var y2 = fromY + fromH + shapeSpace;
                        var y3 = toY - shapeSpace;
                        var y4 = toY + fromH / 2 + c.toPoint.y;

                        pointsList.push({ x: x1, y: y1 });
                        pointsList.push({ x: x1, y: y2 });
                        pointsList.push({ x: x2, y: y2 });
                        pointsList.push({ x: x2, y: y3 });
                        pointsList.push({ x: x2, y: y4 });
                        // 	case TreeDirection.Vertical:
                        // 		p1 = new PointF(from.Left + from.Width/2, from.Top - (from.Top - to.Bottom)/2); 
                        // 		p2 = new PointF(to.Left + to.Width/2, from.Top - (from.Top - to.Bottom)/2);
                        // 	case TreeDirection.Horizontal:
                        // 		p1 = new PointF(to.Right + (from.Left - to.Right)/2, from.Top + from.Height/2); 
                        // 		p2 = new PointF(to.Right + (from.Left - to.Right)/2, to.Top + to.Height/2);
                        // 		g.DrawLine(pen, Start,p1);
                        // 		g.DrawLine(pen, p1, p2);
                        // 		g.DrawLine(pen, End, p2);	
                    }

                    break;
                case '3':
                    var x1 = fromX + fromW / 2 + c.fromPoint.x;
                    var y1 = fromY + fromH / 2 + c.fromPoint.y;
                    var x2 = toX + toW / 2 + c.toPoint.x;
                    var y2 = fromY - (fromY - toY - toH) / 2;
                    var x3 = toX + toW / 2;
                    var y3 = fromY - (fromY - toY) / 2;
                    var x4 = toX + toW / 2 + c.toPoint.x;
                    var y4 = toY + c.toPoint.y;
                    pointsList.push({ x: x1, y: y1 });
                    pointsList.push({ x: x2, y: y2 });
                    pointsList.push({ x: x3, y: y3 });
                    pointsList.push({ x: x4, y: y4 });
                    break;
                case '4': //自定义

                    break;
            }
            var n = pointsList.length;
            //使用线与节点相交的点作为终点或起点
            if (c.useCrossPoint == true) {
                var pt;
                if (fromShape) {
                    //取相交点
                    pt = c.getCrossPoint(pointsList[0].x, pointsList[0].y, pointsList[1].x, pointsList[1].y, fromShape);
                    pointsList[0].x = pt.x;
                    pointsList[0].y = pt.y;
                }
                if (toShape) {
                    pt = c.getCrossPoint(pointsList[n - 2].x, pointsList[n - 2].y, pointsList[n - 1].x, pointsList[n - 1].y, toShape);
                    pointsList[n - 1].x = pt.x;
                    pointsList[n - 1].y = pt.y;
                }
            }
            //转换成字符串坐标
            for (var i = 0; i < n; i++) {
                points = points + pointsList[i].x + "," + pointsList[i].y;
                if (i != n - 1)
                    points = points + " ";
            };
            //初始线
            c.init(points, c.strokeWidth, c.lineColor);
            return c;
        };
        c.changeLink = function(lineshape, fromShape, toShape) {
            if (lineshape) {
                lineshape = c.initLine(fromShape, toShape, lineshape.Text, lineshape.lineType, lineshape.strokeWidth, lineshape.lineColor, lineshape.hasArrow);
            }
        };
        //取线和节点相交的点
        c.getCrossPoint = function(x1, y1, x2, y2, toShape) {
            var pt;
            var p1 = { x: x1, y: y1 };
            var p2 = { x: x2, y: y2 };
            if (toShape == null)
                return p2;
            var pts = [];
            var xy_Offset = 4; //边框放大 
            pts.push({ x: toShape.x - xy_Offset, y: toShape.y - xy_Offset });
            pts.push({ x: toShape.x + toShape.width + xy_Offset, y: toShape.y - xy_Offset });
            pts.push({ x: toShape.x + toShape.width + xy_Offset, y: toShape.y + toShape.height + xy_Offset });
            pts.push({ x: toShape.x - xy_Offset, y: toShape.y + toShape.height + xy_Offset });

            for (i = 0; i < 4; i++) {
                if (i == 3) //计算交点
                    pt = WebGraph.Math.segmentsIntr(p1, p2, pts[3], pts[0]);
                else
                    pt = WebGraph.Math.segmentsIntr(p1, p2, pts[i], pts[i + 1]);
                if (pt != false)
                    break;
            }
            if (pt != false)
                return pt;
            else
                return p2;
        };
        c.draw = function(ctx) {
            if (c.visible == false) return;
            var ps = this.points.split(" ");
            if (ps != null) {
                ctx.save();
                ctx.strokeStyle = c.lineColor;
                ctx.lineWidth = c.strokeWidth;
                if (this.selected) {
                    ctx.strokeStyle = this.selectedStroke;
                    //ctx.lineWidth = this.strokeWidth;
                }
                if (this.selected == false && this.hovered == false)
                    ctx.strokeStyle = c.lineColor;
                if (this.hovered) {
                    ctx.strokeStyle = this.hoverStroke;
                    //ctx.lineWidth = this.strokeWidth;
                }
                ctx.beginPath();
                switch (c.lineType) {
                    case '1':
                    case '2':
                        var pt;
                        for (var i = 0; i < ps.length; i++) {
                            var p = ps[i].split(",");
                            //虚线
                            // if (c.strokePattern>0)
                            //       {
                            // 		if (pt) {
                            // 			var pattern = c.strokePattern;
                            // 			var fromX = p[0];
                            // 			var toX = pt[0];
                            // 			var fromY = p[1];
                            // 			var toY = pt[1];
                            // 			var dx = (toX - fromX);
                            // 			var dy = (toY - fromY);
                            // 			var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
                            // 			var dashlineInteveral = (pattern <= 0) ? distance : (distance / pattern);
                            // 			var deltay = (dy / distance) * pattern;
                            // 			var deltax = (dx / distance) * pattern;
                            // 			// draw dash line 
                            // 			//ctx.beginPath();
                            // 			for (var dl = 0; dl < dashlineInteveral; dl++) {
                            // 				if (dl % 2) {
                            // 					ctx.lineTo(fromX + dl * deltax, fromY + dl * deltay);
                            // 				} else {
                            // 					ctx.moveTo(fromX + dl * deltax, fromY + dl * deltay);
                            // 				}
                            // 			}
                            // 		}
                            //       	 //WebGraph.Drawing2D.dashedLine(ctx, p[0], p[1],  pt[0], pt[1], c.strokePattern) ;
                            //                     pt=p;
                            // }
                            //   	else
                            //   	{
                            if (i == 0)
                                ctx.moveTo(p[0], p[1]);
                            else
                                ctx.lineTo(p[0], p[1]);
                            // }
                        }
                        //ctx.closePath();				 
                        break;
                    case '3':
                        var p = ps[0].split(",");
                        //ctx.beginPath();
                        ctx.moveTo(p[0], p[1]); //开始点
                        p = ps[1].split(",");
                        var x2 = p[0];
                        var y2 = p[1];
                        p = ps[2].split(",");
                        var x3 = p[0];
                        var y3 = p[1];
                        p = ps[3].split(",");
                        var x4 = p[0];
                        var y4 = p[1];
                        ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
                        break;
                }
                ctx.stroke();
                //画箭头
                ctx.fillStyle = ctx.strokeStyle;
                if (c.showEndArrow) {
                    var p1 = ps[ps.length - 2].split(",");
                    var p2 = ps[ps.length - 1].split(",");
                    WebGraph.Drawing2D.drawArrow(ctx, p1[0], p1[1], p2[0], p2[1], c.arrowLenght, c.arrowHeight, c.arrowDeepin);
                }

                if (c.showStartArrow) {
                    var p1 = ps[1].split(",");
                    var p2 = ps[0].split(",");
                    WebGraph.Drawing2D.drawArrow(ctx, p1[0], p1[1], p2[0], p2[1], c.arrowLenght, c.arrowHeight, c.arrowDeepin);
                }

                if (c.Text) {
                    var p1 = ps[0].split(",");
                    var p2 = ps[ps.length - 1].split(",");
                    var tx = (parseInt(p1[0]) + parseInt(p2[0])) / 2;
                    var ty = (parseInt(p1[1]) + parseInt(p2[1])) / 2;

                    var text = WebGraph.Shape.Text.createNew();

                    text.Text = c.Text;
                    text.fill = "#000000";
                    text.strokeWidth = 0;
                    text.textAnchor = "center";
                    text.fontSize = c.fontSize;
                    //var len=c.Text.length;
                    var metrics = ctx.measureText(c.Text);
                    var textWidth = metrics.width;
                    text.x = tx - textWidth / 2;
                    text.y = ty - 4;
                    text.width = textWidth + 10;
                    text.height = 30;
                    text.draw(ctx);
                }
                //画选择器
                if (c.selector && c.selector.visible)
                    c.selector.draw(ctx, 0, 0);
                ctx.restore();
            }
        };
        return c;
    }
};
/*-*/
WebGraph.Model.linkPoints = {
    createNew: function() {
        var s = WebGraph.Model.Element.createNew();
        s.ShapeType = "连接点集合";
        s.targetShape = null;
        s.curLinkPoint = null;
        s.selectedLinkPoint = null;
        s.list = [];
        s.canvas = null;
        s.ctx = null;
        s.visible = true;
        s.webCanvas = null;
        //初始化函数
        s.init = function(webCanvas) {
            s.webCanvas = webCanvas;
            s.canvas = webCanvas.canvas;
            s.ctx = webCanvas.context;
            s.targetShape = webCanvas.selectedShape;
            s.rotate = s.targetShape.rotate;

            s.strokeWidth = 1;
            s.stroke = "green";
            s.fill = "red";
            if (s.list.length == 0) {
                //构造4个连接点 
                for (var i = 0; i < 4; i++) {
                    var lp = WebGraph.Model.linkPoint.createNew();
                    lp.targetShape = s.targetShape;
                    lp.index = i;
                    s.list.push(lp);
                }
            }

            s.showLinkPoint();
        };
        s.refersh = function(x, y) {

        };

        s.initLinkPoint = function(x, y) {
            var sX = x - BOX_SIZE / 2;
            var sY = y - BOX_SIZE / 2;
            var sW = s.targetShape.width;
            var sH = s.targetShape.height;
            var hB = BOX_SIZE / 2;
            var arrPosX = new Array(sX + sW / 2, sX + sW - hB, sX + sW / 2, sX + hB);
            var arrPosY = new Array(sY + hB, sY + sH / 2, sY + sH - hB, sY + sH / 2);
            for (var i = 0; i < 4; i++) {
                s.list[i].setBounds(arrPosX[i], arrPosY[i], BOX_SIZE, BOX_SIZE);
            }
        };
        s.init2LinkPoint = function(x, y) {
            var sX = x - BOX_SIZE / 2;
            var sY = y - BOX_SIZE / 2;
            var sW = s.targetShape.width;
            var sH = s.targetShape.height;
            var hB = BOX_SIZE / 2;
            var arrPosX = new Array(sX, sX + sW);
            var arrPosY = new Array(sY, sY);
            for (var i = 0; i < 2; i++) {
                s.list[i].setBounds(arrPosX[i], arrPosY[i], BOX_SIZE, BOX_SIZE);
            }
        };
        var startPoint = null;
        s.mouseDown = function(e) {
            // startPoint={X:x,Y:y}; 
            if (s.selectedLinkPoint)
                s.selectedLinkPoint.selected = false;
            if (s.webCanvas.canvas.style.cursor == 'crosshair') {
                s.webCanvas.operateState = 'link';
                s.selectedLinkPoint = s.curLinkPoint;
                s.selectedLinkPoint.selected = true;
            }

        };

        s.mouseUp = function(e) {
            // dragging = false;
            // s.webCanvas.operateState = 'none'; 
            s.webCanvas.operateState = 'none';
        };

        s.mouseMove = function(e, x, y) {
            // s.canvas.style.cursor='default'; 	
            // s.curLinkPoint=null;
            // s.webCanvas.operateState='none';
            if (s.curLinkPoint != null)
                s.curLinkPoint.hovered = false;
            s.curLinkPoint = null;
            for (var i = 0; i < 4; i++) {
                if (s.list[i].isInside(x, y)) {
                    s.curLinkPoint = s.list[i];
                    s.curLinkPoint.hovered = true;
                    s.webCanvas.draw();
                    s.webCanvas.canvas.style.cursor = 'crosshair';
                    break;
                }
            }
        };

        var BOX_SIZE = 6;
        var MIN_SIZE = 10;

        s.showLinkPoint = function() {
            s.visible = true;
            if (s.targetShape != null) {
                for (var i = 0; i < 4; i++) {
                    s.list[i].setVisible(true);
                }
                s.webCanvas.draw();
            }
        };

        s.hideLinkPoint = function() {
            s.visible = false;
            for (var i = 0; i < 4; i++) {
                s.list[i].setVisible(false);
            }
            s.webCanvas.draw();
        };


        //判断鼠标是否在图形内部
        s.isInside = function(x, y) {

            s.x = s.targetShape.x - BOX_SIZE;
            s.y = s.targetShape.y - TOP_OFF;
            s.width = s.targetShape.width + BOX_SIZE + BOX_SIZE;
            s.height = s.targetShape.height + TOP_OFF + BOX_SIZE;;
            if (x >= s.x && x <= (s.x + s.width) &&
                y >= s.y && y <= (s.y + s.height)
            ) { return true; } else { return false; }

        };

        s.draw = function(ctx, cx, cy) {
            s.initLinkPoint(cx, cy);
            ctx.save();
            //旋转
            // var rx = s.targetShape.x;
            // var ry = s.targetShape.y;

            // var cx=0;
            // var cy=0;

            // if (s.targetShape.rotate != 0) {
            // 	// ctx.translate(s.targetShape.x + s.targetShape.width / 2, s.targetShape.y + s.targetShape.height / 2);
            // 	// ctx.rotate(s.targetShape.rotate * Math.PI / 180);
            // 	cx = s.targetShape.x + s.targetShape.width / 2;
            // 	cy = s.targetShape.y + s.targetShape.height / 2; 
            // }

            ctx.translate(0.5, 0.5); //变换矩阵画细线
            ctx.lineWidth = 1;
            // ctx.strokeStyle =s.stroke; 
            // ctx.fillStyle =s.fill; 	 

            //画连接点
            for (var i = 0; i < 4; i++)
                s.list[i].draw(ctx, 0, 0);


            ctx.restore();
        };


        return s;
    }
};

/*-*/
WebGraph.Model.linkPoint = {
    createNew: function() {
        //继承
        var me = WebGraph.Model.Element.createNew();
        me.ShapeType = "连接点";
        me.targetShape = null;
        me.cursor = "none";
        me.index = -1;
        me.visible = true;
        me.ctx = null;
        //初始化函数
        me.init = function(x, y, width, height, strokeWidth, strokeColor, fillColor) {
            me.x = x;
            me.y = y;
            me.width = width;
            me.height = height;
            me.strokeWidth = strokeWidth;
            me.stroke = strokeColor;
            me.fill = fillColor;
        };

        me.setBounds = function(x, y, width, height) {
            me.x = x;
            me.y = y;
            me.width = width;
            me.height = height;
        };
        me.setVisible = function(yn) {
            me.visible = yn;
            // me.draw(me.ctx);
        };

        //判断鼠标是否在图形内部
        me.isInside = function(mx, my) {
            var x = mx;
            var y = my;
            //如果旋转
            if (me.targetShape.rotate != 0) {
                var p = getRotatePoint({
                    x: mx,
                    y: my
                }, {
                    x: me.targetShape.x + me.targetShape.width / 2,
                    y: me.targetShape.y + me.targetShape.height / 2
                }, -me.targetShape.rotate);
                x = -p.x + (me.targetShape.x + me.targetShape.width / 2);
                y = -p.y + (me.targetShape.y + me.targetShape.height / 2);

            }
            if (x >= me.x - 2 && x <= (me.x + me.width + 4) && y >= me.y - 2 && y <= (me.y + me.height + 4)) {
                return true;
            } else {
                return false;
            }

        };


        me.draw = function(ctx, cx, cy) {
            if (me.visible) {
                me.ctx = ctx;
                ctx.save();
                if (me.hovered) {
                    ctx.strokeStyle = me.hoverStroke;
                    ctx.fillStyle = me.hoverStroke;
                    ctx.lineWidth = me.strokeWidth;
                }
                // if (me.selected) {
                // 	ctx.strokeStyle = me.selectedStroke;
                // 	ctx.lineWidth = me.strokeWidth ;
                // }
                if (me.hovered == false) {
                    ctx.strokeStyle = me.stroke;
                    ctx.fillStyle == me.stroke;
                }


                if (me.selected)
                    ctx.fillStyle = "red";
                // else
                // 	ctx.fillStyle= me.stroke;

                ctx.fillRect(me.x - cx, me.y - cy, me.width, me.height);
                //实践表明在不设施strokeStyle下的默认strokeStyle=black
                ctx.strokeRect(me.x - cx, me.y - cy, me.width, me.height);

                ctx.restore();
            }

        };


        return me;
    }
}

/*-*/

/* Web拓扑图形组件
 *作者： 刘金山
 *日期： 2014-07-01
 */


//矩形对象
WebGraph.Shape.Rect = {
    createNew: function(id) {
        var me = WebGraph.Shape.ShapeBase.createNew();
        me.shapeType = "rect";
        me.rx = 0;
        me.ry = 0;
        me.image = null; //单个背景图片
        me.imageSrc = null;
        me.images = null; //多个背景图片,指定位置大小
        me.draw = function(ctx) {

            if (!me.visible) {
                return;
            }
            ctx.save();
            var xy = me.initContext(ctx);
            var rx = xy.X;
            var ry = xy.Y;
            var isFill = false; //是否填充
            var isStroke = false; //是否画边框
            if (me.fill)
                isFill = true;
            if (me.stroke)
                isStroke = true;

            //如果是图片
            if (me.image == null && me.imageSrc) {
                me.image = new Image();
                me.image.src = me.imageSrc;
                me.image.onload = function() {
                    ctx.drawImage(me.image, rx, ry, me.width, me.height);
                }
                me.image.onerror = function() {
                    me.image = null;
                    me.imageSrc = null;
                }
            }

            if (me.image && me.imageSrc) {
                ctx.drawImage(me.image, rx, ry, me.width, me.height);
                if (me.hovered || me.selected) {
                    //ctx.globalAlpha =0.2;
                    //ctx.strokeRect(rx, ry, me.width, me.height);
                    WebGraph.Drawing2D.roundRect(ctx, rx - 2, ry - 2, me.width + 4, me.height + 4, 5, false, true);
                }
            } else {
                if (me.rx > 0) //圆角矩形
                    WebGraph.Drawing2D.roundRect(ctx, rx - 2, ry - 2, me.width + 4, me.height + 4, me.rx, isFill, isStroke);
                else
                    WebGraph.Drawing2D.Rect(ctx, rx - 2, ry - 2, me.width + 4, me.height + 4, isFill, isStroke);
            }

            if (me.images) {
                for (var i = 0; i < me.images.length; i++) {
                    //{image:"","x":"0","y":"0","width":"8","height":"8"}
                    //ctx.drawImage(me.images[i].image, me.images[i].x, me.images[i].y, me.images[i].width,me.images[i].height);
                    ctx.drawImage(me.images[i].image, rx + me.images[i].x, ry + me.images[i].y, me.images[i].width, me.images[i].height);

                }

            }

            // ctx.restore();
            // ctx.save();
            //如果有分组
            if (me.backShapes) {
                var n = me.backShapes.length;
                for (var i = 0; i < n; i++)
                    me.backShapes[i].draw(ctx);
            }


            //画图形内部对象[在外部实现]
            me.drawChilds(ctx, rx, ry, me.width, me.height);
            //画上下左右中文本
            me.draw5Text(me, rx, ry, ctx);
            //画选择器
            if (me.allowActive && me.selector && me.selector.visible)
                me.selector.draw(ctx, rx, ry);
            //画连接点
            // if (me.linkPoints && me.linkPoints.visible)
            // {
            // 	if (me.hovered || me.selected)
            // 	    me.linkPoints.draw(ctx, rx, ry);
            //     }
            ctx.restore();
            // if (me.selected || me.hovered){			 
            // if (me.groups&& me.groups.length > 0){
            //	 for (var i = me.groups.length - 1; i >= 0; i--)  
            //		me.groups[i].draw(ctx); 
            //	}
            // }
            //     		if (me.hovered) 
            //   { hoverImage(ctx,rx, ry, me.width, me.height);
            // ctx.strokeRect(rx, ry, me.width, me.height);}
        };

        return me;
    }
};

//图片对象
WebGraph.Shape.Image = {
    createNew: function() {
        //继承
        var me = WebGraph.Shape.ShapeBase.createNew();
        me.shapeType = "image";
        me.href = "images/jinxiangui.png";
        me.image = null;
        //初始化函数
        me.init = function(x, y, w, h, strokeWidth, strokeColor, href) {
            me.x = x;
            me.y = y;
            me.width = w;
            me.height = h;
            me.strokeWidth = strokeWidth;
            me.stroke = strokeColor;
            me.href = "images/jinxiangui.png";
        };

        me.draw = function(ctx) {
            ctx.save();
            var xy = me.initContext(ctx);
            var rx = xy.X;
            var ry = xy.Y;

            //如果是图片
            if (me.imageSrc) {
                if (me.image == null) {
                    me.image = new Image();
                    me.image.src = me.imageSrc;
                }
                ctx.drawImage(me.image, rx, ry, me.image.width, me.image.height);
            }

            if (me.hovered || me.selected)
                ctx.strokeRect(rx, ry, me.width, me.height);
            //画上下左右中文本
            me.draw5Text(me, rx, ry, ctx);
            //画图形内部对象[在外部实现]
            me.drawChilds(ctx, rx, ry, me.width, me.height);
            //画选择器
            if (me.selector && me.selector.visible)
                me.selector.draw(ctx, rx, ry);
            //画连接点  
            if (me.selected && me.linkPoints && me.linkPoints.visible)
                me.linkPoints.draw(ctx, rx, ry);
            ctx.restore();
        };

        // me.ToString = function() {
        // 	return '<image ' + me.getString() + ' xlink:href=' + me.href + ' />';
        // };		
        return me;
    }
};

//文本对象
WebGraph.Shape.Text = {
    createNew: function() { //var cat = {};
        //继承
        var t = WebGraph.Model.Element.createNew();
        t.shapeType = "文本";
        t.textItems = null;
        t.rowHeight = 14;
        t.startX = t.x;
        t.endY = t.y;
        // t.font = "12px 宋体";
        // t.fontFamily = "serif";
        //	t.fontSize = "12";
        // Canvas中有对文本对齐方式的支持,包括两个选项：水平Horizontal alignment与竖直Vertical alignment；
        // context.textAlign：文字水平对齐方式。可取属性值: start, end, left,right, center。默认值:start.
        // context.textBaseline：文字竖直对齐方式。可取属性值：top, hanging, middle,alphabetic, ideographic, bottom。默认值：alphabetic.
        t.textBaseline = "alphabetic";
        t.textAnchor = "center"; //start, end, left,right, center。默认值:start
        t.wrapLine = false;
        t.init = function(x, y, w, h, text, fontFamily, fontSize, textAnchor, fillColor) {
            t.x = x;
            t.y = y;
            t.width = w;
            t.height = h;
            t.Text = text;
            t.fontFamily = fontFamily;
            t.fontSize = fontSize;
            t.textAnchor = textAnchor;
            t.fill = fillColor;
        };
        //判断鼠标是否在图形内部
        t.isInside = function(mx, my) {
            var x = mx;
            var y = my;
            var h = 0;

            if (t.selector) h = 15
                //如果旋转
            if (t.rotate != 0) {
                var rotatePoint = WebGraph.Math.getRotatePoint({ x: mx, y: my }, { x: t.x + t.width / 2, y: t.y + t.height / 2 }, -t.rotate);
                x = rotatePoint.x;
                y = rotatePoint.y;
            }

            if (x >= t.x - 2 && x <= (t.x + t.width + 4) && y >= t.y - 2 - h && y <= (t.y + t.height + 4 + h)) {
                return true;
            } else {
                return false;
            }
        };
        //文本换行函数

        t.wrapText = function(context, text, x, y, maxWidth, lineHeight) {
            var textRows = text.split("\n");
            var offsetY = y
            var line = "";
            var metrics;
            var rows = [];
            var words;
            for (var m = 0; m < textRows.length; m++) {
                words = textRows[m].split("");

                for (var n = 0; n < words.length; n++) {
                    line = line + words[n];
                    metrics = context.measureText(line);
                    if (metrics.width + 10 > maxWidth) {
                        rows.push(line);
                        line = "";
                    }
                }
                if (line.length > 0)
                    rows.push(line);
                line = "";
            }
            if (rows.length > 1 && t.textAnchor == "center") {
                offsetY -= lineHeight * (rows.length - 1);
                if (offsetY < y - t.height / 2)
                    offsetY = y - t.height / 2 + 2;
            }

            for (var n = 0; n < rows.length; n++) {
                if (offsetY - y < t.height) {
                    context.fillText(rows[n], x, offsetY); // - 1.5*lineHeight
                    offsetY += 1.2 * lineHeight;
                }
            }
        };
        // t.wrapText =function (context, text, x, y, maxWidth, lineHeight) {
        // 	var words = text.split(" ");
        // 	var line = "";
        // 	for (var n = 0; n < words.length; n++) {
        // 		var testLine = line + words[n] + " ";
        // 		var metrics = context.measureText(testLine);
        // 		var testWidth = metrics.width;
        // 		if (testWidth > maxWidth) {
        // 			context.fillText(line, x, y);
        // 			line = words[n] + " ";
        // 			y += lineHeight;
        // 		} else {
        // 			line = testLine;
        // 		}
        // 	}
        // 	context.fillText(line, x, y);
        // };
        //		t.wrapText = function(context, text, x, y, maxWidth,maxHeight, lineHeight) {
        //				var textRows=text.split("\n");
        //				var offsetY=y
        //				var line = ""; 
        //				var metrics; 
        //				var rows=[];
        //				var words;
        //				for (var m = 0; m < textRows.length; m++) {
        //					 words =textRows[m].split("");
        //					 
        //					for (var n = 0; n < words.length; n++) {
        //						 line = line + words[n];
        //						 metrics = context.measureText(line);
        //						 if (metrics.width+10 > maxWidth) {
        //							rows.push(line); 
        //							line =""; 
        //						}  
        //					}
        //				    if (line.length>0)
        //					   rows.push(line); 
        //					 line ="";				 
        //			}
        //				
        //			if (rows.length>1 )  //&& t.textAnchor == "center"
        //             { 
        //              	x=x+maxWidth/2+3;
        //               offsetY -= lineHeight*(rows.length-1);
        //               if (offsetY<y-t.height/2)
        //               	offsetY=y-t.height/2+5;
        //               	
        //                   if (offsetY<y) offsetY=y+lineHeight;
        //             }
        //		     
        //		    
        //			for (var n = 0; n < rows.length; n++) {
        //			if (offsetY-y<t.height)
        //			{				
        //			   context.fillText(rows[n], x, offsetY);// - 1.5*lineHeight
        //			   offsetY += 1.1*lineHeight;
        //			  }
        //			}			 
        //		};
        // t.wrapTextOld = function(ctx, text) {
        // 	var words = text.split("\n");

        // 	var metrics = ctx.measureText(text);
        // 	if (metrics.width > t.width-20) {
        // 		var n = text.length;
        // 		var wordWidth = metrics.width / n; //单词宽度
        // 		var wordCount = parseInt(t.width / wordWidth) - 1; //个数
        // 		var rowCount = metrics.width / t.width; //分行
        // 		var startLocation = 0; //分行位置
        // 		var wrapText = [];
        // 		var offsetY = t.y;
        // 		for (var ii = 0; ii < rowCount; ii++) {
        // 			wrapText.push(text.substr(startLocation, wordCount));
        // 			startLocation = startLocation + wordCount;
        // 			//如果是最后行
        // 			if (wordCount + startLocation > text.length)
        // 				wordCount = text.length - startLocation;
        // 		}
        // 		for (var i = 0; i < wrapText.length; i++) {
        // 			ctx.fillText(wrapText[i], t.x, offsetY);
        // 			offsetY = offsetY + 20;
        // 		}

        // 	} else
        // 		ctx.fillText(text, t.x, t.y);
        // };
        t.draw = function(ctx) {
            ctx.save();
            // 设置渐变色
            if (t.linearGradient)
                ctx.fillStyle = t.linearGradient;
            else
                ctx.fillStyle = t.fill; //设置纯色
            if (t.shadow) {
                ctx.shadowOffsetX = t.shadowOffsetX;
                ctx.shadowOffsetY = t.shadowOffsetY;
                ctx.shadowBlur = t.shadowBlur;
                ctx.shadowColor = t.shadowColor;
            }

            ctx.strokeStyle = t.stroke;
            ctx.lineWidth = t.strokeWidth;
            ctx.font = t.font; //设置字体样式
            ctx.textAlign = t.textAnchor; //:水平对齐方式      start、end、right、center
            ctx.textBaseline = t.textBaseline;
            t.startX = t.x;
            t.endY = t.y;
            if (ctx.textAlign == "center")
                t.startX = t.x + t.width / 2;
            if (ctx.textBaseline == "alphabetic")
                t.endY = t.y + t.height / 2 + 2;

            if (t.textItems && t.textItems.length > 0) {
                var offsetY = t.endY;
                var lineHeight = t.rowHeight;
                for (var n = 0; n < t.textItems.length; n++) {
                    if (offsetY - t.endY < t.height) {
                        ctx.fillText(t.textItems[n], t.startX, offsetY); // - 1.5*lineHeight
                        offsetY += 1.2 * lineHeight;
                    }
                }
            } else {
                if (t.Text && t.Text.length > 0) {
                    if (t.wrapLine)
                        t.wrapText(ctx, t.Text, t.startX, t.endY, t.width, t.rowHeight);
                    else
                        ctx.fillText(t.Text, t.startX, t.endY);
                }
            }
            ctx.restore();
        };
        t.ToString = function() {
            return '<text ' + t.getString() + ' font-family=' + t.fontFamily + ' font-size=' + t.fontSize + ' text-anchor=' + t.textAnchor + '>' + t.Text + '</text>';
        };
        return t;
    }
};


//椭圆形对象
WebGraph.Shape.Ellipse = {
    createNew: function() {
        var me = WebGraph.Shape.ShapeBase.createNew();
        me.shapeType = "ellipse";
        me.cx = 10;
        me.cy = 10;
        me.a = 10; //a,b分别为椭圆横半轴、纵半轴长度，不可同时为0
        me.b = 10;
        me.xyIsOrigin = false; //x,y 是否是原点，默认是否，需要转换
        //判断鼠标是否在图形内部
        me.isInside = function(mx, my) {
            var x = mx;
            var y = my;
            var h = 0;
            var xx = me.x;
            var yy = me.y;
            var hh = me.height;
            var ww = me.width;
            if (me.xyIsOrigin) {
                xx = me.x - me.height / 2;
                yy = me.y - me.width / 2;
                hh = me.height * 2;
                ww = me.width * 2;
            }

            if (x >= xx - 2 && x <= (xx + ww + 4) && y >= yy - 2 - h && y <= (yy + ww + 4 + h)) {
                return true;
            } else {
                return false;
            }
        };
        me.draw = function(ctx) {
            if (me.xyIsOrigin) {
                me.cx = me.x;
                me.cy = me.y;
                me.a = me.width;
                me.b = me.height;
            } else {
                me.cx = me.x + me.width / 2;
                me.cy = me.y + me.height / 2;
                me.a = me.width / 2;
                me.b = me.height / 2;
            }
            ctx.save();
            var xy = me.initContext(ctx);
            var rx = xy.X;
            var ry = xy.Y;
            WebGraph.Drawing2D.ParamEllipse(ctx, me.cx, me.cy, me.a, me.b);
            if (me.fill)
                ctx.fill();

            //画上下左右中文本
            me.draw5Text(me, rx, ry, ctx);
            //画图形内部对象[在外部实现]
            me.drawChilds(ctx, rx, ry, me.width, me.height);
            //画选择器
            if (me.selector && me.selector.visible)
                me.selector.draw(ctx, rx, ry);
            //画连接点  
            if (me.selected && me.linkPoints && me.linkPoints.visible)
                me.linkPoints.draw(ctx, rx, ry);
            ctx.restore();
        };
        // me.ToString = function() {
        // 	return '<circle ' + me.getString() + ' cx=' + me.cx + ' cy=' + me.cy + ' r=' + me.r + '  />';
        // };
        return me;
    }
};

//圆形对象
WebGraph.Shape.Circle = {
    createNew: function() {
        var me = WebGraph.Shape.ShapeBase.createNew();
        me.shapeType = "circle";
        me.cx = 10;
        me.cy = 10;
        me.r = 10; //半径 
        //初始化函数
        me.init = function(cx, cy, r, strokeWidth, strokeColor, fillColor) {
            me.width = 2 * r;
            me.height = 2 * r;
            me.x = cx - r;
            me.y = cy - r;
            me.strokeWidth = strokeWidth;
            me.stroke = strokeColor;
            me.fill = fillColor;
            me.cx = cx;
            me.cy = cy;
            me.r = r;
        };

        // //判断鼠标是否在图形内部
        // me.isInside = function(mx, my) {
        // 	var x=mx;
        // 	var y=my;
        // 	var h=0;

        // 	if (me.selector) h=15
        // 	//如果旋转
        // 	if (me.rotate != 0){       
        //         var rotatePoint=WebGraph.Math.getRotatePoint({x:mx,y:my},{x:me.x+me.width/2,y:me.y+me.height/2},-me.rotate);
        //         x=rotatePoint.x;
        //         y=rotatePoint.y;				 
        // 	}

        // 	if (x >= me.x - 2 && x <= (me.x + me.width + 4) && y >= me.y - 2-h && y <= (me.y + me.height + 4+h)) {
        // 		return true;
        // 	} else {
        // 		return false;
        // 	}
        // };
        me.draw = function(ctx) {
            me.cx = me.x + me.width / 2;
            me.cy = me.y + me.height / 2;
            me.r = me.width / 2;

            ctx.save();
            var xy = me.initContext(ctx);
            var rx = xy.X;
            var ry = xy.Y;

            // WebGraph.Drawing2D.EvenCompEllipse(ctx, me.cx, me.cy, me.r, me.r);//ParamEllipse 

            WebGraph.Drawing2D.ParamEllipse(ctx, me.cx, me.cy, me.r, me.r); //ParamEllipse 
            if (me.fill)
                ctx.fill();

            //画上下左右中文本
            me.draw5Text(me, rx, ry, ctx);
            //画图形内部对象[在外部实现]
            me.drawChilds(ctx, rx, ry, me.width, me.height);

            //画选择器
            if (me.selector && me.selector.visible)
                me.selector.draw(ctx, rx, ry);

            //画连接点  
            if (me.selected && me.linkPoints && me.linkPoints.visible)
                me.linkPoints.draw(ctx, rx, ry);

            ctx.restore();
        };
        return me;
    }
};




//菱形对象
WebGraph.Shape.Rhombus = {
    createNew: function(id) {
        var me = WebGraph.Shape.ShapeBase.createNew();
        me.shapeType = "rhombus";
        // path.isInside = function(x, y) {
        // 	return   WebGraph.Math.isInsidePolygon(x-path.offsetX, y-path.offsetY, path.points);
        // };	 
        me.draw = function(ctx) {
            ctx.save();
            var xy = me.initContext(ctx);
            var rx = xy.X;
            var ry = xy.Y;
            //  WebGraph.Drawing2D.ParamEllipse(ctx, me.x, me.y, me.width, me.height);
            WebGraph.Drawing2D.Rhombus(ctx, rx, ry, me.width, me.height);
            //画上下左右中文本
            me.draw5Text(me, rx, ry, ctx);
            //画图形内部对象[在外部实现]
            me.drawChilds(ctx, rx, ry, me.width, me.height);
            //画选择器
            if (me.selector && me.selector.visible)
                me.selector.draw(ctx, rx, ry);
            //画连接点  
            if (me.selected && me.linkPoints && me.linkPoints.visible)
                me.linkPoints.draw(ctx, rx, ry);
            ctx.restore();
        };

        // me.ToString = function() {
        // 	return '<circle ' + me.getString() + ' cx=' + me.cx + ' cy=' + me.cy + ' r=' + me.r + '  />';
        // };
        return me;
    }
};


//线形对象
WebGraph.Shape.Line = {
    createNew: function() {
        //继承
        var line = WebGraph.Shape.ShapeBase.createNew();
        line.strokePattern = 0; //stroke-dasharray  虚线设置（5,5）
        line.x1 = -1;
        line.y1 = -1;
        line.x2 = -1;
        line.y2 = -1;
        line.ShapeType = '线';
        line.hasArrow = false;
        line.arrowLenght = 5; //箭头长度
        line.arrowHeight = 4; //箭头高度
        line.arrowDeepin = 1; //箭头中间深度

        line.init = function(x1, y1, x2, y2, lineWidth, strokeColor) {
            line.x1 = x1;
            line.y1 = y1;
            line.x2 = x2;
            line.y2 = y2;
            line.strokeWidth = lineWidth;
            line.stroke = strokeColor;
            line.fill = strokeColor;
            line.x = x1;
            line.y = y1;
            line.width = x2 - x1;
            line.height = y2 - y1;
            line.arrowHeight = 2 * lineWidth; //箭头高度
        };
        line.setBounds = function(x, y, w, h) {
            line.x = x;
            line.y = y;
            line.width = w;
            line.height = h;
            line.x1 = x;
            line.y1 = y;
            line.x2 = x + w;
            line.y2 = y + h;
        };
        //判断鼠标是否在图形内部
        line.isInside = function(x, y) {
            var points = line.x1 + "," + line.y1 + " " + line.x2 + "," + line.y2;
            return WebGraph.Math.isInsideSegment(x, y, points);
        };
        line.setMove = function(newX, newY) {
            line.x += newX;
            line.y += newY;
            line.x1 = line.x;
            line.y1 = line.y;
            line.x2 += newX;
            line.y2 += newY;
        };

        line.setSelected = function(tf) {
            line.selected = tf;
            if (line.editSize) {
                if (!tf && line.selector != null) {
                    line.selector.hideHandles();
                    line.selector = null;
                    return;
                }
                //选择器事件处理
                if (tf && line.selector == null) {
                    line.selector = WebGraph.Model.Selector.createNew();
                    line.selector.init(line.webCanvas);
                }
            }

        };

        line.draw = function(ctx) {
            // line.x1 = line.x;
            // line.y1 = line.y;
            // ctx.fillStyle = line.fill;
            // ctx.strokeStyle = line.stroke;
            // ctx.lineWidth = this.strokeWidth;
            ctx.save();
            var xy = line.initContext(ctx);
            var rx = xy.X;
            var ry = xy.Y;
            //虚线
            if (line.strokePattern > 0)
                WebGraph.Drawing2D.dashedLine(ctx, line.x1, line.y1, line.x2, line.y2, line.strokePattern);
            else
                WebGraph.Drawing2D.line(ctx, line.x1, line.y1, line.x2, line.y2);

            ctx.restore();
            //画箭头
            if (line.hasArrow)
                WebGraph.Drawing2D.drawArrow(ctx, line.x1, line.y1, line.x2, line.y2, line.arrowLenght, line.arrowHeight, line.arrowDeepin);
            //WebGraph.Drawing2D.lineArrow(ctx,0,0,line.x1,line.y1,line.x2,line.y2,ctx.lineWidth);

            if (line.Text != null && line.Text != '') {
                var tx = (line.x1 + line.x2) / 2;
                var ty = (line.y1 + line.y2) / 2;
                var text = WebGraph.Shape.Text.createNew();
                text.x = tx; //+rect.width/2;
                text.y = ty;
                text.Text = line.Text;
                text.fill = "#000000";
                text.strokeWidth = "0";
                text.textAnchor = "middle";
                text.fontSize = line.fontSize;
                text.draw(ctx);
            }

            //画选择器
            if (line.selector && line.selector.visible)
                line.selector.draw(ctx, rx, ry);
        };

        line.ToString = function() {
            var shapeStr = '';
            if (line.strokeDasharray != '')
                shapeStr = shapeStr + ' stroke-dasharray=' + line.strokeDasharray;
            if (line.x1 != '')
                shapeStr = shapeStr + ' x1=' + line.x1;
            if (line.y1 != '')
                shapeStr = shapeStr + ' y1=' + line.y1;
            if (line.x2 != '')
                shapeStr = shapeStr + ' x2=' + line.x2;
            if (line.y2 != '')
                shapeStr = shapeStr + ' y2=' + line.y2;
            return '<line ' + line.getString() + shapeStr + ' />';
        };
        return line;
    }
};

//三次贝塞尔曲线对象
WebGraph.Shape.Bezier = {
    createNew: function() {
        //继承
        var b = WebGraph.Model.Element.createNew();
        b.strokeDasharray = ''; //stroke-dasharray  虚线设置（5,5）
        b.x1 = 0;
        b.y1 = 0;
        b.x2 = 0;
        b.y2 = 0;
        b.x3 = 0;
        b.y3 = 0;
        b.x4 = 0;
        b.y5 = 0;
        b.shapeType = '三次贝塞尔曲线';
        b.points = "";
        b.showStartArrow = false;
        b.showEndArrow = false;
        b.arrowLenght = 5; //箭头长度
        b.arrowHeight = 4; //箭头高度
        b.arrowDeepin = 1; //箭头中间深度
        b.parentShape = null;
        b.init = function(x1, y1, x2, y2, x3, y3, x4, y4, lineWidth, strokeColor) {
            b.x1 = x1;
            b.y1 = y1;
            b.x2 = x2;
            b.y2 = y2;
            b.x3 = x3;
            b.y3 = y3;
            b.x4 = x4;
            b.y4 = y4;
            b.strokeWidth = lineWidth;
            b.stroke = strokeColor;

            b.points = x1 + "," + y1 + " " + x2 + "," + y2 + " " + x3 + "," + y3 + " " + x4 + "," + y4;

        };

        //判断鼠标是否在图形内部
        b.isInside = function(x, y) {
            return WebGraph.Math.isInsideSegment(x, y, b.points);
        };

        b.draw = function(ctx) {
            //设置纯色
            ctx.save();

            ctx.strokeStyle = b.stroke;
            ctx.lineWidth = b.strokeWidth;

            if (b.hovered) {
                ctx.strokeStyle = b.hoverStroke;
                //ctx.lineWidth = this.strokeWidth;
            }
            if (b.selected) {
                ctx.strokeStyle = b.selectedStroke;
                //ctx.lineWidth = this.strokeWidth;
            }
            if (b.selected == false && b.hovered == false)
                ctx.strokeStyle = b.stroke;

            // ctx.fillStyle = b.fill;
            // ctx.strokeStyle = b.stroke;
            //ctx.lineWidth = b.strokeWidth;
            ctx.beginPath();
            ctx.moveTo(b.x1, b.y1); //开始点
            ctx.bezierCurveTo(b.x2, b.y2, b.x3, b.y3, b.x4, b.y4);
            ctx.stroke();

            //画箭头 
            if (b.showEndArrow) {
                WebGraph.Drawing2D.drawArrow(ctx, x3, y3, x4, y4, b.arrowLenght, b.arrowHeight, b.arrowDeepin);
            }

            if (b.showStartArrow) {
                WebGraph.Drawing2D.drawArrow(ctx, x2, y2, x1, y1, b.arrowLenght, b.arrowHeight, b.arrowDeepin);
            }


            if (b.Text) {

                var tx = (b.x1 + b.x4) / 2;
                var ty = (b.y1 + b.y4) / 2;

                var text = WebGraph.Shape.Text.createNew();
                text.x = tx;
                text.y = ty;

                text.Text = b.Text;
                text.fill = "#000000";
                text.strokeWidth = 0;
                text.textAnchor = "middle";
                text.fontSize = b.fontSize;
                text.draw(ctx);
            }
            ctx.restore();
        };
        return b;
    }
};


//多边形对象
WebGraph.Shape.Polygon = {
    createNew: function() {
        //继承path
        var polygon = WebGraph.Shape.Path.createNew();
        polygon.shapeType = "polygon";
        polygon.closePath = true;

        polygon.setMove = function(newX, newY) {
            var ps = polygon.points.split(" ");
            var psList = [];
            var p;
            for (var i = 0; i < ps.length; i++) {
                p = ps[i].split(",");
                p[0] = (parseInt(p[0]) + newX).toString();
                p[1] = (parseInt(p[1]) + newY).toString();
                psList.push(p[0] + "," + p[1])

            };
            polygon.points = psList.join(" ");

            polygon.setMoveAfter(newX, newY);
        };

        polygon.ToString = function() {
            return '<polygon ' + polygon.getString() + ' points=' + polygon.points + ' />';
        };
        return polygon;
    }
};
//路径对象
WebGraph.Shape.Path = {
    createNew: function() {
        //继承
        var path = WebGraph.Model.Element.createNew();
        path.shapeType = "path";
        path.points = "";
        path.text = "";
        path.textPoint = null;
        path.offsetX = 0;
        path.offsetY = 0;
        path.closePath = false;
        path.pointsList = null;
        path.isInside = function(x, y) {
            if (path.points == "" && path.pointsList)
                path.points = path.pointsList.join(" ");
            return   WebGraph.Math.isInsidePolygon(x - path.offsetX, y - path.offsetY, path.points);
        };

        path.draw = function(ctx) {
            var ps = path.pointsList;
            if (path.pointsList == null)
                ps = path.points.split(" ");
            if (ps != null) {
                ctx.save();
                //旋转
                if (path.rotate != 0)
                    ctx.rotate(path.rotate * Math.PI / 180);
                //设置纯色
                ctx.fillStyle = path.fill;
                ctx.lineWidth = path.strokeWidth;
                if (path.hovered) {
                    ctx.lineWidth = path.strokeWidth + 1;
                    ctx.strokeStyle = path.hoverStroke;
                    //ctx.fillStyle = path.hoverStroke;
                }
                if (path.selected) {
                    ctx.lineWidth = path.strokeWidth + 1;
                    ctx.strokeStyle = path.selectedStroke;
                    //ctx.fillStyle = path.selectedStroke;
                }
                if (path.selected == false && path.hovered == false)
                    ctx.strokeStyle = path.stroke;

                ctx.beginPath();
                //var p2 = ps[0].split(",");
                for (var i = 0; i < ps.length; i++) {
                    var p = ps[i].split(",");
                    var p1 = ps[i].split(",");
                    if (i == 0)
                        ctx.moveTo(parseInt(p[0]) + path.offsetX, parseInt(p[1]) + path.offsetY);
                    else {
                        ctx.lineTo(parseInt(p[0]) + path.offsetX, parseInt(p[1]) + path.offsetY);
                        //ctx.lineTo(parseInt(p1[0])+path.offsetX, parseInt(p1[1])+path.offsetY);
                    }
                }
                //ctx.lineTo(parseInt(p2[0])+path.offsetX, parseInt(p2[1])+path.offsetY);
                if (path.closePath)
                    ctx.closePath();
                if (path.fill)
                    ctx.fill();
                ctx.stroke();
                ctx.restore();

                if (path.text) {
                    var t = WebGraph.Shape.Text.createNew();
                    if (path.textPoint == null) { 
                        var ps = path.points.split(" ");
                        var minX = 100000;
                        var minY = 100000;
                        var maxX = 0;
                        var maxY = 0;
                        var p = null;         
                        for (var  i = 0; i < ps.length - 1; i++) {  
                            p = ps[i].split(",");
                            if (p[0] < minX) minX = parseFloat(p[0]);
                            if (p[1] < minY) minY = parseFloat(p[1]);
                            if (p[0] > maxX) maxX = parseFloat(p[0]);
                            if (p[1] > maxY) maxY = parseFloat(p[1]);
                        }
                        t.x = (minX + maxX) / 2 + path.offsetX;
                        t.y = (minY + maxY) / 2 + path.offsetY;
                    } else {
                        t.x = path.textPoint.x + path.offsetX;
                        t.y = path.textPoint.y + path.offsetY;
                    }
                    t.width = path.text.length * 10;
                    t.height = 20;
                    t.Text = path.text;
                    t.fill = "#000000";
                    t.strokeWidth = 0;
                    t.textAnchor = "left";
                    t.draw(ctx);
                }
            }
        };
        path.ToString = function() {
            return '<path ' + path.getString() + ' d=' + path.d + ' />';
        };
        return path;
    }
};

//折线对象
WebGraph.Shape.Polyline = {
    createNew: function() {
        //继承
        var polyline = WebGraph.Model.Element.createNew();
        polyline.shapeType = "折线";
        polyline.points = "";
        polyline.fill = 'White';
        polyline.fromId = "";
        polyline.toId = "";
        polyline.showStartArrow = false;
        polyline.showEndArrow = false;
        polyline.arrowLenght = 5; //箭头长度
        polyline.arrowHeight = 4; //箭头高度
        polyline.arrowDeepin = 1; //箭头中间深度
        // polyline.parentShape=null;
        //属性初始化函数
        polyline.init = function(points, lineWidth, strokeColor) {
            this.points = points;
            this.strokeWidth = lineWidth;
            this.stroke = strokeColor;
            polyline.fill = strokeColor;
            this.fillOpacitys = "0";
            polyline.arrowHeight = lineWidth * 2; //箭头高度
        };

        polyline.isInside = function(x, y) {
            return WebGraph.Math.isInsideSegment(x, y, this.points);
        };
        polyline.getPointList = function() {
            return polyline.points.split(" ");
        };
        polyline.setPoints = function(pointList) {
            var ps = "";
            for (var i = 0; i < pointList.length; i++) {
                if (i == pointList.length - 1)
                    ps = ps + pointList[i];
                else
                    ps = ps + pointList[i] + " ";
            }
            polyline.points = ps;

        };

        polyline.setMove = function(newX, newY) {
            var ps = this.points.split(" ");
            var new_ps = '';
            for (var i = 0; i < ps.length; i++) {
                var p = ps[i].split(",");
                var x = parseInt(p[0]) + newX;
                var y = parseInt(p[1]) + newY;

                new_ps = new_ps + x + "," + y + " ";

            }

        };

        polyline.setSelected = function(tf) {
            polyline.selected = tf;
            if (polyline.editSize) {
                if (!tf && polyline.selector != null) {
                    polyline.selector.hideHandles();
                    polyline.selector = null;
                    return;
                }
                //选择器事件处理
                if (tf && polyline.selector == null) {
                    polyline.selector = WebGraph.Model.LineSelector.createNew();
                    polyline.selector.init(polyline.webCanvas);
                    polyline.webCanvas.selector = polyline.selector;
                }
            }

        };

        polyline.draw = function(ctx) {
            var ps = this.points.split(" ");
            if (ps != null) {
                ctx.save();

                ctx.strokeStyle = polyline.stroke;
                ctx.lineWidth = polyline.strokeWidth;


                if (this.selected) {
                    ctx.strokeStyle = this.selectedStroke;
                    //ctx.lineWidth = this.strokeWidth;
                }
                if (this.selected == false && this.hovered == false)
                    ctx.strokeStyle = this.stroke;
                if (this.hovered) {
                    ctx.strokeStyle = this.hoverStroke;
                    //ctx.lineWidth = this.strokeWidth;
                }

                ctx.beginPath();
                for (var i = 0; i < ps.length; i++) {
                    var p = ps[i].split(",");
                    if (i == 0)
                        ctx.moveTo(p[0], p[1]);
                    else
                        ctx.lineTo(p[0], p[1]);
                }

                //ctx.closePath();
                ctx.stroke();
                //画箭头
                ctx.fillStyle = ctx.strokeStyle;
                if (polyline.showEndArrow) {
                    var p1 = ps[ps.length - 2].split(",");
                    var p2 = ps[ps.length - 1].split(",");
                    WebGraph.Drawing2D.drawArrow(ctx, p1[0], p1[1], p2[0], p2[1], polyline.arrowLenght, polyline.arrowHeight, polyline.arrowDeepin);
                }

                if (polyline.showStartArrow) {
                    var p1 = ps[1].split(",");
                    var p2 = ps[0].split(",");
                    WebGraph.Drawing2D.drawArrow(ctx, p1[0], p1[1], p2[0], p2[1], polyline.arrowLenght, polyline.arrowHeight, polyline.arrowDeepin);
                }

                if (polyline.Text) {
                    var p1 = ps[0].split(",");
                    var p2 = ps[ps.length - 1].split(",");
                    var tx = (parseInt(p1[0]) + parseInt(p2[0])) / 2;
                    var ty = (parseInt(p1[1]) + parseInt(p2[1])) / 2;

                    var text = WebGraph.Shape.Text.createNew();

                    text.Text = polyline.Text;
                    text.fill = "#000000";
                    text.strokeWidth = 0;
                    text.textAnchor = "middle";
                    text.fontSize = polyline.fontSize;
                    var len = polyline.Text.length;
                    // var metrics = ctx.measureText(polyline.Text);
                    // 	        var textWidth = metrics.width;
                    text.x = tx - len * 10;
                    text.y = ty;
                    text.draw(ctx);
                }
                //画选择器
                if (polyline.selector && polyline.selector.visible)
                    polyline.selector.draw(ctx, 0, 0);

                ctx.restore();
            }
        };
        polyline.ToString = function() {
            var str = '<polyline ' + polyline.getString() + ' points="' + polyline.points + '" />';
            return str;
        };
        return polyline;
    }
};
//平行四边形对象
WebGraph.Shape.Parallelogram = {
    createNew: function(id) {
        var me = WebGraph.Shape.ShapeBase.createNew();
        // 	me.shapeType = "平行四边形";
        // 	me.rx = 0;
        // 	me.ry = 0;
        // 	me.eleva = 0.6; //仰角 

        // 	me.topPath = null; 

        // 	me.topColor = null; 

        // 	me.imageX = null;
        // 	me.imageY = null;
        // 	me.image = null;

        // 	if (id != undefined)
        // 		me.id = id;

        // 	//初始化函数
        // 	me.init = function(x, y, w, h,  e, strokeWidth, strokeColor, fillColor) {
        // 		me.x = x;
        // 		me.y = y;
        // 		me.width = w;
        // 		me.height = h;
        // 		me.eleva = e; //仰角
        // 		me.strokeWidth = strokeWidth;
        // 		me.stroke = strokeColor;
        // 		me.fill = fillColor;
        // 		//三个面顶点坐标（上 前 右侧）
        // 		me.topPath   = WebGraph.Shape.Path.createNew();

        // 		//三个面颜色
        // 		me.topColor = fillColor;

        // 		me.topPath.fill = me.topColor; 

        // 	};
        //    me.setSidePoints = function(){
        // 	//三个面顶点坐标（上 前 右侧）
        // 		var pNW = {	x: me.x,y: me.y	};
        // 		var pNE = {	x: me.x + me.width,	y: me.y	};
        // 		var pSW = {	x: me.x,y: me.y + me.height	};
        // 		var pSE = {	x: me.x + me.width,	y: me.y + me.height	};
        // 		var pNW2 = WebGraph.Math.getAnglePoint({x: me.x,y: me.y}, me.depth, me.eleva);
        // 		var pNE2 = {x: pNW2.x + me.width,y: pNW2.y};
        // 		var pSW2 = {x: pNW2.x,	y: pNW2.y + me.height};
        // 		var pSE2 = {x: pNW2.x + me.width,y: pNW2.y + me.height};

        // 		me.topPath.points = pNW.x + "," + pNW.y + " " + pNW2.x + "," + pNW2.y + " " + pNE2.x + "," + pNE2.y + " " + pNE.x + "," + pNE.y+" "+pNW.x + "," + pNW.y;
        // 		};

        // me.setBounds = function(x,y,w,h){
        // 			me.x=x ;
        // 			me.y=y ;
        // 			me.width=w ;
        // 			me.height=h ; 
        // 			 me.setSidePoints();
        // 		};

        // me.setMoveAfter = function(newX,newY){
        //     me.setSidePoints();
        // };
        // //判断鼠标是否在图形内部
        // me.isInside = function(mx, my) {
        // 		var x = mx;
        // 		var y = my;
        // 		var h = 0;

        // 		if (me.selector) h = 15
        // 			//如果旋转
        // 		if (me.rotate != 0) {
        // 			var rotatePoint = WebGraph.Math.getRotatePoint({
        // 				x: mx,
        // 				y: my
        // 			}, {
        // 				x: me.x + me.width / 2,
        // 				y: me.y + me.height / 2
        // 			}, -me.rotate);
        // 			x = rotatePoint.x;
        // 			y = rotatePoint.y;
        // 		}

        // 		if (x >= me.x - 2 && x <= (me.x + me.width + 4) && y >= me.y - 2 - h && y <= (me.y + me.height + 4 + h)) {
        // 			return true;
        // 		}

        // 		if (me.topPath.isInside(mx, my)) return true;
        // 		if (me.sidePath.isInside(mx, my)) return true;

        // 		return false;

        // 	};

        // 	me.drawChilds = function(ctx, left, top, w, h) {};
        // 	me.draw = function(ctx) {
        // 		ctx.save();
        // 		//旋转
        // 		var rx = me.x;
        // 		var ry = me.y;
        // 		if (me.rotate != 0) {
        // 			ctx.translate(me.x + me.width / 2, me.y + me.height / 2);
        // 			ctx.rotate(me.rotate * Math.PI / 180);
        // 			rx = -me.width / 2;
        // 			ry = -me.height / 2;
        // 		}
        // 		// 设置图形透明度
        // 		// 使用gloabalAlpha属性，值介于0到1，0：完全透明，1：完全不透明
        // 		ctx.globalAlpha = me.opacity;

        // 		ctx.lineWidth = me.strokeWidth;
        // 		if (me.hovered) {
        // 			ctx.strokeStyle = me.hoverStroke;
        // 			ctx.lineWidth = me.strokeWidth + 1;
        // 		}
        // 		if (me.selected) {
        // 			ctx.strokeStyle = me.selectedStroke;
        // 			ctx.lineWidth = me.strokeWidth + 1;
        // 		}
        // 		if (me.selected == false && me.hovered == false)
        // 			ctx.strokeStyle = me.stroke;


        // 		me.topPath.draw(ctx);
        // 		me.sidePath.draw(ctx);
        // 		me.frontPath.draw(ctx);
        // 		//画上下左右中文本
        // 		me.draw5Text(me, rx, ry, ctx);
        // 		//画图形内部对象
        // 		me.drawChilds(ctx, rx, ry, me.width, me.height);
        // 		//画选择器
        // 		if (me.selector && me.selector.visible) {
        // 			me.selector.draw(ctx, rx, ry);
        // 		}
        // 		ctx.restore();
        // 	};

        return me;
    }
};
/*-*/

//WebGraph.Math.
//判断点是否在线段上 
WebGraph.Math.isInsideSegment = function(x, y, points) {
    var inside = false;
    var ps = points.split(" ");
    var p, p1, p2, q;
    q = { x: x, y: y };
    var a, b, c;
    for (var i = 0, l = ps.length - 1; i < l; i++) {
        p = ps[i].split(",");
        p1 = { x: p[0], y: p[1] };
        p = ps[i + 1].split(",");
        p2 = { x: p[0], y: p[1] };
        //AB线段，C为点，只要AC+BC的长度等于AB的长度就是在线段上
        a = getABLength(p1, q);
        b = getABLength(p2, q);
        c = getABLength(p1, p2);
        if (a + b >= c - 2 && a + b <= c + 2)
            inside = true;
        else
            continue;
    }
    return inside;

};
//判断两矩形是否交叉
WebGraph.Math.iSCross2Rect = function(r1, r2) {
    var c1 = { x: r1.x + r1.w / 2, y: r1.y + r1.h / 2 };
    var c2 = { x: r2.x + r2.w / 2, y: r2.y + r2.h / 2 };

    return (Math.abs(c1.x - c2.x) <= r1.w / 2.0 + r2.w / 2.0 && Math.abs(c2.y - c1.y) <= r1.h / 2.0 + r2.h / 2.0);

}

//判断点是否在多边形内 
WebGraph.Math.isInsidePolygon = function(px, py, polygon) {          
    var  p1, p2, p3, p4 ;

             
    p1 = { x: px, y: py } ; //point ;    
         
    p2 = { x: -100, y: py } ; 
    var ps = polygon.split(" ");        
    var  count = 0  ;         //对每条边都和射线作对比 
             
    for (var  i = 0; i < ps.length - 1; i++) {  
        var a = ps[i].split(",");
        var b = ps[i + 1].split(",");       
        p3 = { x: a[0], y: a[1] } ;  
        p4 = { x: b[0], y: b[1] } ;   
        if (checkCross(p1, p2, p3, p4) == true) {                   count++     ;          }       
    }    

    var a = ps[ps.length - 1].split(",");
    var b = ps[0].split(",");
    p3 = { x: a[0], y: a[1] } ; 
    p4 = { x: b[0], y: b[1] } ;      

             
    if (checkCross(p1, p2, p3, p4) == true) {               count++ ;          }           //  console.log(count) 
             
    return  (count % 2 == 0) ? false : true;
};

//计算向量叉乘 
    
var  crossMul = function(v1, v2) {           return    v1.x * v2.y - v1.y * v2.x;       } ; 

//判断两条线段是否相交  //相交返回true
    
var  checkCross = function(p1, p2, p3, p4) {          
    var  v1 = { x: p1.x - p3.x, y: p1.y - p3.y },
                  v2 = { x: p2.x - p3.x, y: p2.y - p3.y },
                  v3 = { x: p4.x - p3.x, y: p4.y - p3.y },
                  v = crossMul(v1, v3) * crossMul(v2, v3)  ;        
    v1 = { x: p3.x - p1.x, y: p3.y - p1.y } ;         
    v2 = { x: p4.x - p1.x, y: p4.y - p1.y }  ;        
    v3 = { x: p2.x - p1.x, y: p2.y - p1.y }   ;       
    return  (v <= 0 && crossMul(v1, v3) * crossMul(v2, v3) <= 0) ? true : false  ;   
};  

function direction(p1, p2, p) {
    return (p1.x - p.x) * (p2.y - p.y) - (p2.x - p.x) * (p1.y - p.y);
    // var v= ( p1.x -p.x )*( p2.y-p.y) -( p2.x -p.x )*( p1.y-p.y)   ;
    // if (v==0) return true;
    // else false; 
}

function onSegment(p1, p2, p) {
    var max = p1.x > p2.x ? p1.x : p2.x;
    var min = p1.x < p2.x ? p1.x : p2.x;
    var max1 = p1.y > p2.y ? p1.y : p2.y;
    var min1 = p1.y < p2.y ? p1.y : p2.y;
    if (p.x >= min && p.x <= max && p.y >= min1 && p.y <= max1)
        return true;
    else
        return false;
}

function getABLength(a, b) //获取a,b两点的距离
{
    var disx = a.x - b.x;
    var disy = a.y - b.y;
    var num = (disx * disx) + (disy * disy); //平方和
    return Math.sqrt(num);
}

// -------------------------------------------------------------------------
// 返回point绕center旋转angle角度以后的点，单位(角度)
// -------------------------------------------------------------------------
WebGraph.Math.getRotatePoint = function(point, center, angle) {
    if (Math.abs(angle) <= 0)
        return point;
    var _point = { x: 0, y: 0 };
    var delta = { x: point.x - center.x, y: point.y - center.y };
    var theta = angle / 180 * Math.PI;
    _point.x = delta.x * Math.cos(theta) - delta.y * Math.sin(theta) + 0.5;
    _point.y = delta.x * Math.sin(theta) + delta.y * Math.cos(theta) + 0.5;

    _point = { x: center.x + _point.x, y: center.y + _point.y };
    return _point;
}

// -------------------------------------------------------------------------
// 返回边r绕center旋转angle角度以后的点，单位(角度)
// -------------------------------------------------------------------------
WebGraph.Math.getAnglePoint = function(center, r, angle) {
    if (Math.abs(angle) <= 0)
        return center;
    var _point = { x: 0, y: 0 };

    var theta = angle / 180 * Math.PI;
    _point.x = r * Math.cos(theta);
    _point.y = r * Math.sin(theta);

    _point = { x: center.x + _point.x, y: center.y + _point.y };
    return _point;
};

/**
 * 矩形包含判断
 */
WebGraph.Math.isInsideRectangle = function(area, x, y) {
    if (x >= area.x &&
        x <= (area.x + area.width) &&
        y >= area.y &&
        y <= (area.y + area.height)
    ) {
        return true;
    }
    return false;
};

/**
 * 线段包含判断
 */
WebGraph.Math.isInsideLine = function(area, x, y) {
    var _x1 = area.xStart;
    var _y1 = area.yStart;
    var _x2 = area.xEnd;
    var _y2 = area.yEnd;
    var _l = Math.max(area.lineWidth, 3);
    var _a = 0;
    var _b = _x1;

    if (_x1 !== _x2) {
        _a = (_y1 - _y2) / (_x1 - _x2);
        _b = (_x1 * _y2 - _x2 * _y1) / (_x1 - _x2);
    } else {
        return Math.abs(x - _x1) <= _l / 2;
    }

    var _s = (_a * x - y + _b) * (_a * x - y + _b) / (_a * _a + 1);
    return _s <= _l / 2 * _l / 2;
};


/**
 * 圆形包含判断
 */
_isInsideCircle = function(area, x, y, r) {
    return (x - area.x) * (x - area.x) + (y - area.y) * (y - area.y) <
        r * r;
};

/**
 * 扇形包含判断
 */
_isInsideSector = function(area, x, y) {
    if (!_isInsideCircle(area, x, y, area.r) ||
        (area.r0 > 0 &&
            _isInsideCircle({
                    x: area.x,
                    y: area.y
                },
                x, y,
                area.r0
            )
        )
    ) {
        // 大圆外或者小圆内直接false
        return false;
    } else {
        // 判断夹角
        if (Math.abs(area.endAngle - area.startAngle) >= 360) {
            // 大于360度的扇形，在环内就为true
            return true;
        }

        var angle = (360 -
                Math.atan2(y - area.y, x - area.x) /
                Math.PI *
                180) %
            360;
        var endA = (360 + area.endAngle) % 360;
        var startA = (360 + area.startAngle) % 360;
        if (endA > startA) {
            return (angle >= startA && angle <= endA);
        } else {
            return !(angle >= endA && angle <= startA);
        }

    }
};

//      /**
//       * 多边形包含判断
//       * 警告：下面这段代码会很难看，建议跳过~
//       */
//      function isInsidePolygon(area, x, y) {
//          /**
//           * 射线判别法
//           * 如果一个点在多边形内部，任意角度做射线肯定会与多边形要么有一个交点，要么有与多边形边界线重叠
//           * 如果一个点在多边形外部，任意角度做射线要么与多边形有一个交点，
//           * 要么有两个交点，要么没有交点，要么有与多边形边界线重叠。
//           */
//          var i;
//          var j;
//          var polygon = area.points;
// var ps =polygon.split(" ");
//          var N = ps.length;
//          var inside = false;
//          var redo = true;
//          var v;  

//          for (i = 0; i < N; ++i) {
// 	var p=ps[i].split(",");

//              // 是否在顶点上
//              if (p[0] == x && p[1] == y ) {
//                  redo = false;
//                  inside = true;
//                  break;
//              }
//          }

//          if (redo) {
//              redo = false;
//              inside = false;
//              for (i = 0,j = N - 1;i < N;j = i++) {
// 		var p1=ps[i].split(",");
// 		var p2=ps[j].split(",");
//                  if ((p1[1] < y && y < p2[1]) || (p2[1] < y && y < p1[1])) {
//                      if (x <=p1[0] || x <=p2[0]) {
//                          v = (y - p1[1])* (p2[0] - p1[0])/(p2[1] -p1[1])  + p1[0];
//                          if (x < v) {          // 在线的左侧
//                              inside = !inside;
//                          }
//                          else if (x == v) {   // 在线上
//                              inside = true;
//                              break;
//                          }
//                      }
//                  }
//                  else if (y == p1[1]) {
//                      if (x < p1[0]) {    // 交点在顶点上
//                          p1[1] >p2[1] ? --y : ++y;
//                          //redo = true;
//                          break;
//                      }
//                  }
//                  else if (p1[1] == p2[1] // 在水平的边界线上
//                           && y ==p1[1]
//                           && ((p1[0] < x && x < p2[0]) || (p2[0] < x && x < p1[0]))
//                  ) {
//                      inside = true;
//                      break;
//                  }
//              }
//          }
//          return inside;
//      }

//      /**
//       * 路径包含判断，依赖多边形判断
//       */
//      function _isInsidePath(area, x, y) {
//          if (!area.pointList) {
//              require('../shape').get('path').buildPath(_ctx, area);
//          }
//          var pointList = area.pointList;
//          var insideCatch = false;
//          for (var i = 0, l = pointList.length; i < l; i++) {
//              insideCatch = _isInsidePolygon(
//                  { pointList : pointList[i] }, x, y
//              );
//              if (insideCatch) {
//                  break;
//              }
//          }
//          return insideCatch;
//      }

/**
 * 测算多行文本宽度
 * @param {Object} text
 * @param {Object} textFont
 */
getTextWidth = function(text, textFont) {
    if (!_ctx) {
        _ctx = util.getContext();
    }

    _ctx.save();
    if (textFont) {
        _ctx.font = textFont;
    }

    text = (text + '').split('\n');
    var width = 0;
    for (var i = 0, l = text.length; i < l; i++) {
        width = Math.max(
            _ctx.measureText(text[i]).width,
            width
        );
    }
    _ctx.restore();

    return width;
};

// /**
//         * 测算多行文本高度
//         * @param {Object} text
//         * @param {Object} textFont
//         */
//        function getTextHeight(text, textFont) {
//            if (!_ctx) {
//                _ctx = util.getContext();
//            }
//
//            _ctx.save();
//            if (textFont) {
//                _ctx.font = textFont;
//            }
//            
//            text = (text + '').split('\n');
//            //比较粗暴
//            var height = (_ctx.measureText('国').width + 2) * text.length;
//
//            _ctx.restore();
//
//            return height;
//        }
//
//        return {isInside : isInside,
//            isOutside : isOutside,
//            getTextWidth : getTextWidth,
//            getTextHeight : getTextHeight};
//    }
//	

//点在多边形内判断
//参数：
//nvert: 多边形的顶点数
//vertx, verty: 顶点X坐标和Y坐标分别组成的数组
//testx, testy: 需要测试的点的X坐标和Y坐标
// function pnpoly( area, x, y)
// {

// 	 var polygon = area.points;
// 	 var ps =polygon.split(" ");
// 	 var n=ps.length;	

// 	  var i, j, c = 0;
// 	  for (i = 0, j = n-1; i < n; j = i++) {
// 			 var p1=ps[i].split(",");//vertx[i]  [0x,y1]
// 			 var p2=ps[j].split(",");//verty[j]
// 		if ( ((p1[1]>y) != (p2[1]>y)) && (x < (p2[0]-p1[0]) * (y-p1[1]) / (p2[1]-p1[1]) + p1[0]) )
// 		   c = !c;
// 	  }
//      // for (i = 0; i < n-1;  i++) {
// //			 var p1=ps[i].split(",");//vertx[i]
// //			 var p2=ps[i+1].split(",");//verty[j]
// //		if ( ((p1[1]>y) != (p2[1]>y)) && (x < (p2[0]-p1[0]) * (y-p1[1]) / (p2[1]-p1[1]) + p1[0]) )
// //		   c++;//c = !c;
// //	  }

//  	  return (c%2==0)?false:true;
// }



 
//function _isInsidePolygon(pt, poly) {
//  for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
//  ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
//  && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
//  && (c = !c);
//  return c;
//}

//
//int pnpoly(int nvert, float *vertx, float *verty, float testx, float testy)
//{
//  int i, j, c = 0;
//  for (i = 0, j = nvert-1; i < nvert; j = i++) {
//    if ( ((verty[i]>testy) != (verty[j]>testy)) &&
//     (testx < (vertx[j]-vertx[i]) * (testy-verty[i]) / (verty[j]-verty[i]) + vertx[i]) )
//       c = !c;
//  }
//  return c;
//}


//该函数计算两个线段是否相交，如果相交返回交点
WebGraph.Math.segmentsIntr = function(a, b, c, d) {
    // 三角形abc 面积的2倍
    var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
    // 三角形abd 面积的2倍
    var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
    // 面积符号相同则两点在线段同侧,不相交 (对点在线段上的情况,本例当作不相交处理);
    if (area_abc * area_abd >= 0) {
        return false;
    }
    // 三角形cda 面积的2倍
    var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
    // 三角形cdb 面积的2倍
    // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
    var area_cdb = area_cda + area_abc - area_abd;
    if (area_cda * area_cdb >= 0) {
        return false;
    }
    //计算交点坐标
    var t = area_cda / (area_abd - area_abc);
    var dx = t * (b.x - a.x),
        dy = t * (b.y - a.y);
    return { x: a.x + dx, y: a.y + dy };
}; //图形渲染器[randerer]对象
//WebGraph.Drawing2D
//静态化函数

//var WebGraph.Drawing2D = {
// 圆角矩形
WebGraph.Drawing2D.roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
};
// 圆矩形
WebGraph.Drawing2D.Rect = function(ctx, x, y, width, height, fill, stroke) {

    if (fill)
        ctx.fillRect(x, y, width, height);
    //实践表明在不设施strokeStyle下的默认strokeStyle=black
    if (stroke)
        ctx.strokeRect(x, y, width, height);
};

// 画虚线矩形
WebGraph.Drawing2D.LineDashRect = function(ctx, x, y, width, height, fill, stroke, lineWidth, lineGap) {
    ctx.save();
    ctx.setLineDash([lineWidth, lineGap]);
    if (fill)
        ctx.fillRect(x, y, width, height);
    //实践表明在不设施strokeStyle下的默认strokeStyle=black
    if (stroke)
        ctx.strokeRect(x, y, width, height);
    ctx.restore();
};


//虚线
WebGraph.Drawing2D.dashedLine = function(ctx, fromX, fromY, toX, toY, pattern) {
    // default interval distance -> 5px 
    if (typeof pattern === "undefined") {
        pattern = 5;
    }
    // calculate the delta x and delta y 
    var dx = (toX - fromX);
    var dy = (toY - fromY);
    var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
    var dashlineInteveral = (pattern <= 0) ? distance : (distance / pattern);
    var deltay = (dy / distance) * pattern;
    var deltax = (dx / distance) * pattern;
    // draw dash line 
    ctx.beginPath();
    for (var dl = 0; dl < dashlineInteveral; dl++) {
        if (dl % 2) {
            ctx.lineTo(fromX + dl * deltax, fromY + dl * deltay);
        } else {
            ctx.moveTo(fromX + dl * deltax, fromY + dl * deltay);
        }
    }
    ctx.stroke();
};
WebGraph.Drawing2D.line = function(ctx, fromX, fromY, toX, toY) {
        //实验证明第一次lineTo的时候和moveTo功能一样
        ctx.moveTo(fromX, fromY);
        //之后的lineTo会以上次lineTo的节点为开始
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }
    //直线箭头  lineArrow(ctx,0,0,0,0,300,100,2)
WebGraph.Drawing2D.lineArrow = function(ctx, ox, oy, x1, y1, x2, y2, lineWidth) {
    //参数说明 canvas的 id ，原点坐标  第一个端点的坐标，第二个端点的坐标
    var sta = new Array(x1, y1);
    var end = new Array(x2, y2);

    if (ctx == null) return false;
    //ctx.lineWidth = lineWidth;
    // //画线 
    // ctx.beginPath();
    // ctx.translate(ox, oy, 0); //坐标源点 
    // ctx.moveTo(sta[0], sta[1]);
    // ctx.lineTo(end[0], end[1]);
    // ctx.fill();
    // ctx.stroke();
    ctx.save();

    //画箭头 
    ctx.translate(end[0], end[1]);
    //我的箭头本垂直向下，算出直线偏离Y的角，然后旋转 ,rotate是顺时针旋转的，所以加个负号
    var ang = (end[0] - sta[0]) / (end[1] - sta[1]);
    ang = Math.atan(ang);
    if (end[1] - sta[1] >= 0) {
        ctx.rotate(-ang);
    } else {
        ctx.rotate(Math.PI - ang); //加个180度，反过来
    }
    var w = lineWidth * 2;
    //ctx.lineWidth =1;// lineWidth;
    //-------------------->
    ctx.beginPath();
    ctx.moveTo(-(5 + w), -(10 + w * 2));
    //ctx.lineTo(-(5 + w), -(10 + w * 2));
    ctx.lineTo(0, -(5 + w));
    ctx.lineTo((5 + w), -(10 + w * 2));
    ctx.lineTo(0, lineWidth);
    //ctx.lineTo(-(5 + w), -(10 + w * 2));

    ctx.fill(); //箭头是个封闭图形
    //ctx.stroke();

    ctx.restore(); //恢复到堆的上一个状态，其实这里没什么用。
    ctx.closePath();

};
//画箭头 
WebGraph.Drawing2D.drawArrow1 = function(ctx, x1, y1, x2, y2) {
    //参数说明 canvas的 id ，原点坐标  第一个端点的坐标，第二个端点的坐标
    var sta = new Array(x1, y1);
    var end = new Array(x2, y2);

    if (ctx == null) return false;
    ctx.save();

    //画箭头 
    ctx.translate(end[0], end[1]);
    //我的箭头本垂直向下，算出直线偏离Y的角，然后旋转 ,rotate是顺时针旋转的，所以加个负号
    var ang = (end[0] - sta[0]) / (end[1] - sta[1]);
    ang = Math.atan(ang);
    if (end[1] - sta[1] >= 0) {
        ctx.rotate(-ang);
    } else {
        ctx.rotate(Math.PI - ang); //加个180度，反过来
    }
    var w = ctx.lineWidth;
    //ctx.lineWidth =1;// lineWidth;
    //-------------------->
    ctx.beginPath();
    ctx.moveTo(-(5 + w), -(10 + w * 2));
    //ctx.lineTo(-(5 + w), -(10 + w * 2));
    ctx.lineTo(0, -(5 + w));
    ctx.lineTo((5 + w), -(10 + w * 2));
    ctx.lineTo(0, ctx.lineWidth);
    //ctx.lineTo(-(5 + w), -(10 + w * 2));

    ctx.fill(); //箭头是个封闭图形
    //ctx.stroke();

    ctx.restore(); //恢复到堆的上一个状态，其实这里没什么用。
    ctx.closePath();

};
//画箭头 
//参数说明 canvas的 id ，原点坐标  第一个端点的坐标，第二个端点的坐标,
//length:箭头长度大小，
//height:高度,
//deepin:深度
WebGraph.Drawing2D.drawArrow = function(ctx, x1, y1, x2, y2, length, height, deepin) {
    //参数说明 canvas的 id ，原点坐标  第一个端点的坐标，第二个端点的坐标
    var sta = new Array(x1, y1);
    var end = new Array(x2, y2);

    if (ctx == null) return false;
    ctx.save();

    //画箭头 
    ctx.translate(end[0], end[1]);
    //我的箭头本垂直向下，算出直线偏离Y的角，然后旋转 ,rotate是顺时针旋转的，所以加个负号
    var ang = (end[0] - sta[0]) / (end[1] - sta[1]);
    ang = Math.atan(ang);
    if (end[1] - sta[1] >= 0) {
        ctx.rotate(-ang);
    } else {
        ctx.rotate(Math.PI - ang); //加个180度，反过来
    }
    //三角箭头--------->
    //       h.1
    //          m.4   size   .2
    //        .3

    var w = ctx.lineWidth; //线宽度
    if (length == null) length = 5;
    if (height == null) height = 2 * w;
    if (deepin == null) deepin = 1;

    ctx.lineWidth = 1; // lineWidth;
    //-------------------->
    ctx.beginPath();
    ctx.moveTo(-(height), -(w * length)); //4-1
    ctx.lineTo(0, -(length * w) + deepin); //4
    ctx.lineTo((height), -(w * length)); //3-4
    ctx.lineTo(0, w); //2
    ctx.fill(); //箭头是个封闭图形
    ctx.stroke();

    ctx.restore(); //恢复到堆的上一个状态 
    ctx.closePath();

};
// 箭头
WebGraph.Drawing2D.drawArrow2 = function(canvas, angle) {
    //Init canvas
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    //Rotate
    var distance = iconSize / 2 * Math.sqrt(2) * Math.sin(angle * Math.PI / 180 / 2) * 2;
    var degree = 180 - 45 - (180 - angle) / 2;
    var x = distance * Math.sin(degree * Math.PI / 180);
    var y = distance * Math.cos(degree * Math.PI / 180);
    ctx.translate(x, -y);
    var angleInRadians = angle * Math.PI / 180;
    ctx.rotate(angleInRadians);

    //Draw arrow
    ctx.fillStyle = 'rgb(0,0,0)'; //Black
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000"; //Black
    ctx.lineCap = 'round'; //Circle angle
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(iconSize / 2, border);
    ctx.lineTo(border, iconSize - border);
    ctx.lineTo(iconSize / 2, iconSize / 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.save();

    ctx.restore();
    ctx.fillStyle = 'rgb(255,255,255)'; //White
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(iconSize / 2, border);
    ctx.lineTo(iconSize - border, iconSize - border);
    ctx.lineTo(iconSize / 2, iconSize / 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.save();
};

// 画虚线圆形  性能比较低
WebGraph.Drawing2D.drawDashRound = function(ctx, x, y, radius, step) {
    const count = Math.floor(360 / step);
    step = step / 180 * Math.PI * 2;
    for (let b = 0, e = step / 2; e <= 360; b += step, e += step) {
        ctx.beginPath();
        ctx.arc(x, y, radius, b, e);
        ctx.stroke();
    }
    //drawDashRound(150, 150, 100);
};

//-----------用参数方程绘制椭圆---------------------
//函数的参数x,y为椭圆中心；a,b分别为椭圆横半轴、
//纵半轴长度，不可同时为0
//该方法的缺点是，当lineWidth较宽，椭圆较扁时
//椭圆内部长轴端较为尖锐，不平滑，效率较低
WebGraph.Drawing2D.ParamEllipse = function(ctx, x, y, a, b) {
    // WebGraph.Drawing2D.drawDashRound(ctx,x, y, a,10);
    // return;
    //max是等于1除以长轴值a和b中的较大者
    //i每次循环增加1/max，表示度数的增加
    //这样可以使得每次循环所绘制的路径（弧线）接近1像素
    var step = (a > b) ? 1 / a : 1 / b;
    ctx.beginPath();
    ctx.moveTo(x + a, y); //从椭圆的左端点开始绘制
    for (var i = 0; i < 2 * Math.PI; i += step) {
        //参数方程为x = a * cos(i), y = b * sin(i)，
        //参数为i，表示度数（弧度）
        ctx.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
    }
    ctx.closePath();
    //ctx.fill();
    ctx.stroke();
};


//------------均匀压缩法绘制椭圆--------------------
//其方法是用arc方法绘制圆，结合scale进行
//横轴或纵轴方向缩放（均匀压缩）
//这种方法绘制的椭圆的边离长轴端越近越粗，长轴端点的线宽是正常值
//边离短轴越近、椭圆越扁越细，甚至产生间断，这是scale导致的结果
//这种缺点某些时候是优点，比如在表现环的立体效果（行星光环）时
//对于参数a或b为0的情况，这种方法不适用
WebGraph.Drawing2D.EvenCompEllipse = function(ctx, x, y, a, b) {
    //ctx.save();
    //选择a、b中的较大者作为arc方法的半径参数
    var r = (a > b) ? a : b;
    var ratioX = a / r; //横轴缩放比率
    var ratioY = b / r; //纵轴缩放比率
    ctx.scale(ratioX, ratioY); //进行缩放（均匀压缩）
    ctx.beginPath();
    //从椭圆的左端点开始逆时针绘制
    ctx.moveTo((x + a) / ratioX, y / ratioY);
    ctx.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // ctx.restore();
};

// 三次贝塞尔曲线法一
// 三次贝塞尔曲线绘制椭圆在实际绘制时是一种近似，在理论上也是一种近似。 但因为其效率较高，在计算机矢量图形学中，常用于绘制椭圆，但是具体的理论我不是很清楚。 近似程度在于两个控制点位置的选取。这种方法的控制点位置是我自己试验得出，精度还可以.

//---------使用三次贝塞尔曲线模拟椭圆1---------------------
//此方法也会产生当lineWidth较宽，椭圆较扁时，
//长轴端较尖锐，不平滑的现象
WebGraph.Drawing2D.BezierEllipse1 = function(ctx, x, y, a, b) {
    //关键是bezierCurveTo中两个控制点的设置
    //0.5和0.6是两个关键系数（在本函数中为试验而得）
    var ox = 0.5 * a,
        oy = 0.6 * b;

    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    //从椭圆纵轴下端开始逆时针方向绘制
    ctx.moveTo(0, b);
    ctx.bezierCurveTo(ox, b, a, oy, a, 0);
    ctx.bezierCurveTo(a, -oy, ox, -b, 0, -b);
    ctx.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
    ctx.bezierCurveTo(-a, oy, -ox, b, 0, b);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

};

//---------使用三次贝塞尔曲线模拟椭圆2- 精度较高--------------------
//此方法也会产生当lineWidth较宽，椭圆较扁时
//，长轴端较尖锐，不平滑的现象
//这种方法比前一个贝塞尔方法精确度高，但效率稍差
WebGraph.Drawing2D.BezierEllipse2 = function(ctx, x, y, a, b) {
    var k = .5522848,
        ox = a * k, // 水平控制点偏移量
        oy = b * k; // 垂直控制点偏移量

    ctx.beginPath();
    //从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
    ctx.moveTo(x - a, y);
    ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
    ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
    ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
    ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
    ctx.closePath();
    ctx.stroke();
};
//画五角星
WebGraph.Drawing2D.draw5Star = function(ctx, dx, dy, s) {
    var n = 0;
    // var dx = 100;
    // var dy = 0; 
    // var s = 50;
    //创建路径
    ctx.beginPath();
    // ctx.fillStyle = 'rgba(255,0,0,0.5)';
    var x = Math.sin(0);
    var y = Math.cos(0);
    var dig = Math.PI / 5 * 4;
    for (var i = 0; i < 5; i++) {
        var x = Math.sin(i * dig);
        var y = Math.cos(i * dig);
        ctx.lineTo(dx + x * s, dy + y * s);
    }
    ctx.closePath();
};


//画菱形
WebGraph.Drawing2D.Rhombus = function(ctx, x, y, w, h) {
    var p1 = { X: x, Y: y + h / 2 };
    var p2 = { X: x + w / 2, Y: y };
    var p3 = { X: x + w, Y: y + h / 2 };
    var p4 = { X: x + w / 2, Y: y + h };

    ctx.moveTo(p1.X, p1.Y);
    ctx.beginPath();
    ctx.lineTo(p2.X, p2.Y);
    ctx.lineTo(p3.X, p3.Y);
    ctx.lineTo(p4.X, p4.Y);
    ctx.lineTo(p1.X, p1.Y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
};

//画正多边形
WebGraph.Drawing2D.drawPath = function(ctx, x, y, n, r) {
    var i, ang;
    ang = Math.PI * 2 / n //旋转的角度
    ctx.save(); //保存状态
    ctx.fillStyle = 'rgba(255,0,0,.3)'; //填充红色，半透明
    ctx.strokeStyle = 'hsl(120,50%,50%)'; //填充绿色
    ctx.lineWidth = 1; //设置线宽
    ctx.translate(x, y); //原点移到x,y处，即要画的多边形中心
    ctx.moveTo(0, -r); //据中心r距离处画点
    ctx.beginPath();
    for (i = 0; i < n; i++) {
        ctx.rotate(ang) //旋转
        ctx.lineTo(0, -r); //据中心r距离处连线
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore(); //返回原始状态
    //实例
    // drawPath(100, 100, 5, 40)//在100,100处画一个半径为40的五边形
    // drawPath(200, 100, 3, 40)//在200,100处画一个半径为40的三角形
    // drawPath(300, 100, 7, 40)//在300,100处画一个半径为40的七边形
    // drawPath(100, 200, 15, 40)//在100,200处画一个半径为40的十五边形
    // drawPath(200, 200, 4, 40)//在100,200处画一个半径为40的四边形
};






//画标尺X
WebGraph.Drawing2D.drawRulerX = function(ctx, width) {
    var offsetX = 0;
    var offsetY = 20;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'DimGray';
    ctx.save();
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 1;
    ctx.textAlign = 'center';
    ctx.fillRect(0, 0, width, offsetY);
    ctx.strokeRect(0, 0, width, offsetY);
    var height = 20;
    for (var x = 0; x < width + 50; x = x + 50) {
        offsetX = 20;
        ctx.fillStyle = 'DimGray';
        ctx.fillText(x, x + offsetX + 25, 10);
        for (i = 0; i < 11; i++) {
            height = offsetY - 8;
            if (i % 2 == 0)
                height = offsetY - 5;
            if (i % 10 == 0)
                height = 0;

            ctx.moveTo(x + offsetX, height);
            //之后的lineTo会以上次lineTo的节点为开始
            ctx.lineTo(x + offsetX, offsetY);
            offsetX = offsetX + 5;
        }
        ctx.stroke();
    }
    ctx.restore();

};

//画标尺Y轴
WebGraph.Drawing2D.drawRulerY = function(ctx, length) {
    var offsetX = 0;
    var offsetY = 20;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'DimGray';
    ctx.save();
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.fillRect(0, 0, offsetY, length);
    ctx.strokeRect(0, 0, offsetY, length);
    var height = 20;
    for (var x = 0; x < length + 50; x = x + 50) {
        offsetX = 20;
        ctx.fillStyle = 'DimGray';

        ctx.save();
        ctx.translate(10, x + 25);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(x, 30, -5);
        ctx.restore();

        for (i = 0; i < 11; i++) {
            height = offsetY - 8;
            if (i % 2 == 0)
                height = offsetY - 5;
            if (i % 10 == 0)
                height = 0;

            ctx.moveTo(height, x + offsetX);
            //之后的lineTo会以上次lineTo的节点为开始
            ctx.lineTo(offsetY, x + offsetX);
            offsetX = offsetX + 5;
        }
        ctx.stroke();
    }
    ctx.restore();
};

//画网络线
WebGraph.Drawing2D.drawGrid = function(color, stepx, stepy) {
    ctx.save()
    ctx.strokeStyle = color;
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = stepx + 0.5; i < ctx.canvas.width; i += stepx) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, ctx.canvas.height);
        ctx.stroke();
    }
    for (var i = stepy + 0.5; i < ctx.canvas.height; i += stepy) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(ctx.canvas.width, i);
        ctx.stroke();
    }
    ctx.restore();
};

//画3网络线
WebGraph.Drawing3D.draw3DGrid = function(ctx, width, height, color, length, count) {
    var pX = width / 2;
    var pY = 10; //height/2;
    var nodes = WebGraph.Layout.CircleLayout(pX, pY, length, count);
    ctx.save();

    var lineColor = "FloralWhite";
    // var hexColor=WebGraph.Drawing2D.colourNameToHex(color) ;
    // if (hexColor) {
    // 		var r = hexColor.substring(1, 3);
    // 		var g = hexColor.substring(3, 5);
    // 		var b = hexColor.substring(5, 7);
    // 		var decR = parseInt(r, 16);
    // 		var decG = parseInt(g, 16);
    // 		var decB = parseInt(b, 16);
    // 		var darkFactor1 = .9;
    // 		var darkFactor2 = .5;
    // 		lineColor = 'rgb(' + Math.round(decR * darkFactor1) + ',' + Math.round(decG * darkFactor1) + ',' + Math.round(decB * darkFactor1) + ')';
    // 		//sideColor = 'rgb(' + Math.round(decR * darkFactor2) + ',' + Math.round(decG * darkFactor2) + ',' + Math.round(decB * darkFactor2) + ')';
    // 	}		
    //ctx.translate(0.5, 0.5);//转换成细线条

    // ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 2;
    //ctx.fillRect(0, 0, width,  height);
    var grd;
    //背景  //RoyalBlue
    grd = ctx.createLinearGradient(0, height / 2, 0, height);
    //grd.addColorStop(0,"Blue");
    grd.addColorStop(0, "White");
    //grd.addColorStop(0.1,"FloralWhite");
    //grd.addColorStop(0.5,"FloralWhite");
    //grd.addColorStop(0.6,"FloralWhite");
    grd.addColorStop(1, color);
    ctx.fillStyle = grd;
    ctx.fillRect(0, height / 2, width, height / 2);
    //上下
    //context.createLinearGradient(x0,y0,x1,y1);
    //x0 渐变开始点的 x 坐标 ,y0 渐变开始点的 y 坐标 
    //x1 渐变结束点的 x 坐标 ,y1 渐变结束点的 y 坐标 
    // grd = ctx.createLinearGradient(0,250,0,height/3);
    // grd.addColorStop(1, "WhiteSmoke");
    // grd.addColorStop(0,color);	
    // ctx.strokeStyle =  grd;
    //ctx.fillStyle =grd;
    ctx.strokeStyle = lineColor;
    var topY = 50;
    for (var i = 0; i < count; i++) {

        // grd = ctx.createLinearGradient(0,0,nodes[i].X ,nodes[i].Y);
        // grd.addColorStop(1, "FloralWhite");
        // grd.addColorStop(0,color);	
        // ctx.strokeStyle =  grd;

        ctx.beginPath();
        ctx.moveTo(nodes[i].X, nodes[i].Y);
        ctx.lineTo(pX, pY);
        ctx.stroke();

        ctx.moveTo(0, topY);
        ctx.lineTo(width, topY);
        ctx.stroke();
        topY += 10 + i * 2;
    }


    grd = ctx.createLinearGradient(0, 0, 0, height / 2);
    grd.addColorStop(0, color);
    //grd.addColorStop(0.8,"FloralWhite");
    grd.addColorStop(1, "White");

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height / 2);
    ctx.restore();
};




//eleva //仰角
WebGraph.Drawing3D.Rect = function(ctx, x, y, width, height, depth, eleva, strokeWidth, strokeColor, fillColor) {
        //三个面顶点坐标（上 前 右侧）
        var topPoints;
        var frontPoints;
        var sidePoints;
        //三个面颜色
        var frontColor;
        var sideColor;
        var topColor = fillColor;
        var hexColor = fillColor; // this.colourNameToHex(color);
        if (hexColor) {
            var r = hexColor.substring(1, 3);
            var g = hexColor.substring(3, 5);
            var b = hexColor.substring(5, 7);
            var decR = parseInt(r, 16);
            var decG = parseInt(g, 16);
            var decB = parseInt(b, 16);
            var darkFactor1 = .8;
            var darkFactor2 = .5;
            frontColor = 'rgb(' + Math.round(decR * darkFactor1) + ',' + Math.round(decG * darkFactor1) + ',' + Math.round(decB * darkFactor1) + ')';
            sideColor = 'rgb(' + Math.round(decR * darkFactor2) + ',' + Math.round(decG * darkFactor2) + ',' + Math.round(decB * darkFactor2) + ')';
        }

        var pNW = {
            x: me.x,
            y: me.y
        };
        var pNE = {
            x: me.x + me.width,
            y: me.y
        };
        var pSW = {
            x: me.x,
            y: me.y + me.height
        };
        var pSE = {
            x: me.x + me.width,
            y: me.y + me.height
        };
        var pNW2 = WebGraph.Math.getAnglePoint({
            x: me.x,
            y: me.y
        }, me.depth, me.eleva);
        var pNE2 = {
            x: pNW2.x + me.width,
            y: pNW2.y
        };
        var pSW2 = {
            x: pNW2.x,
            y: pNW2.y + me.height
        };
        var pSE2 = {
            x: pNW2.x + me.width,
            y: pNW2.y + me.height
        };

        topPoints = pNW.x + "," + pNW.y + " " + pNW2.x + "," + pNW2.y + " " + pNE2.x + "," + pNE2.y + " " + pNE.x + "," + pNE.y + " " + pNW.x + "," + pNW.y;
        frontPoints = pNW.x + "," + pNW.y + " " + pNE.x + "," + pNE.y + " " + pSE.x + "," + pSE.y + " " + pSW.x + "," + pSW.y + " " + pNW.x + "," + pNW.y;
        sidePoints = pNE.x + "," + pNE.y + " " + pNE2.x + "," + pNE2.y + " " + pSE2.x + "," + pSE2.y + " " + pSE.x + "," + pSE.y + " " + pNE.x + "," + pNE.y;
        //顶面
        var ps = topPoints.split(" ");
        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = topColor;
        ctx.beginPath();
        for (var i = 0; i < ps.length - 1; i++) {
            var p = ps[i].split(",");
            var p1 = ps[i].split(",");
            if (i == 0)
                ctx.moveTo(parseInt(p[0]), parseInt(p[1]));
            else {
                ctx.lineTo(parseInt(p[0]), parseInt(p[1]));
                ctx.lineTo(parseInt(p1[0]), parseInt(p1[1]));
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        //前面
        ps = frontPoints.split(" ");
        ctx.fillStyle = frontColor;
        ctx.beginPath();
        for (var i = 0; i < ps.length - 1; i++) {
            var p = ps[i].split(",");
            var p1 = ps[i].split(",");
            if (i == 0)
                ctx.moveTo(parseInt(p[0]), parseInt(p[1]));
            else {
                ctx.lineTo(parseInt(p[0]), parseInt(p[1]));
                ctx.lineTo(parseInt(p1[0]), parseInt(p1[1]));
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        //侧面
        ps = sidePoints.split(" ");
        ctx.fillStyle = sideColor;
        ctx.beginPath();
        for (var i = 0; i < ps.length - 1; i++) {
            var p = ps[i].split(",");
            var p1 = ps[i].split(",");
            if (i == 0)
                ctx.moveTo(parseInt(p[0]), parseInt(p[1]));
            else {
                ctx.lineTo(parseInt(p[0]), parseInt(p[1]));
                ctx.lineTo(parseInt(p1[0]), parseInt(p1[1]));
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();



    }
    // var WebGraph.Drawing3D = {
    // };//图形渲染器[randerer]对象
    //亮
var brighterMatrix = [1, 0, 0, 0, 30,
    0, 1, 0, 0, 30,
    0, 0, 1, 0, 30,
    0, 0, 0, 1, 0
];
//暗
var darkerMatrix = [
    1, 0, 0, 0, -30,
    0, 1, 0, 0, -30,
    0, 0, 1, 0, -30,
    0, 0, 0, 1, 0
];

// Color Matrix Filter function      
colorMatrixFilter = function(pixels, m) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];
        var a = d[i + 3];

        d[i] = r * m[0] + g * m[1] + b * m[2] + a * m[3] + m[4];
        d[i + 1] = r * m[5] + g * m[6] + b * m[7] + a * m[8] + m[9];
        d[i + 2] = r * m[10] + g * m[11] + b * m[12] + a * m[13] + m[14];
        d[i + 3] = r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19];
    }
    return pixels;
};

//Apply the current color matrix to the currently loaded image
function processImage(context, currentColorMatrix, x, y, w, h) {
    // if (w>0 && return;
    // if (currentImage.width != canvas.width)
    //   canvas.width = currentImage.width;
    // if (currentImage.height != canvas.height)
    //   canvas.height = currentImage.height;

    // context.clearRect(x,y, currentImage.width, currentImage.height);
    // context.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    if (w > 0 && h > 0) {
        context.putImageData(colorMatrixFilter(context.getImageData(x, y,
            w, h), currentColorMatrix), 0, 0);
    }
}

function hoverImage(context, x, y, w, h) {

    if (w > 0 && h > 0) {
        context.putImageData(colorMatrixFilter(context.getImageData(x, y,
            w, h), brighterMatrix), x, y);
    }
}

//颜色加亮
getNewColor = function(colour, darkFactor) {
    var hexColor = colourNameToHex(colour);
    if (hexColor) {
        var r = hexColor.substring(1, 3);
        var g = hexColor.substring(3, 5);
        var b = hexColor.substring(5, 7);
        var decR = parseInt(r, 16);
        var decG = parseInt(g, 16);
        var decB = parseInt(b, 16);
        // var darkFactor1 = .8;
        // var darkFactor2 = .5;
        resultColor = 'rgb(' + Math.round(decR * darkFactor) + ',' + Math.round(decG * darkFactor) + ',' + Math.round(decB * darkFactor) + ')';
        return resultColor;
    }
    return false;

    // 什么是亮度：
    // 简单点说一幅图像的亮度属性是图像的RGB值的大小，RGB各个值越大亮度越高RGB
    // 分量取值范围为0～255之间。调整图像亮度。
    // 什么是饱和度：
    // 饱和度是是指颜色的强度，调整饱和度可以修正过度曝光或者未充分曝光的图片。使
    // 图像看上去更加自然。

}

//颜色[转换16进制颜色]
colourNameToHex = function(colour) {
    if (colour.indexOf('#') > -1)
        return colour;
    var colours = {
        "aliceblue": "#f0f8ff",
        "antiquewhite": "#faebd7",
        "aqua": "#00ffff",
        "aquamarine": "#7fffd4",
        "azure": "#f0ffff",
        "beige": "#f5f5dc",
        "bisque": "#ffe4c4",
        "black": "#000000",
        "blanchedalmond": "#ffebcd",
        "blue": "#0000ff",
        "blueviolet": "#8a2be2",
        "brown": "#a52a2a",
        "burlywood": "#deb887",
        "cadetblue": "#5f9ea0",
        "chartreuse": "#7fff00",
        "chocolate": "#d2691e",
        "coral": "#ff7f50",
        "cornflowerblue": "#6495ed",
        "cornsilk": "#fff8dc",
        "crimson": "#dc143c",
        "cyan": "#00ffff",
        "darkblue": "#00008b",
        "darkcyan": "#008b8b",
        "darkgoldenrod": "#b8860b",
        "darkgray": "#a9a9a9",
        "darkgreen": "#006400",
        "darkkhaki": "#bdb76b",
        "darkmagenta": "#8b008b",
        "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00",
        "darkorchid": "#9932cc",
        "darkred": "#8b0000",
        "darksalmon": "#e9967a",
        "darkseagreen": "#8fbc8f",
        "darkslateblue": "#483d8b",
        "darkslategray": "#2f4f4f",
        "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3",
        "deeppink": "#ff1493",
        "deepskyblue": "#00bfff",
        "dimgray": "#696969",
        "dodgerblue": "#1e90ff",
        "firebrick": "#b22222",
        "floralwhite": "#fffaf0",
        "forestgreen": "#228b22",
        "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc",
        "ghostwhite": "#f8f8ff",
        "gold": "#ffd700",
        "goldenrod": "#daa520",
        "gray": "#808080",
        "green": "#008000",
        "greenyellow": "#adff2f",
        "honeydew": "#f0fff0",
        "hotpink": "#ff69b4",
        "indianred ": "#cd5c5c",
        "indigo ": "#4b0082",
        "ivory": "#fffff0",
        "khaki": "#f0e68c",
        "lavender": "#e6e6fa",
        "lavenderblush": "#fff0f5",
        "lawngreen": "#7cfc00",
        "lemonchiffon": "#fffacd",
        "lightblue": "#add8e6",
        "lightcoral": "#f08080",
        "lightcyan": "#e0ffff",
        "lightgoldenrodyellow": "#fafad2",
        "lightgrey": "#d3d3d3",
        "lightgreen": "#90ee90",
        "lightpink": "#ffb6c1",
        "lightsalmon": "#ffa07a",
        "lightseagreen": "#20b2aa",
        "lightskyblue": "#87cefa",
        "lightslategray": "#778899",
        "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0",
        "lime": "#00ff00",
        "limegreen": "#32cd32",
        "linen": "#faf0e6",
        "magenta": "#ff00ff",
        "maroon": "#800000",
        "mediumaquamarine": "#66cdaa",
        "mediumblue": "#0000cd",
        "mediumorchid": "#ba55d3",
        "mediumpurple": "#9370d8",
        "mediumseagreen": "#3cb371",
        "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a",
        "mediumturquoise": "#48d1cc",
        "mediumvioletred": "#c71585",
        "midnightblue": "#191970",
        "mintcream": "#f5fffa",
        "mistyrose": "#ffe4e1",
        "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead",
        "navy": "#000080",
        "oldlace": "#fdf5e6",
        "olive": "#808000",
        "olivedrab": "#6b8e23",
        "orange": "#ffa500",
        "orangered": "#ff4500",
        "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa",
        "palegreen": "#98fb98",
        "paleturquoise": "#afeeee",
        "palevioletred": "#d87093",
        "papayawhip": "#ffefd5",
        "peachpuff": "#ffdab9",
        "peru": "#cd853f",
        "pink": "#ffc0cb",
        "plum": "#dda0dd",
        "powderblue": "#b0e0e6",
        "purple": "#800080",
        "red": "#ff0000",
        "rosybrown": "#bc8f8f",
        "royalblue": "#4169e1",
        "saddlebrown": "#8b4513",
        "salmon": "#fa8072",
        "sandybrown": "#f4a460",
        "seagreen": "#2e8b57",
        "seashell": "#fff5ee",
        "sienna": "#a0522d",
        "silver": "#c0c0c0",
        "skyblue": "#87ceeb",
        "slateblue": "#6a5acd",
        "slategray": "#708090",
        "snow": "#fffafa",
        "springgreen": "#00ff7f",
        "steelblue": "#4682b4",
        "tan": "#d2b48c",
        "teal": "#008080",
        "thistle": "#d8bfd8",
        "tomato": "#ff6347",
        "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3",
        "white": "#ffffff",
        "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00",
        "yellowgreen": "#9acd32"
    };

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return false;
};

// //参数：
// //
// //nvert: 多边形的顶点数
// //vertx, verty: 顶点X坐标和Y坐标分别组成的数组
// //testx, testy: 需要测试的点的X坐标和Y坐标

// //CanvasRenderingContext2D  圆角框
// //       var ctx = elem.getContext('2d');  
// //        ctx.fillStyle   = '#00f';  
// //        ctx.strokeStyle = '#0f0';  
// //        ctx.lineWidth   = 10;  
// //        ctx.globalAlpha   = 1;  
// //        //lineCap指定线条的末端如何绘制,round这个值指定了线段应该带有一个半圆形的线帽，半圆的直径等于线段的宽度，并且线段在端点之外扩展了线段宽度的一半。  
// //        ctx.lineCap = "round";  
// //        //lineJoin 属性说明如何绘制交点。值 "round" 说明定点的外边缘应该和一个填充的弧接合，这个弧的直径等于线段的宽度。"  
// //        ctx.lineJoin = "round";  
// //  
// //        ctx.beginPath();  
// //        ctx.moveTo(10, 10);  
// //        ctx.lineTo(200, 10);  
// //        ctx.lineTo(200, 200);  
// //        ctx.lineTo(10, 200);  
// //        ctx.lineTo(10, 10);  
// //        //ctx.fill();  
// //        ctx.stroke();  
// //        ctx.closePath();  
// // 圆角矩形
//     roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
// 	if (typeof stroke == "undefined") {
// 		stroke = true;
// 	}
// 	if (typeof radius === "undefined") {
// 		radius = 5;
// 	}
// 	ctx.beginPath();
// 	ctx.moveTo(x + radius, y);
// 	ctx.lineTo(x + width - radius, y);
// 	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
// 	ctx.lineTo(x + width, y + height - radius);
// 	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
// 	ctx.lineTo(x + radius, y + height);
// 	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
// 	ctx.lineTo(x, y + radius);
// 	ctx.quadraticCurveTo(x, y, x + radius, y);
// 	ctx.closePath();

// 	if (fill) {
// 		ctx.fill();
// 	}
// 	if (stroke) {
// 		ctx.stroke();
// 	}
// };

// //虚线
// dashedLine = function(ctx, fromX, fromY, toX, toY, pattern) {
// 	// default interval distance -> 5px 
// 	if (typeof pattern === "undefined") {
// 		pattern = 5;
// 	}
// 	// calculate the delta x and delta y 
// 	var dx = (toX - fromX);
// 	var dy = (toY - fromY);
// 	var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
// 	var dashlineInteveral = (pattern <= 0) ? distance : (distance / pattern);
// 	var deltay = (dy / distance) * pattern;
// 	var deltax = (dx / distance) * pattern;
// 	// draw dash line 
// 	ctx.beginPath();
// 	for (var dl = 0; dl < dashlineInteveral; dl++) {
// 		if (dl % 2) {
// 			ctx.lineTo(fromX + dl * deltax, fromY + dl * deltay);
// 		} else {
// 			ctx.moveTo(fromX + dl * deltax, fromY + dl * deltay);
// 		}
// 	}
// 	ctx.stroke();
// };

// //直线箭头  lineArrow(ctx,0,0,0,0,300,100,2)
// lineArrow = function(ctx, ox, oy, x1, y1, x2, y2, lineWidth) {
// 	//参数说明 canvas的 id ，原点坐标  第一个端点的坐标，第二个端点的坐标
// 	var sta = new Array(x1, y1);
// 	var end = new Array(x2, y2);

// 	if (ctx == null) return false;
// 	//ctx.lineWidth = lineWidth;
// 	// //画线 
// 	// ctx.beginPath();
// 	// ctx.translate(ox, oy, 0); //坐标源点 
// 	// ctx.moveTo(sta[0], sta[1]);
// 	// ctx.lineTo(end[0], end[1]);
// 	// ctx.fill();
// 	// ctx.stroke();
// 	ctx.save();

// 	//画箭头 
// 	ctx.translate(end[0], end[1]);
// 	//我的箭头本垂直向下，算出直线偏离Y的角，然后旋转 ,rotate是顺时针旋转的，所以加个负号
// 	var ang = (end[0] - sta[0]) / (end[1] - sta[1]);
// 	ang = Math.atan(ang);
// 	if (end[1] - sta[1] >= 0) {
// 		ctx.rotate(-ang);
// 	} else {
// 		ctx.rotate(Math.PI - ang); //加个180度，反过来
// 	}
// 	var w =lineWidth*2;
// 	//ctx.lineWidth =1;// lineWidth;
// 	//-------------------->
// 	ctx.beginPath();
// 	ctx.moveTo(-(5 + w), -(10 + w * 2));
// 	//ctx.lineTo(-(5 + w), -(10 + w * 2));
// 	ctx.lineTo(0, -(5 + w));
// 	ctx.lineTo((5 + w), -(10 + w * 2));
// 	ctx.lineTo(0,lineWidth);
// 	//ctx.lineTo(-(5 + w), -(10 + w * 2));

//    ctx.fill(); //箭头是个封闭图形
//    //ctx.stroke();

// 	ctx.restore(); //恢复到堆的上一个状态，其实这里没什么用。
// 	ctx.closePath();

// };
// //画箭头 
// drawArrow = function(ctx, x1, y1, x2, y2) {
// 	//参数说明 canvas的 id ，原点坐标  第一个端点的坐标，第二个端点的坐标
// 	var sta = new Array(x1, y1);
// 	var end = new Array(x2, y2);

// 	if (ctx == null) return false; 
// 	ctx.save();

// 	//画箭头 
// 	ctx.translate(end[0], end[1]);
// 	//我的箭头本垂直向下，算出直线偏离Y的角，然后旋转 ,rotate是顺时针旋转的，所以加个负号
// 	var ang = (end[0] - sta[0]) / (end[1] - sta[1]);
// 	ang = Math.atan(ang);
// 	if (end[1] - sta[1] >= 0) {
// 		ctx.rotate(-ang);
// 	} else {
// 		ctx.rotate(Math.PI - ang); //加个180度，反过来
// 	}
// 	var w =ctx.lineWidth;
// 	//ctx.lineWidth =1;// lineWidth;
// 	//-------------------->
// 	ctx.beginPath();
// 	ctx.moveTo(-(5 + w), -(10 + w * 2));
// 	//ctx.lineTo(-(5 + w), -(10 + w * 2));
// 	ctx.lineTo(0, -(5 + w));
// 	ctx.lineTo((5 + w), -(10 + w * 2));
// 	ctx.lineTo(0,ctx.lineWidth);
// 	//ctx.lineTo(-(5 + w), -(10 + w * 2));

//    ctx.fill(); //箭头是个封闭图形
//    //ctx.stroke();

// 	ctx.restore(); //恢复到堆的上一个状态，其实这里没什么用。
// 	ctx.closePath();

// };

// // 箭头
//  drawArrow2=function(canvas, angle) {
// 	//Init canvas
// 	var context = canvas.getContext('2d');
// 	var width = canvas.width;
// 	var height = canvas.height;
// 	context.clearRect(0, 0, width, height);

// 	//Rotate
// 	var distance = iconSize / 2 * Math.sqrt(2) * Math.sin(angle * Math.PI / 180 / 2) * 2;
// 	var degree = 180 - 45 - (180 - angle) / 2;
// 	var x = distance * Math.sin(degree * Math.PI / 180);
// 	var y = distance * Math.cos(degree * Math.PI / 180);
// 	context.translate(x, -y);
// 	var angleInRadians = angle * Math.PI / 180;
// 	context.rotate(angleInRadians);

// 	//Draw arrow
// 	context.fillStyle = 'rgb(0,0,0)'; //Black
// 	context.lineWidth = 1;
// 	context.strokeStyle = "#000000"; //Black
// 	context.lineCap = 'round'; //Circle angle
// 	context.lineJoin = 'round';
// 	context.beginPath();
// 	context.moveTo(iconSize / 2, border);
// 	context.lineTo(border, iconSize - border);
// 	context.lineTo(iconSize / 2, iconSize / 2);
// 	context.fill();
// 	context.stroke();
// 	context.closePath();
// 	context.save();

// 	context.restore();
// 	context.fillStyle = 'rgb(255,255,255)'; //White
// 	context.lineWidth = 1;
// 	context.strokeStyle = "#000000";
// 	context.lineCap = 'round';
// 	context.lineJoin = 'round';
// 	context.beginPath();
// 	context.moveTo(iconSize / 2, border);
// 	context.lineTo(iconSize - border, iconSize - border);
// 	context.lineTo(iconSize / 2, iconSize / 2);
// 	context.fill();
// 	context.stroke();
// 	context.closePath();
// 	context.save();
// }



// //-----------用参数方程绘制椭圆---------------------
// //函数的参数x,y为椭圆中心；a,b分别为椭圆横半轴、
// //纵半轴长度，不可同时为0
// //该方法的缺点是，当lineWidth较宽，椭圆较扁时
// //椭圆内部长轴端较为尖锐，不平滑，效率较低
// ParamEllipse=function (context, x, y, a, b)
// {
//    //max是等于1除以长轴值a和b中的较大者
//    //i每次循环增加1/max，表示度数的增加
//    //这样可以使得每次循环所绘制的路径（弧线）接近1像素
//    var step = (a > b) ? 1 / a : 1 / b;
//    context.beginPath();
//    context.moveTo(x + a, y); //从椭圆的左端点开始绘制
//    for (var i = 0; i < 2 * Math.PI; i += step)
//    {
//       //参数方程为x = a * cos(i), y = b * sin(i)，
//       //参数为i，表示度数（弧度）
//       context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
//    }
//    context.closePath();
//    context.fill();
//    context.stroke();
// }


// //------------均匀压缩法绘制椭圆--------------------
// //其方法是用arc方法绘制圆，结合scale进行
// //横轴或纵轴方向缩放（均匀压缩）
// //这种方法绘制的椭圆的边离长轴端越近越粗，长轴端点的线宽是正常值
// //边离短轴越近、椭圆越扁越细，甚至产生间断，这是scale导致的结果
// //这种缺点某些时候是优点，比如在表现环的立体效果（行星光环）时
// //对于参数a或b为0的情况，这种方法不适用
// EvenCompEllipse=function (context, x, y, a, b)
// {
//    context.save();
//    //选择a、b中的较大者作为arc方法的半径参数
//    var r = (a > b) ? a : b; 
//    var ratioX = a / r; //横轴缩放比率
//    var ratioY = b / r; //纵轴缩放比率
//    context.scale(ratioX, ratioY); //进行缩放（均匀压缩）
//    context.beginPath();
//    //从椭圆的左端点开始逆时针绘制
//    context.moveTo((x + a) / ratioX, y / ratioY);
//    context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI);
//    context.closePath();
//    context.stroke();
//    context.restore();
// }

// // 三次贝塞尔曲线法一
// // 三次贝塞尔曲线绘制椭圆在实际绘制时是一种近似，在理论上也是一种近似。 但因为其效率较高，在计算机矢量图形学中，常用于绘制椭圆，但是具体的理论我不是很清楚。 近似程度在于两个控制点位置的选取。这种方法的控制点位置是我自己试验得出，精度还可以.

// //---------使用三次贝塞尔曲线模拟椭圆1---------------------
// //此方法也会产生当lineWidth较宽，椭圆较扁时，
// //长轴端较尖锐，不平滑的现象
// BezierEllipse1=function (context, x, y, a, b)
// {
//    //关键是bezierCurveTo中两个控制点的设置
//    //0.5和0.6是两个关键系数（在本函数中为试验而得）
//    var ox = 0.5 * a,
//        oy = 0.6 * b;

//    context.save();
//    context.translate(x, y);
//    context.beginPath();
//    //从椭圆纵轴下端开始逆时针方向绘制
//    context.moveTo(0, b); 
//    context.bezierCurveTo(ox, b, a, oy, a, 0);
//    context.bezierCurveTo(a, -oy, ox, -b, 0, -b);
//    context.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
//    context.bezierCurveTo(-a, oy, -ox, b, 0, b);
//    context.closePath();
//    context.stroke();
//    context.restore();

// }

// //---------使用三次贝塞尔曲线模拟椭圆2- 精度较高--------------------
// //此方法也会产生当lineWidth较宽，椭圆较扁时
// //，长轴端较尖锐，不平滑的现象
// //这种方法比前一个贝塞尔方法精确度高，但效率稍差
// BezierEllipse2=function (ctx, x, y, a, b)
// {
//    var k = .5522848,
//    ox = a * k, // 水平控制点偏移量
//    oy = b * k; // 垂直控制点偏移量

//    ctx.beginPath();
//    //从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
//    ctx.moveTo(x - a, y);
//    ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
//    ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
//    ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
//    ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
//    ctx.closePath();
//    ctx.stroke();
// }
// //画五角星
//  draw5Star=function (context,dx,dy,s) {
//         var n = 0;
//         // var dx = 100;
//         // var dy = 0; 
//         // var s = 50;
//         //创建路径
//      context.beginPath();
//     // context.fillStyle = 'rgba(255,0,0,0.5)';
//      var x = Math.sin(0);
//      var y = Math.cos(0);
//      var dig = Math.PI / 5 * 4;
//      for (var i = 0; i < 5; i++) {
//          var x = Math.sin(i * dig);
//          var y = Math.cos(i * dig);
//          context.lineTo(dx + x * s, dy + y * s);
//      }
//      context.closePath();
//  }
// //画正多边形
//  drawPath=function (context,x, y, n, r)
//   {
//    var i,ang;
//    ang = Math.PI*2/n //旋转的角度
//    context.save();//保存状态
//    context.fillStyle ='rgba(255,0,0,.3)';//填充红色，半透明
//    context.strokeStyle ='hsl(120,50%,50%)';//填充绿色
//    context.lineWidth = 1;//设置线宽
//    context.translate(x, y);//原点移到x,y处，即要画的多边形中心
//    context.moveTo(0, -r);//据中心r距离处画点
//    context.beginPath();
//    for(i = 0;i < n; i ++)
//    {
//      context.rotate(ang)//旋转
//      context.lineTo(0, -r);//据中心r距离处连线
//    }
//     context.closePath();
//     context.stroke();
//     context.fill();
//     context.restore();//返回原始状态
//   //实例
//   // drawPath(100, 100, 5, 40)//在100,100处画一个半径为40的五边形
//   // drawPath(200, 100, 3, 40)//在200,100处画一个半径为40的三角形
//   // drawPath(300, 100, 7, 40)//在300,100处画一个半径为40的七边形
//   // drawPath(100, 200, 15, 40)//在100,200处画一个半径为40的十五边形
//   // drawPath(200, 200, 4, 40)//在100,200处画一个半径为40的四边形
//  }


//  //画标尺X
//  function drawRulerX(ctx, width) {
// 	var offsetX = 0;
// 	var offsetY = 20;
// 	ctx.fillStyle = 'white';
// 	ctx.strokeStyle = 'DimGray';
// 	ctx.save();
// 	ctx.translate(0.5, 0.5);
// 	ctx.lineWidth = 1;
// 	ctx.textAlign = 'center';
// 	ctx.fillRect(0, 0, width, offsetY);
// 	ctx.strokeRect(0, 0, width, offsetY);
// 	var height = 20;
// 	for (var x = 0; x < width + 50; x = x + 50) {
// 		offsetX = 20;
// 		ctx.fillStyle = 'DimGray';
// 		ctx.fillText(x, x+offsetX + 25, 10);
// 		for (i = 0; i < 11; i++) {
// 			height = offsetY - 8;
// 			if (i % 2 == 0)
// 				height = offsetY - 5;
// 			if (i % 10 == 0)
// 				height = 0;

// 			ctx.moveTo(x + offsetX, height);
// 			//之后的lineTo会以上次lineTo的节点为开始
// 			ctx.lineTo(x + offsetX, offsetY);
// 			offsetX = offsetX + 5;
// 		}
// 		ctx.stroke();
// 	}
// 	ctx.restore();

// }

// //画标尺Y轴
// function drawRulerY(ctx, length) {
// 	var offsetX = 0;
// 	var offsetY = 20;
// 	ctx.fillStyle = 'white';
// 	ctx.strokeStyle = 'DimGray';
// 	ctx.save();
// 	ctx.translate(0.5, 0.5);
// 	ctx.lineWidth = 1;
// 	ctx.textAlign = 'center';
// 	ctx.textBaseline = "middle";
// 	ctx.fillRect(0, 0, offsetY, length);
// 	ctx.strokeRect(0, 0, offsetY, length);
// 	var height = 20;
// 	for (var x = 0; x < length + 50; x = x + 50) {
// 		offsetX = 20;
// 		ctx.fillStyle = 'DimGray';

// 		ctx.save();
// 		ctx.translate(10,x + 25);
// 		ctx.rotate(-Math.PI/2);
// 		ctx.fillText(x, 30,-5);
// 		ctx.restore();

// 		for (i = 0; i < 11; i++) {
// 			height = offsetY - 8;
// 			if (i % 2 == 0)
// 				height = offsetY - 5;
// 			if (i % 10 == 0)
// 				height = 0;

// 			ctx.moveTo(height,x + offsetX);
// 			//之后的lineTo会以上次lineTo的节点为开始
// 			ctx.lineTo(offsetY,x + offsetX);
// 			offsetX = offsetX + 5;
// 		}
// 		ctx.stroke();
// 	}
// 	ctx.restore();
//  }

//  //画网络线
//  function drawGrid(color, stepx, stepy) {
//    context.save()
//    context.strokeStyle = color;
//    context.fillStyle = '#ffffff';
//    context.lineWidth = 0.5;
//    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
//    for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
//      context.beginPath();
//      context.moveTo(i, 0);
//      context.lineTo(i, context.canvas.height);
//      context.stroke();
//    }
//    for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
//      context.beginPath();
//      context.moveTo(0, i);
//      context.lineTo(context.canvas.width, i);
//      context.stroke();
//    }
//    context.restore();
// };

//  //画网络线
//  function draw3DGrid(context,width,height,color, length, count) {
//    var pX=width/2;
//    var pY=0;//height/2;
//  	 var nodes=  CircleLayout(pX,pY,length,count)	 ;
//    context.save();
//    context.strokeStyle = color;
//   // context.fillStyle = '#ffffff';
//    context.lineWidth = 1;
//   //context.fillRect(0, 0, width,  height);

//   var grd;
//  //上下
//  grd = context.createLinearGradient(width/2,height,width/2,height/2);

// 							grd.addColorStop(0,color);
// 							grd.addColorStop(1, "white");
// 							context.strokeStyle =  grd;
// 							//context.fillStyle =grd;

//   var topY=50;
//    for (var i =0; i <count; i++ ){

//      context.beginPath();
//      context.moveTo(nodes[i].X ,nodes[i].Y);
//      context.lineTo(pX,pY);
//      context.stroke();

//      context.moveTo(0,topY);
//      context.lineTo(width,topY);
//      context.stroke();
//      topY+=10+i*2;
//    }


//    // context.lineWidth = 0;
//    // context.fillStyle = 'white';
//    //  context.fillRect(0, 0, width,  height/3);

//    context.restore();
// };


// //颜色
// function colourNameToHex(colour) {
//   var colours = {
//       "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
//       "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
//       "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
//       "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
//       "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
//       "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
//       "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
//       "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
//       "honeydew": "#f0fff0", "hotpink": "#ff69b4",
//       "indianred ": "#cd5c5c", "indigo ": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
//       "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
//       "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
//       "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
//       "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
//       "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
//       "navajowhite": "#ffdead", "navy": "#000080",
//       "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
//       "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
//       "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
//       "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
//       "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
//       "violet": "#ee82ee",
//       "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
//       "yellow": "#ffff00", "yellowgreen": "#9acd32"
//   };

//   if (typeof colours[colour.toLowerCase()] != 'undefined')
//       return colours[colour.toLowerCase()];

//   return false;
// }


/*-*/

/* 
 *事件处理类
 *作者： 刘金山
 *日期： 2014-07-01
 */
WebGraph.Model.Event = {
    createNew: function(webCanvas) {
        var evt = {};
        var w = webCanvas;
        evt.downPoint;
        evt.linkRect;
        evt.startLinkRect;
        //鼠标down
        evt.mouseDown = function(e) {
            w.isMousedown = true;

            if (w.toolTip && w.toolTip.visible) w.toolTip.hideToolTip();
            if (w.contextMenu && w.contextMenu.visible) w.contextMenu.hidenMenu();

            w.startPoint = {
                X: e.pageX,
                Y: e.pageY
            };

            var coor = evt.getCoorConver(e.pageX, e.pageY);
            evt.downPoint = coor;
            if (w.operateState == 'new') {
                w.newShape(coor, w.shapeType);
                w.draw();
                return;
            }

            if (w.operateState == 'moveAll') return;
            if (w.operateState == 'resize' || w.operateState == 'linkPointMove') {
                w.selectedShape.mouseDown(e, coor);
                return;
            }

            var shape = evt.getPointShape(coor.x, coor.y);

            if (shape != null && shape == w.selectedShape) {
                //右键事件
                if (e.button == 2) {
                    //alert( '右键事件 ID：' +  w.selectedShape.id);
                    if (w.contextMenu && w.selectedShape.showMenu)
                        w.contextMenu.showMenu(e, w.selectedShape);
                    return;
                }
                if (w.operateState == 'linkPointMove') return;
                if (w.selectedShape.allowDrog) {
                    w.operateState = 'move';
                    //w.canvas.style.cursor = 'move';
                    return;
                }
            }
            if (w.selectedShape != null) {
                w.selectedShape.setSelected(false);
                w.selectedShape = null;
            }
            w.setSelectedShape(shape);
            //w.selectedShape = shape;

            if (w.selectedShape != null) {
                w.selectedShape.webCanvas = w;
                w.selectedShape.setSelected(true);

                if (w.selectedShape.allowDrog == true) {
                    w.operateState = 'move';
                    //w.canvas.style.cursor = 'move';
                }

                w.selectedShape.mouseDown(e, coor);
                return;
            }
            // else {
            // 	// if (w.operateState != 'rectSelect') {
            // 		w.rectSelect = null;
            // 		w.draw();
            // 		return;
            // 	// }
            // }

            w.canvas.style.cursor = 'default';
            //不是右键，设置框选
            if (e.button != 2) w.setRectSelect();
            w.clearSelectedShape();
            w.draw();
        };
        evt.mouseUp = function(e) {
            var coor = evt.getCoorConver(e.pageX, e.pageY);
            w.isMousedown = false;
            if (w.operateState == 'moveAll') return;

            if (w.selectedShape)
                w.selectedShape.mouseUp(e, coor);
            if (w.operateState == 'rectSelect') {
                w.getRecShapes(w.rectSelect.x, w.rectSelect.y, w.rectSelect.width, w.rectSelect.height);
                w.setRectSelect();
                w.draw();
            }
            evt.downPoint = null;
            w.operateState = 'none';
        };

        //鼠标移动事件w.canvas.onmousemove
        evt.mouseMove = function(e) {
            if (w.operateState == 'new') return;
            //连接点画线
            if (w.operateState == 'link' && w.isMousedown) {

                // if ( evt.startLinkRect==null)
                //              {
                //           evt.startLinkRect= WebGraph.Shape.Rect.createNew();
                // 	evt.startLinkRect.id ="startLinkRectID";
                // 	evt.startLinkRect.allowDrog=true;
                // 	evt.startLinkRect.editSize=false; 
                // 	evt.startLinkRect.shadow=false;
                // 	evt.startLinkRect.showLinkPoint=false;

                // 	evt.startLinkRect.init(e.pageX, e.pageY, 5, 5, 0, "#000000", "#111111" );
                // 	w.addShape(evt.startLinkRect);
                //              }
                //              if ( evt.linkRect==null)
                //              {
                // 	evt.linkRect= WebGraph.Shape.Rect.createNew();
                // 	evt.linkRect.id ="linkRectID";
                // 	evt.linkRect.allowDrog=true;
                // 	evt.linkRect.editSize=false; 
                // 	evt.linkRect.shadow=false;
                // 	evt.linkRect.showLinkPoint=false;

                // 	evt.linkRect.init(e.pageX, e.pageY, 5, 5, 0, "#000000", "#111111" );
                // 	w.addShape(evt.linkRect);

                //              if (w.connector==null)
                //              {
                // 	 var conn= WebGraph.Model.Connector.createNew();
                // 	     conn.init(w);			  
                // 	    w.connector=conn;
                //              }
                //               w.connector.addLinkLine(evt.startLinkRect,evt.linkRect,"");
                // }
                return;
            }

            if (w.operateState == 'X') {

                return;
            }
            //整体移动处理
            if (w.operateState == 'moveAll') {
                if (w.isMousedown) {
                    var newX = w.startPoint.X - e.pageX;
                    var newY = w.startPoint.Y - e.pageY;
                    w.startPoint = {
                        X: e.pageX,
                        Y: e.pageY
                    };
                    evt.moveAll(newX, newY);
                }
                return;
            }
            var coor = evt.getCoorConver(e.pageX, e.pageY);

            //框选择处理
            if (w.operateState == 'rectSelect' && evt.downPoint && w.isRectSelect) {
                var mx = evt.downPoint.x;
                var my = evt.downPoint.y;

                if (coor.x - evt.downPoint.x < 0)
                    mx = coor.x;
                if (coor.y - evt.downPoint.y < 0)
                    my = coor.y;

                w.rectSelect.x = mx;
                w.rectSelect.y = my;
                w.rectSelect.width = Math.abs(coor.x - evt.downPoint.x);
                w.rectSelect.height = Math.abs(coor.y - evt.downPoint.y);
                w.draw();
                return;
            }

            if (w.operateState == 'linkPointMove') {
                w.selectedShape.mouseMove(e, coor);
                //return;
            }
            if (w.operateState == 'resize') {
                w.selectedShape.mouseMove(e, coor);
                return;
            }

            if (w.operateState == 'move' && w.isMousedown && w.selectedShape != null) {
                var newX = e.pageX - w.startPoint.X;
                var newY = e.pageY - w.startPoint.Y;
                // w.selectedShape.setMove(newX, newY);
                w.moveSelectedShape(newX, newY);
                // if (w.connector){
                // 	w.connector.modifyRelations(w.selectedShape);
                // 	//如果有分组
                // 	if (w.selectedShape.groups && w.selectedShape.groups.length > 0) {
                // 		for (var i = w.selectedShape.groups.length - 1; i >= 0; i--) {
                // 			w.connector.modifyRelations(w.selectedShape.groups[i]);
                // 		}
                // 	}
                // }
                //如果是图层结构
                if (w.layers) {
                    w.layers.modifyRelations(w.selectedShape);
                    //如果有分组
                    if (w.selectedShape.groups && w.selectedShape.groups.length > 0) {
                        for (var i = w.selectedShape.groups.length - 1; i >= 0; i--) {
                            w.layers.modifyRelations(w.selectedShape.groups[i]);
                        }
                    }
                }


                w.draw();
                w.startPoint = {
                    X: e.pageX,
                    Y: e.pageY
                };
                return;
            }

            var shape = evt.getPointShape(coor.x, coor.y);
            if (w.hoverShape != null) {
                if (shape == null || w.hoverShape != shape) {
                    w.hoverShape.hovered = false;
                    w.hoverShape.mousePoint = null;
                    w.hoverShape = null;
                    w.draw();
                    //w.canvas.style.cursor = 'default';
                }
            }

            if (shape != null) { //&& shape != w.hoverShape && w.selectedShape != shape) {				
                w.hoverShape = shape;
                w.hoverShape.hovered = true;
                w.hoverShape.mousePoint = coor;
                //显示ToolTip信息
                /*	if (w.tipBox) {
                		if (w.hoverShape != null) 
                			w.tipBox.visible=true;
                		 else 
                			w.tipBox.visible=false;
                	   
                	}*/
                if (w.toolTip) {
                    if (w.contextMenu && w.contextMenu.visible) {
                        w.toolTip.hideToolTip();
                        return;
                    }
                    if (w.isMousedown) {
                        w.toolTip.hideToolTip();
                        return;
                    }

                    if (w.hoverShape != null) {
                        w.toolTip.showTooltip(e, w.hoverShape.id);
                    } else {
                        w.toolTip.hideToolTip();
                    }
                }

                //  if (w.selectedShape&&w.selectedShape== w.hoverShape)
                // w.selectedShape.mouseMove(e,coor);//return;

                if (w.hoverShape) {
                    w.hoverShape.mouseMove(e, coor);
                    // if (w.operateState == 'linkPointMove') 
                    if (w.selectedShape)
                        w.selectedShape.mouseMove(e, coor);
                    w.draw();
                    return;
                }
            } else {
                if (w.toolTip)
                    w.toolTip.hideToolTip();

                // if (w.tipBox)  w.tipBox.visible=false; 

                return;
            }


            w.draw();
            if (w.operateState == 'linkPointMove') return;
            w.canvas.style.cursor = 'default';
            w.operateState = 'none';


        };
        //滚轮事件canvas.onwheel=
        evt.mouseWheel = function(e) {
            return;
            //var pos=windowToCanvas(w.canvas,e.clientX,e.clientY);
            // e.wheelDelta = e.wheelDelta ? e.wheelDelta : (e.deltaY * (-40));
            // if (e.wheelDelta > 0) {
            //     w.zoom("zoomIn");
            // } else {
            //     w.zoom("zoomOut");
            // }

            //   for (var i=0;i<n;i++)
            // {

            // 	if(e.wheelDelta>0){
            // 		scale*=2;
            // 		w.shapes[i].x=w.shapes[i].x*2-pos.x;
            // 		w.shapes[i].y=w.shapes[i].y*2-pos.y;
            // 	}else{
            // 		imgScale/=2;
            // 		w.shapes[i].x=w.shapes[i].x*0.5+pos.x*0.5;
            // 		w.shapes[i].y=w.shapes[i].y*0.5+pos.y*0.5;
            // 	}
            // }
            // w.draw();
        };

        //获取点所在的图形对象
        evt.getPointShape = function(x, y) {
            // var shape = null;
            // if (w.layers&&w.layers.activeLayer)
            // {
            // 	shape=w.layers.activeLayer.getPointShape(x, y);
            // }
            // else
            // {
            // 	shape=w.getPointShape(x, y);			 
            // }
            return w.getPointShape(x, y);
        };
        //整体移动
        evt.moveAll = function(x, y) {
            // if (w.centerPoint == null)
            // 	w.centerPoint = {
            // 		X: 0,
            // 		Y: 0
            // 	};
            // w.centerPoint = {
            // 	X: w.centerPoint.X - x,
            // 	Y: w.centerPoint.Y - y
            // };
            // // w.canvas.translate(x,y);
            // w.draw();

            var divWorkArea = document.getElementById(w.parentID);
            divWorkArea.scrollLeft = divWorkArea.scrollLeft + x; ///divWorkArea.clientWidth;
            divWorkArea.scrollTop = divWorkArea.scrollTop + y; ///divWorkArea.clientWidth;


        };
        //获取转换后的坐标
        evt.getCoorConver = function(mx, my) {
            return w.getCoorConver(mx, my);
            // var bbox = w.canvas.getBoundingClientRect();//用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。
            // var s_Top = document.documentElement.scrollTop || document.body.scrollTop; //向下滚动了多少
            // var s_Left = document.documentElement.scrollLeft || document.body.scrollLeft; //向左滚动了多少

            // var xv = (mx - bbox.left * (w.canvas.width / bbox.width)) * 1 - s_Left;
            // var yv = (my - bbox.top * (w.canvas.height / bbox.height)) * 1 - s_Top;

            //  //   if (xv<0) xv=1;
            // 	// if (yv<0) yv=1;
            // return {
            // 	x: xv / w.scale - w.centerPoint.X,
            // 	y: yv / w.scale - w.centerPoint.Y
            // };
        };


        return evt;
    }
};

/*-*/

//拓扑圆形布局算法			  
WebGraph.Layout.CircleLayout = function(centerX, centerY, radius, count) {
    //var centerX = 400;//圆心坐标  
    //var centerY = 300;  
    //var radius = 200;//半径  
    //count: 节点数目  
    var nodes = new Array();
    var x = 0;
    var y = 0;
    for (var i = 0; i < count; i++) {
        x = centerX + radius * Math.cos(180 - Math.PI * 2 / count * i);
        y = centerY + radius * Math.sin(180 - Math.PI * 2 / count * i);
        // nodes.push(x);
        // nodes.push(y); 
        nodes.push({ X: x, Y: y });
    }
    return nodes;
};
//拓扑波浪上下起伏布局算法            
WebGraph.Layout.UpDownLayout = function(startX, endY, hSpace, vSpace, count) {
    //var startX = 400;//圆心坐标  
    //var endX = 300;  
    //var radius = 200;//半径  
    //count: 节点数目  
    var nodes = new Array();
    nodes.push({ X: startX, Y: endY });
    var x = 0;
    var y = 0;
    var length = hSpace;
    var h = vSpace; //length * Math.sin(Math.PI * 2 / 360*angle)
    for (var i = 0; i < count; i++) {
        x = startX + length;

        if (i % 2 == 0) {
            y = endY + h;
        } else {
            y = endY - h;
        }
        startX = x;
        endY = y;
        nodes.push({ X: x, Y: y });
    }

    return nodes;
};

//直线布局算法            
WebGraph.Layout.lineLayout = function(startX, endY, length, count) {
    //count: 节点数目  
    var nodes = new Array();
    nodes.push({ X: startX, Y: endY });
    var x = 0;
    var y = 0;

    for (var i = 0; i < count; i++) {
        startX += length;
        nodes.push({ X: startX, Y: endY });
    }

    return nodes;
};

// s折线 布局算法            
WebGraph.Layout.LineLayout = function(startX, endY, hSpace, vSpace, cols, count) {
    //var hSpace = 150;//水平间隔  
    //var vSpace = 300;  //垂直间隔
    //var radius = 200;//半径  
    //count: 节点数目  
    var nodes = new Array();
    nodes.push({ X: startX, Y: endY });
    var x = 0;
    var y = 0;
    var leftOrRight = "right";
    for (var i = 1; i <= count; i++) {

        if (i % cols == 0) {
            endY += vSpace;

            x = startX;
            if (leftOrRight == "right")
                leftOrRight = "left";
            else
                leftOrRight = "right";
        } else {
            if (leftOrRight == "right")
                x = startX + hSpace;
            else
                x = startX - hSpace;
        }
        startX = x;
        y = endY;
        nodes.push({ X: x, Y: y });
    }

    return nodes;
};
//树形布局算法            
// TreeLayout={     
//     createNew:  function(startX,endY,tootNode){
//     var tree = {};
//         //count: 节点数目  
//         var nodes=  new Array();  
//          nodes.push({X:startX,Y:endY});      
//          var x=0;
//          var y=0;
//          this.lay=1;

//          this.findChild=function(Node){
//           var n=Node.childs.length;
//               if (n>0)
//               {
//                    lay++;
//                     for (var i= 0;i<n;i++)  
//                     {  
//                          this.findChild(tootNode.childs[i]);
//                     }   
//               }

//       };    

treeNode = function() {
    this.id = '';
    this.name = '';
    this.parentId = '';
    this.level = '';
    this.children = [];
    this.name = '';
    this.x = 0;
    this.y = 0;
    this.height = 20;
    this.width = 40;
    this.tag = null;
    this.parent = null;
    this.childWidth = 0;
    this.visible = true;
    this.expanded = true;
};



WebGraph.Layout.VerticalTree = function(containerNode, first, shiftLeft, shiftTop, wordSpacing, branchHeight, marginLeft) {
    var isFirst = false;
    var isParent = containerNode.children.length > 0 ? true : false;
    var childrenWidth = 0;
    var thisX;
    var thisY;
    var returned = 0;
    var verticalDelta = branchHeight;

    for (var i = 0; i < containerNode.children.length; i++) {

        if (i == 0)
            isFirst = true;
        else
            isFirst = false;
        if (containerNode.children[i].visible) {
            if ((branchHeight - containerNode.height) < 30)
                verticalDelta = containerNode.height + 40;
            returned = WebGraph.Layout.VerticalTree(containerNode.children[i], isFirst, shiftLeft + childrenWidth, shiftTop + verticalDelta, wordSpacing, branchHeight, marginLeft);
            childrenWidth += returned;

        }

    }
    if (childrenWidth > 0 && containerNode.expanded)
        childrenWidth = Math.max(childrenWidth + (containerNode.width - childrenWidth) / 2, childrenWidth);

    if (childrenWidth == 0)
        childrenWidth = containerNode.width + wordSpacing;


    thisY = shiftTop;
    if (containerNode.children.length > 0 && containerNode.expanded) {
        if (containerNode.children.length == 1) {

            thisX = containerNode.children[0].x + containerNode.children[0].width / 2 - containerNode.width / 2;
        } else {
            var firstChild = containerNode.children[0].x + containerNode.children[0].width / 2;
            var lastChild = containerNode.children[containerNode.children.length - 1].x + containerNode.children[containerNode.children.length - 1].width / 2;

            thisX = Math.max(firstChild + (lastChild - firstChild - containerNode.width) / 2, firstChild);
        }
    } else {
        thisX = shiftLeft;

    }

    containerNode.x = thisX;
    containerNode.y = thisY;


    return childrenWidth;
}

WebGraph.Layout.HorizontalTree = function(containerNode, first, shiftLeft, shiftTop, wordSpacing, branchHeight, marginLeft) {
    var isFirst = false;
    var isParent = containerNode.children.length > 0 ? true : false;
    var childrenHeight = 0;
    var thisX;
    var thisY;
    var returned = 0;
    var horizontalDelta = branchHeight;

    for (var i = 0; i < containerNode.children.length; i++) {

        if (i == 0)
            isFirst = true;
        else
            isFirst = false;
        if (containerNode.children[i].visible) {
            if ((branchHeight - containerNode.width) < 30)
                horizontalDelta = containerNode.width + 40;
            returned = WebGraph.Layout.HorizontalTree(containerNode.children[i], isFirst, shiftLeft + horizontalDelta, shiftTop + childrenHeight, wordSpacing, branchHeight, marginLeft);
            childrenHeight += returned;
        }

    }


    if (childrenHeight == 0)
        childrenHeight = containerNode.height + wordSpacing;


    thisX = shiftLeft;
    if (containerNode.children.length > 0 && containerNode.expanded) {

        var firstChild = containerNode.children[0].y;
        var lastChild = containerNode.children[containerNode.children.length - 1].y;
        thisY = firstChild + (lastChild - firstChild) / 2;

    } else {
        thisY = shiftTop;

    }

    containerNode.x = thisX;
    containerNode.y = thisY;

    return childrenHeight;
}


function getChildCount(nodes) {
    var l = nodes.length;
    if (l == 0) return 0;
    var c = l;
    for (var i = 0; i < l; i++) {
        (function() { //匿名函数
            var node = arguments[0];
            if (node && node.children.length > 0) {
                c = c + node.children.length - 1;
                // if (c<node.children.length)
                //     c=node.children.length;

                //递归调用 
                for (var a = 0; a < node.children.length; a++)
                    arguments.callee(node.children[a]);
            }
        })(nodes[i]);
    }
    return c;
}
// 图例对象类
WebGraph.Controls.Legend = {
    createNew: function() {
        var me = {};
        me.data;
        me.webCanvas = null;
        me.x = 0;
        me.y = 0;
        me.width = 100;
        me.height = 100;
        me.rowHeight = 12; //	
        me.font = "12px 宋体";
        me.symbolWidth = 30;
        me.textWidth = 30;
        me.borderWidth = 1;
        me.rectShape;
        me.wordSpacing = 5;
        me.allowDrog = false;
        me.headHeight = 15;
        me.visible = true;
        me.show = function() {
            me.visible = true;
            me.rectShape.visible = me.visible;
            me.webCanvas.draw();
        }
        me.hidden = function() {
            me.visible = false;
            me.rectShape.visible = me.visible;
            me.webCanvas.draw();
        }
        me.getSymbol = function(id) {
            var c = "Gold";
            if (me.data) {
                for (var i = 0; i < me.data[0].items.length; i++) {

                    if (me.data[0].items[i].id == id) {
                        c = me.data[0].items[i].symbol;
                        break;
                    }
                }
            }
            return c;
        };
        me.getHeight = function(count, headHeight, rowHeight, wordSpacing) {
            me.rowHeight = rowHeight;
            me.wordSpacing = wordSpacing;
            me.headHeight = headHeight;
            return (me.rowHeight + me.wordSpacing) * count + me.headHeight + me.rowHeight;
        };
        //初始化函数
        me.init = function(webCanvas, jsonData, x, y, width, height, borderWidth) {
            me.data = jsonData;

            me.webCanvas = webCanvas;
            me.width = width;
            me.height = height;
            me.x = x;
            me.y = y;

            //外边框
            me.rectShape = WebGraph.Shape.Rect.createNew();
            me.rectShape.init(x, y, width, height, borderWidth, "black", "white");
            me.rectShape.editSize = false;
            me.rectShape.visible = me.visible;

            if (me.allowDrog) {
                me.rectShape.allowDrog = me.allowDrog;
                me.webCanvas.addShape(me.rectShape);
            }

            //重写方法
            me.rectShape.drawChilds = function(ctx, left, top, w, h) {

                var leftX = left + 10;
                var topY = top + me.rowHeight;

                ctx.save();
                ctx.fillStyle = "black";
                ctx.font = me.font;
                // ctx.textAlign = "center"; +me.symbolWidth
                ctx.fillText("图例:", leftX, topY);

                topY = topY + me.headHeight;

                for (var i = 0; i < me.data[0].items.length; i++) {
                    //符号
                    //ctx.strokeStyle ='#191919';			 
                    ctx.fillStyle = me.data[0].items[i].symbol;
                    //	ctx.lineWidth=1;
                    ctx.fillRect(leftX, topY - 5, me.symbolWidth, me.rowHeight);
                    //ctx.strokeRect(down_left,down_y,30,10);

                    //文字描述
                    //		ctx.font = t.font; //设置字体样式
                    ctx.fillStyle = "black";
                    ctx.textAlign = "start"; //:水平对齐方式      start、end、right、center
                    ctx.fillText(me.data[0].items[i].text, leftX + me.symbolWidth + me.wordSpacing, topY + me.rowHeight / 2);

                    topY = topY + me.rowHeight + me.wordSpacing;
                }
                ctx.restore();
                // this.drawChilds.call(this);
            };
        };
        me.draw = function(ctx) {
            me.rectShape.visible = me.visible;
            if (me.visible)
                me.rectShape.draw(ctx);

        };

        return me;
    }
};
//图形选择器对象
WebGraph.Model.LineSelector = {
    createNew: function() {
        var s = WebGraph.Model.Element.createNew();
        s.ShapeType = "线选择器";
        s.targetShape = null;
        s.handles = [];
        s.curHandle = null;
        s.canvas = null;
        s.ctx = null;
        s.visible = true;
        s.webCanvas = null;
        //初始化函数
        s.init = function(webCanvas) {
            s.webCanvas = webCanvas;
            s.canvas = webCanvas.canvas;
            s.ctx = webCanvas.context;
            s.targetShape = webCanvas.selectedShape;
            s.rotate = s.targetShape.rotate;

            s.strokeWidth = 1;
            s.stroke = "green";
            s.fill = "white";
            if (s.handles.length == 0) {
                //var arrArrow = new Array("move", "move", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "crosshair");
                var ps = s.targetShape.points.split(" ");
                //构造n个调整大小触模柄  rocendyl   
                for (var i = 0; i < ps.length; i++) {
                    var handle = WebGraph.Model.LineHandle.createNew();
                    handle.selector = s;
                    handle.cursor = "pointer";
                    handle.index = i;
                    if (i == 0) handle.isStart = true;
                    if (i == ps.length - 1) handle.isEnd = true;
                    s.handles.push(handle);
                }
            }

            s.showHandles();
        };
        s.refersh = function(x, y) {

        };

        s.initHandles = function(x, y) {
            // 	var sX = x -BOX_SIZE-BOX_SIZE/2;// BOX_SIZE;
            // var sY = y -BOX_SIZE-BOX_SIZE/2;// BOX_SIZE;
            // var sW = s.targetShape.width + BOX_SIZE+BOX_SIZE;
            // var sH = s.targetShape.height + BOX_SIZE+BOX_SIZE;
            // var hB = BOX_SIZE/2;
            // var  arrPosX =  new Array(sX+hB, sX + sW/2, sX + sW-hB, sX + sW-hB,  sX + sW-hB, sX + sW/2, sX+hB, sX+hB,sX + sW/2);
            // var  arrPosY =  new Array(sY+hB, sY+hB, sY+hB, sY + sH/2, sY + sH-hB, sY + sH-hB, sY + sH-hB, sY + sH/2,sY -TOP_OFF);//sY + sH / 2
            var ps = s.targetShape.points.split(" ");
            // var p1 = ps[0].split(",");
            // var p2 = ps[ps.length-1].split(",");	

            for (var i = 0; i < ps.length; i++) {
                var p = ps[i].split(",");
                s.handles[i].setBounds(x + p[0], y + p[1], BOX_SIZE, BOX_SIZE);
            }




            // s.handles[0].setBounds(x+p1[0], y+p1[1], BOX_SIZE, BOX_SIZE);
            // s.handles[1].setBounds(x+p2[0], y+p2[1], BOX_SIZE, BOX_SIZE);
        };

        var startPoint = null;
        s.mouseDown = function(e, x, y) {
            startPoint = { X: x, Y: y };
            // startl = s.targetShape.x-BOX_SIZE;
            // startt = s.targetShape.y-BOX_SIZE;
            // startw = s.targetShape.width+BOX_SIZE*2;
            // starth = s.targetShape.height+BOX_SIZE*2;
            //startPoint={X:e.pageX,Y:e.pageY};
            if (s.curHandle != null) {
                dragging = true;
                return;
            }
        };

        s.mouseUp = function(e, x, y) {
            if (s.webCanvas.operateState == 'linkPointMove' && s.targetShape) {
                if (WebGraph.Math.isInsideRectangle(s.webCanvas.hoverShape, s.curHandle.x, s.curHandle.y)) {
                    if (s.curHandle.isStart) {
                        s.targetShape.setFromPoint(s.webCanvas.hoverShape, x, y);
                        if (s.targetShape.fromShape != s.webCanvas.hoverShape)
                            s.targetShape.changeLink(s.targetShape, s.webCanvas.hoverShape, s.targetShape.toShape);
                    }
                    if (s.curHandle.isEnd) {
                        s.targetShape.setToPoint(s.webCanvas.hoverShape, x, y);
                        if (s.targetShape.toShape != s.webCanvas.hoverShape)
                            s.targetShape.changeLink(s.targetShape, s.targetShape.fromShape, s.webCanvas.hoverShape);
                    }
                    s.webCanvas.selectedShape = s.targetShape;
                    s.targetShape = s.webCanvas.selectedShape;
                    s.webCanvas.draw();
                } else {
                    if (s.curHandle.isStart) {
                        s.targetShape.setFromPoint(null, x, y);
                        s.targetShape.changeLink(s.targetShape, null, s.targetShape.toShape);
                    }
                    if (s.curHandle.isEnd) {
                        s.targetShape.setToPoint(null, x, y);
                        s.targetShape.changeLink(s.targetShape, s.targetShape.fromShape, null);
                    }
                    s.webCanvas.selectedShape = s.targetShape;
                    s.targetShape = s.webCanvas.selectedShape;
                    s.webCanvas.draw();
                }
            }
            dragging = false;
            s.webCanvas.operateState = 'none';
            s.webCanvas.canvas.style.cursor = 'default';
        };

        s.mouseMove = function(e, x, y) {
            // 
            if (dragging && s.webCanvas.operateState == 'linkPointMove' && s.curHandle != null) {
                // s.handleDrag(s.curHandle,e.pageX,e.pageY);
                s.handleDrag(s.curHandle, x, y);
                return;
            }
            // s.canvas.style.cursor='default';
            s.curHandle = null;
            s.webCanvas.operateState = 'none';
            s.webCanvas.canvas.style.cursor = 'default';
            for (var i = 0; i < s.handles.length; i++) {
                if (s.handles[i].isInside(x, y)) {
                    if (s.curHandle)
                        s.curHandle.selected = false;
                    s.handles[i].selected = true;
                    s.curHandle = s.handles[i];
                    s.canvas.style.cursor = s.curHandle.cursor;
                    s.webCanvas.operateState = 'linkPointMove'
                    break;
                }
            }
        };

        var TOP_OFF = 15;
        var BOX_SIZE = 8;
        var MIN_SIZE = 10;
        var startl = 0;
        var startt = 0;
        var startw = 0;
        var starth = 0;
        var dragging = false;

        s.handleDrag = function(sender, x, y) {
            if (dragging == false) return;
            // var l =s.targetShape.x;//s.x;// s.targetShape.x;
            // var t =s.targetShape.y;//s.y+TOP_OFF;// s.targetShape.y;
            // var e={X:x-startPoint.X,Y:y-startPoint.Y};

            var ps = s.targetShape.points.split(" ");
            // var p = ps[sender.index].split(",");

            ps[sender.index] = x + "," + y
            s.targetShape.setPoints(ps);
            s.showHandles();
        };

        s.showHandles = function() {
            s.visible = true;
            if (s.targetShape != null) {
                for (var i = 0; i < s.handles.length; i++) {
                    s.handles[i].setVisible(true);
                }
                s.webCanvas.draw();
            }
        };

        s.hideHandles = function() {
            s.visible = false;
            for (var i = 0; i < s.handles.length; i++) {
                s.handles[i].setVisible(false);
            }
            s.webCanvas.draw();
        };


        //判断鼠标是否在图形内部
        s.isInside = function(x, y) {

            s.x = s.targetShape.x - BOX_SIZE;
            s.y = s.targetShape.y - TOP_OFF;
            s.width = s.targetShape.width + BOX_SIZE + BOX_SIZE;
            s.height = s.targetShape.height + TOP_OFF + BOX_SIZE;;
            if (x >= s.x && x <= (s.x + s.width) &&
                y >= s.y && y <= (s.y + s.height)
            ) { return true; } else { return false; }

        };

        s.draw = function(ctx, cx, cy) {
            s.initHandles(cx, cy);
            ctx.save();
            //旋转
            // var rx = s.targetShape.x;
            // var ry = s.targetShape.y;

            // var cx=0;
            // var cy=0;

            // if (s.targetShape.rotate != 0) {
            // 	// ctx.translate(s.targetShape.x + s.targetShape.width / 2, s.targetShape.y + s.targetShape.height / 2);
            // 	// ctx.rotate(s.targetShape.rotate * Math.PI / 180);
            // 	cx = s.targetShape.x + s.targetShape.width / 2;
            // 	cy = s.targetShape.y + s.targetShape.height / 2; 
            // }

            // s.x=s.targetShape.x-BOX_SIZE ;
            // s.y=s.targetShape.y-BOX_SIZE ;
            // s.width=s.targetShape.width+BOX_SIZE/2;
            // s.height=s.targetShape.height+BOX_SIZE/2;
            // ctx.translate(0.5, 0.5);//变换矩阵画细线
            // ctx.lineWidth=1;
            // ctx.strokeStyle = "green";  
            // //虚线矩形
            // //上横线
            // dashedLine(ctx,cx-BOX_SIZE/2,cy-BOX_SIZE/2,cx+s.width,cy-BOX_SIZE/2,2);
            // //左竖线
            // dashedLine(ctx,cx-BOX_SIZE/2,cy-BOX_SIZE/2,cx-BOX_SIZE/2,cy-BOX_SIZE/2+s.height,2);
            // //下横线
            // dashedLine(ctx,cx-BOX_SIZE/2,cy+s.height,cx+s.width,cy+s.height,2);
            // //左竖线
            // dashedLine(ctx,cx+s.width,cy-BOX_SIZE/2,cx+s.width,cy+s.height,2);
            //画手柄
            for (var i = 0; i < s.handles.length; i++)
                s.handles[i].draw(ctx, 0, 0);

            ctx.restore();
        };


        return s;
    }
};
WebGraph.Model.LineHandle = {
    createNew: function() {
        //var cat = {};
        //继承
        var h = WebGraph.Model.Element.createNew();
        h.ShapeType = "手柄";
        h.cursor = "none";
        h.index = -1;
        h.isEnd = false;
        h.isStart = false;
        h.visible = true;
        h.ctx = null;
        h.selector = null;
        //初始化函数
        h.init = function(x, y, width, height, strokeWidth, strokeColor, fillColor) {
            h.x = x;
            h.y = y;
            h.width = width;
            h.height = height;
            h.strokeWidth = strokeWidth;
            h.stroke = strokeColor;
            h.fill = fillColor;
        };

        h.setBounds = function(x, y, width, height) {
            h.x = x;
            h.y = y;
            h.width = width;
            h.height = height;
        };
        h.setVisible = function(yn) {
            h.visible = yn;
            // h.draw(h.ctx);
        };

        //判断鼠标是否在图形内部
        h.isInside = function(mx, my) {
            var x = mx;
            var y = my;
            //如果旋转
            // if (h.selector.rotate != 0){
            // 	var p=WebGraph.Math.getRotatePoint({x:mx,y:my},{x:h.selector.targetShape.x+h.selector.targetShape.width/2,y:h.selector.targetShape.y+h.selector.targetShape.height/2},-h.selector.rotate);

            // 	// var ps = h.selector.targetShape.points.split(" ");
            // 	// var p = ps[h.index].split(","); 
            // 	// x=p[0]-h.width/2;
            // 	// y=p[1]-h.width/2;

            //        x=-p.x +(h.selector.targetShape.x+h.selector.targetShape.width/2);
            //        y=-p.y+(h.selector.targetShape.y+h.selector.targetShape.height/2);          

            // }


            return (x - h.x) * (x - h.x) + (y - h.y) * (y - h.y) <
                3 * 3;

            // if ( x >= (h.x- 2)    && x <= (h.x + 2 )
            //              && y >= (h.y-2)   && y <= (h.y + 2 ))
            // 		{return true;  }
            // 	  else
            //     {return false;}

        };


        h.draw = function(ctx, cx, cy) {
            if (h.visible) {
                h.ctx = ctx;
                //	ctx.lineWidth = h.strokeWidth;
                ctx.strokeStyle = "green";
                ctx.fillStyle = "LightGreen";
                // if (h.index == 0 || h.index == 2 || h.index == 4 || h.index == 6 || h.index == 8 || h.index == 9) {
                // 	ctx.beginPath();
                // 	ctx.arc(h.x - cx+h.width/2, h.y - cy+h.width/2, h.width/2, 0, Math.PI * 2, true); //Math.PI*2是JS计算方法，是圆
                // 	ctx.closePath();
                // 	ctx.fill();
                // 	ctx.stroke();
                // } else {
                // 	ctx.fillRect(h.x - cx, h.y - cy, h.width, h.height);
                // 	//实践表明在不设施strokeStyle下的默认strokeStyle=black
                // 	ctx.strokeRect(h.x - cx, h.y - cy, h.width, h.height);
                // }
                if (h.selected)
                    ctx.strokeStyle = "red";
                ctx.beginPath();
                ctx.arc(h.x - cx, h.y - cy, h.width / 2, 0, Math.PI * 2, true); //Math.PI*2是JS计算方法，是圆
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }

        };


        return h;
    }
};
//style.cursor 的可选值（鼠标的各种样式）
//crosshair;十字准心 
//cursor: pointer; 
//cursor: hand;
//写两个是为了照顾IE5，它只认hand。 
//手 
//cursor: wait; 等待/沙漏
//cursor: help;帮助
//cursor: no-drop;无法释放
//cursor: no-drop;
//cursor: text;文字/编辑
//cursor: move;可移动对象
//cursor: n-resize;向上改变大小(North)
//cursor: s-resize;向下改变大小(South) 
//cursor: e-resize;向右改变大小(East)
//cursor: w-resize;向左改变大小(West)
//cursor: ne-resize; 向上右改变大小(North East)
//cursor: nw-resize;向上左改变大小(North West)
//cursor: se-resize;向下右改变大小(South East)
//cursor: sw-resize;向下左改变大小(South West)
//cursor: auto;自动
//cursor:not-allowed;禁止
//cursor:not-allowed;
//cursor: progress;处理中
//cursor: progress;
//cursor: default;系统默认
//cursor: url(' # ');
//# = 光标文件地址      (注意文件格式必须为：.cur 或 .ani)。
// 
//用户自定义（可用动画）
//The url of a custom cursor to be used.
//自定义游标的url位置
//Note: Always define a generic cursor at the end of the list in case none of the url-defined cursors can be used
//注意：在定义完自定义的游标之后在末尾加上一般性的游标，以防那些url所定义的游标不能使用

//Double-Buffering双缓冲技术
////名为Canvas的这个是要在网页中显示的
//var canvas = document.getElementById("myCanvas");
////这里假定HTML中Canvas的ID为"myCanvas"
//var context = canvas.getContext("2d");
////对应的Context（中文翻译为上下文对象，正确吗？）
////现在创建一个用于缓冲的canvas，但不显示它
//var bufferCanvas = document.createElement("canvas");
//var bufferContext = bufferCanvas.getContext("2d");
////现在，保证缓冲canvas的大小与显示canvas大小一致
//bufferCanvas.width = canvas.width;
//bufferCanvas.height = canvas.height;
////好了，我们在bufferCanvas上绘制图形
////例如：bufferContext.fillRect(...);
////之后，我们把bufferCanvas上的内容copy到canvas上：
//context.drawImage(bufferCanvas,0,0); 
//图形选择器对象
WebGraph.Model.Selector = {
    createNew: function() {
        var s = WebGraph.Model.Element.createNew();
        s.ShapeType = "选择器";
        s.targetShape = null;
        s.handles = [];
        s.curHandle = null;
        s.canvas = null;
        s.ctx = null;
        s.visible = true;
        s.webCanvas = null;
        //初始化函数
        s.init = function(webCanvas) {
            s.webCanvas = webCanvas;
            s.canvas = webCanvas.canvas;
            s.ctx = webCanvas.context;
            s.targetShape = webCanvas.selectedShape;
            s.rotate = s.targetShape.rotate;

            s.strokeWidth = 1;
            s.stroke = "green";
            s.fill = "white";
            if (s.handles.length == 0) {
                var arrArrow = new Array("nw-resize", "n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "crosshair");

                //构造8个调整大小触模柄  rocendyl   
                for (var i = 0; i < 9; i++) {
                    var handle = WebGraph.Model.Handle.createNew();
                    handle.selector = s;
                    handle.cursor = arrArrow[i];
                    handle.index = i;
                    s.handles.push(handle);
                }
            }

            s.showHandles();
        };
        s.refersh = function(x, y) {

        };

        s.initHandles = function(x, y) {
            var sX = x - BOX_SIZE - BOX_SIZE / 2; // BOX_SIZE;
            var sY = y - BOX_SIZE - BOX_SIZE / 2; // BOX_SIZE;
            var sW = s.targetShape.width + BOX_SIZE + BOX_SIZE;
            var sH = s.targetShape.height + BOX_SIZE + BOX_SIZE;
            var hB = BOX_SIZE / 2;
            var arrPosX = new Array(sX + hB, sX + sW / 2, sX + sW - hB, sX + sW - hB, sX + sW - hB, sX + sW / 2, sX + hB, sX + hB, sX + sW / 2);
            var arrPosY = new Array(sY + hB, sY + hB, sY + hB, sY + sH / 2, sY + sH - hB, sY + sH - hB, sY + sH - hB, sY + sH / 2, sY - TOP_OFF); //sY + sH / 2
            for (var i = 0; i < 9; i++) {
                s.handles[i].setBounds(arrPosX[i], arrPosY[i], BOX_SIZE, BOX_SIZE);
            }
        };

        var startPoint = null;
        s.mouseDown = function(e, x, y) {
            startPoint = { X: x, Y: y };
            startl = s.targetShape.x - BOX_SIZE;
            startt = s.targetShape.y - BOX_SIZE;
            startw = s.targetShape.width + BOX_SIZE * 2;
            starth = s.targetShape.height + BOX_SIZE * 2;
            //startPoint={X:e.pageX,Y:e.pageY};
            if (s.curHandle != null) {
                dragging = true;
                return;
            }
        };

        s.mouseUp = function(e, x, y) {
            dragging = false;
            s.webCanvas.operateState = 'none';
        };

        s.mouseMove = function(e, x, y) {

            if (dragging && s.webCanvas.operateState == 'resize' && s.curHandle != null) {
                // s.handleDrag(s.curHandle,e.pageX,e.pageY);
                s.handleDrag(s.curHandle, x, y);
                return;
            }
            s.canvas.style.cursor = 'default';
            s.curHandle = null;
            s.webCanvas.operateState = 'none';
            for (var i = 0; i < 9; i++) {
                if (s.handles[i].isInside(x, y)) {
                    s.curHandle = s.handles[i];
                    s.canvas.style.cursor = s.curHandle.cursor;
                    s.webCanvas.operateState = 'resize'
                    break;
                }
            }
        };

        var TOP_OFF = 15;
        var BOX_SIZE = 8;
        var MIN_SIZE = 10;
        var startl = 0;
        var startt = 0;
        var startw = 0;
        var starth = 0;
        var dragging = false;

        s.handleDrag = function(sender, x, y) {
            if (dragging == false) return;
            var l = s.targetShape.x; //s.x;// s.targetShape.x;
            var w = s.targetShape.width; //s.width;// s.targetShape.width;
            var t = s.targetShape.y; //s.y+TOP_OFF;// s.targetShape.y;
            var h = s.targetShape.height; //s.height-TOP_OFF;// s.targetShape.height;
            var e = { X: x - startPoint.X, Y: y - startPoint.Y };

            switch (sender.index) {
                //l算法：控件左边X坐标 ＋ 鼠标在触模柄X坐标 < 控件左边X坐标 ＋ 父控件宽度 - 控件大小 ？控件左边X坐标 ＋ 鼠标在触模柄X坐标 ：控件左边X坐标 ＋ 父控件宽度 - 控件大小  
                //t算法：
                //w算法：
                //h算法：
                case 0: // _dragging top-left sizing box
                    l = startl + e.X < startl + startw - MIN_SIZE ? startl + e.X : startl + startw - MIN_SIZE;
                    t = startt + e.Y < startt + starth - MIN_SIZE ? startt + e.Y : startt + starth - MIN_SIZE;
                    w = startl + startw - s.targetShape.x;
                    h = startt + starth - s.targetShape.y;
                    break;
                case 1: // _dragging top-center sizing box
                    t = startt + e.Y < startt + starth - MIN_SIZE ? startt + e.Y : startt + starth - MIN_SIZE;
                    h = startt + starth - s.targetShape.y;
                    break;
                case 2: // _dragging top-right sizing box
                    w = startw + e.X > MIN_SIZE ? startw + e.X : MIN_SIZE;
                    t = startt + e.Y < startt + starth - MIN_SIZE ? startt + e.Y : startt + starth - MIN_SIZE;
                    h = startt + starth - s.targetShape.y;
                    break;
                case 3: // _dragging right-middle sizing box
                    w = startw + e.X > MIN_SIZE ? startw + e.X : MIN_SIZE;
                    break;
                case 4: // _dragging right-bottom sizing box
                    w = startw + e.X > MIN_SIZE ? startw + e.X : MIN_SIZE;
                    h = starth + e.Y > MIN_SIZE ? starth + e.Y : MIN_SIZE;
                    break;
                case 5: // _dragging center-bottom sizing box
                    h = starth + e.Y > MIN_SIZE ? starth + e.Y : MIN_SIZE;
                    break;
                case 6: // _dragging left-bottom sizing box
                    l = startl + e.X < startl + startw - MIN_SIZE ? startl + e.X : startl + startw - MIN_SIZE;
                    w = startl + startw - s.targetShape.x;
                    h = starth + e.Y > MIN_SIZE ? starth + e.Y : MIN_SIZE;
                    break;
                case 7: // _dragging left-middle sizing box
                    l = startl + e.X < startl + startw - MIN_SIZE ? startl + e.X : startl + startw - MIN_SIZE;
                    w = startl + startw - s.targetShape.x;
                    break;
                case 8: // 旋转点
                    var r = (x - startPoint.X) / 2;
                    s.targetShape.rotate += r;
                    if (x == startPoint.X) s.targetShape.rotate = 0;
                    if (s.targetShape.groups) {
                        var m = s.targetShape.groups.length;
                        for (var j = m - 1; j >= 0; j--)
                            s.targetShape.groups[j].rotate += r;
                    }

                    break;
            }
            l = (l < 0) ? 0 : l;
            t = (t < 0) ? 0 : t;
            s.targetShape.setBounds(l, t, w, h);
            s.showHandles();
        };

        s.showHandles = function() {
            s.visible = true;
            if (s.targetShape != null) {
                for (var i = 0; i < 9; i++) {
                    s.handles[i].setVisible(true);
                }
                s.webCanvas.draw();
            }
        };

        s.hideHandles = function() {
            s.visible = false;
            for (var i = 0; i < 9; i++) {
                s.handles[i].setVisible(false);
            }
            s.webCanvas.draw();
        };


        //判断鼠标是否在图形内部
        s.isInside = function(x, y) {

            s.x = s.targetShape.x - BOX_SIZE;
            s.y = s.targetShape.y - TOP_OFF;
            s.width = s.targetShape.width + BOX_SIZE + BOX_SIZE;
            s.height = s.targetShape.height + TOP_OFF + BOX_SIZE;;
            if (x >= s.x && x <= (s.x + s.width) &&
                y >= s.y && y <= (s.y + s.height)
            ) { return true; } else { return false; }

        };

        s.draw = function(ctx, cx, cy) {
            s.initHandles(cx, cy);
            ctx.save();
            //旋转
            // var rx = s.targetShape.x;
            // var ry = s.targetShape.y;

            // var cx=0;
            // var cy=0;

            // if (s.targetShape.rotate != 0) {
            // 	// ctx.translate(s.targetShape.x + s.targetShape.width / 2, s.targetShape.y + s.targetShape.height / 2);
            // 	// ctx.rotate(s.targetShape.rotate * Math.PI / 180);
            // 	cx = s.targetShape.x + s.targetShape.width / 2;
            // 	cy = s.targetShape.y + s.targetShape.height / 2; 
            // }

            s.x = s.targetShape.x - BOX_SIZE;
            s.y = s.targetShape.y - BOX_SIZE;
            s.width = s.targetShape.width + BOX_SIZE / 2;
            s.height = s.targetShape.height + BOX_SIZE / 2;
            ctx.translate(0.5, 0.5); //变换矩阵画细线
            ctx.lineWidth = 1;
            ctx.strokeStyle = "green";
            //虚线矩形
            //上横线
            WebGraph.Drawing2D.dashedLine(ctx, cx - BOX_SIZE / 2, cy - BOX_SIZE / 2, cx + s.width, cy - BOX_SIZE / 2, 2);
            //左竖线
            WebGraph.Drawing2D.dashedLine(ctx, cx - BOX_SIZE / 2, cy - BOX_SIZE / 2, cx - BOX_SIZE / 2, cy - BOX_SIZE / 2 + s.height, 2);
            //下横线
            WebGraph.Drawing2D.dashedLine(ctx, cx - BOX_SIZE / 2, cy + s.height, cx + s.width, cy + s.height, 2);
            //左竖线
            WebGraph.Drawing2D.dashedLine(ctx, cx + s.width, cy - BOX_SIZE / 2, cx + s.width, cy + s.height, 2);
            //画手柄
            for (var i = 0; i < 9; i++)
                s.handles[i].draw(ctx, 0, 0);

            ctx.restore();
        };


        return s;
    }
};
WebGraph.Model.Handle = {
    createNew: function() {
        //var cat = {};
        //继承
        var h = WebGraph.Model.Element.createNew();
        h.ShapeType = "手柄";
        h.cursor = "none";
        h.index = -1;
        h.visible = true;
        h.ctx = null;
        h.selector = null;
        //初始化函数
        h.init = function(x, y, width, height, strokeWidth, strokeColor, fillColor) {
            h.x = x;
            h.y = y;
            h.width = width;
            h.height = height;
            h.strokeWidth = strokeWidth;
            h.stroke = strokeColor;
            h.fill = fillColor;
        };

        h.setBounds = function(x, y, width, height) {
            h.x = x;
            h.y = y;
            h.width = width;
            h.height = height;
        };
        h.setVisible = function(yn) {
            h.visible = yn;
            // h.draw(h.ctx);
        };

        //判断鼠标是否在图形内部
        h.isInside = function(mx, my) {
            var x = mx;
            var y = my;
            //如果旋转
            if (h.selector.rotate != 0) {
                var p = WebGraph.Math.getRotatePoint({ x: mx, y: my }, { x: h.selector.targetShape.x + h.selector.targetShape.width / 2, y: h.selector.targetShape.y + h.selector.targetShape.height / 2 }, -h.selector.rotate);
                x = -p.x + (h.selector.targetShape.x + h.selector.targetShape.width / 2);
                y = -p.y + (h.selector.targetShape.y + h.selector.targetShape.height / 2);

            }
            if (x >= h.x - 3 && x <= (h.x + h.width + 6) &&
                y >= h.y - 3 && y <= (h.y + h.height + 6)
            ) { return true; } else { return false; }

        };


        h.draw = function(ctx, cx, cy) {
            if (h.visible) {
                h.ctx = ctx;
                //	ctx.lineWidth = h.strokeWidth;
                ctx.strokeStyle = "green";
                ctx.fillStyle = "LightGreen";
                if (h.index == 0 || h.index == 2 || h.index == 4 || h.index == 6 || h.index == 8 || h.index == 9) {
                    ctx.beginPath();
                    ctx.arc(h.x - cx + h.width / 2, h.y - cy + h.width / 2, h.width / 2, 0, Math.PI * 2, true); //Math.PI*2是JS计算方法，是圆
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                } else {
                    ctx.fillRect(h.x - cx, h.y - cy, h.width, h.height);
                    //实践表明在不设施strokeStyle下的默认strokeStyle=black
                    ctx.strokeRect(h.x - cx, h.y - cy, h.width, h.height);
                }
            }

        };


        return h;
    }
};
//style.cursor 的可选值（鼠标的各种样式）
//crosshair;十字准心 
//cursor: pointer; 
//cursor: hand;
//写两个是为了照顾IE5，它只认hand。 
//手 
//cursor: wait; 等待/沙漏
//cursor: help;帮助
//cursor: no-drop;无法释放
//cursor: no-drop;
//cursor: text;文字/编辑
//cursor: move;可移动对象
//cursor: n-resize;向上改变大小(North)
//cursor: s-resize;向下改变大小(South) 
//cursor: e-resize;向右改变大小(East)
//cursor: w-resize;向左改变大小(West)
//cursor: ne-resize; 向上右改变大小(North East)
//cursor: nw-resize;向上左改变大小(North West)
//cursor: se-resize;向下右改变大小(South East)
//cursor: sw-resize;向下左改变大小(South West)
//cursor: auto;自动
//cursor:not-allowed;禁止
//cursor:not-allowed;
//cursor: progress;处理中
//cursor: progress;
//cursor: default;系统默认
//cursor: url(' # ');
//# = 光标文件地址      (注意文件格式必须为：.cur 或 .ani)。
// 
//用户自定义（可用动画）
//The url of a custom cursor to be used.
//自定义游标的url位置
//Note: Always define a generic cursor at the end of the list in case none of the url-defined cursors can be used
//注意：在定义完自定义的游标之后在末尾加上一般性的游标，以防那些url所定义的游标不能使用

//Double-Buffering双缓冲技术
////名为Canvas的这个是要在网页中显示的
//var canvas = document.getElementById("myCanvas");
////这里假定HTML中Canvas的ID为"myCanvas"
//var context = canvas.getContext("2d");
////对应的Context（中文翻译为上下文对象，正确吗？）
////现在创建一个用于缓冲的canvas，但不显示它
//var bufferCanvas = document.createElement("canvas");
//var bufferContext = bufferCanvas.getContext("2d");
////现在，保证缓冲canvas的大小与显示canvas大小一致
//bufferCanvas.width = canvas.width;
//bufferCanvas.height = canvas.height;
////好了，我们在bufferCanvas上绘制图形
////例如：bufferContext.fillRect(...);
////之后，我们把bufferCanvas上的内容copy到canvas上：
//context.drawImage(bufferCanvas,0,0);

/*-*/

/* Web拓扑图形组件
 *作者： 刘金山
 *日期： 2014-07-01
 */

//符号对象
WebGraph.Shape.Symbol = {
    createNew: function(id) {
        var img = WebGraph.Model.Element.createNew();
        img.shapeType = "符号";
        img.href = "images/logo.png";
        //初始化函数
        img.init = function(x, y, w, h, strokeWidth, strokeColor, href) {
            img.x = x;
            img.y = y;
            img.width = w;
            img.height = h;
            img.strokeWidth = strokeWidth;
            img.stroke = strokeColor;
            img.href = "images/logo.png";
        };

        //判断鼠标是否在图形内部
        img.isInside = function(x, y) {
            if (x >= img.x - 2 && x <= (img.x + img.width + 4) && y >= img.y - 2 && y <= (img.y + img.height + 4)) { return true; } else { return false; }

        };
        img.draw = function(ctx) {
            ctx.save();
            var image = new Image();
            image.src = this.href;
            ctx.drawImage(image, img.x, img.y);
            ctx.restore();
        };
        return;
    }
};

//爻对象
WebGraph.Shape.Yao = {
    createNew: function(id) {
        var me = WebGraph.Shape.ShapeBase.createNew();
        me.shapeType = "爻";
        me.code = "1";

        me.draw = function(ctx) {
            ctx.save();
            //任何原来的坐标点p(ox, oy)在translate之后的坐标点为p(ox-x, oy-y),其中点(x, y)为平移点坐标translate(x, y)
            if (me.rotate != 0 && me.parent)
                me.rotateCenter = { x: me.parent.x + me.parent.width / 2, y: me.parent.y + me.parent.height / 2 };

            var xy = me.initContext(ctx);
            var cx = xy.X;
            var cy = xy.Y;
            if (me.rotate != 0 && me.parent) {
                if (me.rotateCenter) {
                    cx = me.x - me.rotateCenter.x;
                    cy = me.y - me.rotateCenter.y;
                }
            }

            if (me.code == "1")
                WebGraph.Drawing2D.Rect(ctx, cx, cy, me.width, me.height, true, true);
            else {
                WebGraph.Drawing2D.Rect(ctx, cx, cy, me.width * 4 / 9, me.height, true, true);
                WebGraph.Drawing2D.Rect(ctx, cx + me.width * 5 / 9, cy, me.width * 4 / 9, me.height, true, true);
            }
            //画上下左右中文本
            me.draw5Text(me, cx, cy, ctx);

            // //画选择器
            // if (me.selector && me.selector.visible)
            // 	me.selector.draw(ctx, cx, cy);

            ctx.restore();
        };

        return me;
    }
};

//卦对象
WebGraph.Shape.Gua = {
    createNew: function(id) {
        var me = WebGraph.Shape.Rect.createNew();
        me.shapeType = "卦";
        me.code = "111";
        //初始化函数
        me.init = function(x, y, w, h, strokeWidth, strokeColor, code) {
            me.x = x;
            me.y = y;
            me.width = w;
            me.height = h;
            me.strokeWidth = strokeWidth;
            me.stroke = strokeColor;
            me.code = code;
        };


        return me;
    }
};
WebGraph.Shape.TaiJiTu = {
    createNew: function(id) {
        var me = WebGraph.Shape.Circle.createNew();
        me.shapeType = "太极图";
        me.startAngle = 90;
        //初始化函数 
        me.init = function(x, y, r, strokeWidth, strokeColor, fillColor) {
            me.x = x - r;
            me.y = y - r;
            me.width = 2 * r;
            me.height = 2 * r;
            me.strokeWidth = strokeWidth;
            me.stroke = strokeColor;
            me.fill = fillColor;
            me.cx = x;
            me.cy = y;
            me.r = r;
        };

        me.draw = function(ctx) {
            ctx.save();
            var xy = me.initContext(ctx);
            var rx = xy.X;
            var ry = xy.Y;

            //画图形内部对象[在外部实现]
            //me.drawChilds(ctx, rx, ry, me.width, me.height);
            //弧度＝度×π/180 
            ctx.fillStyle = me.fill; //"#fff";
            //外边
            WebGraph.Drawing2D.ParamEllipse(ctx, me.cx, me.cy, me.r, me.r);
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(me.cx, me.cy, me.r, me.startAngle * Math.PI / 180, me.startAngle * 3 * Math.PI / 180, true);
            ctx.arc(me.cx, me.cy + me.r / 2, me.r / 2, -me.startAngle * Math.PI / 180, me.startAngle * Math.PI / 180, true);
            ctx.arc(me.cx, me.cy - me.r / 2, me.r / 2, me.startAngle * 3 * Math.PI / 180, me.startAngle * Math.PI / 180, false);

            ctx.closePath();
            ctx.fill();
            //太极眼
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(me.cx, me.cy + me.r / 2, me.r / 8, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(me.cx, me.cy - me.r / 2, me.r / 8, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };
        return me;
    }

};


//复合图形对象
WebGraph.Shape.CompositePattern = {
    createNew: function(id) {
        var me = WebGraph.Model.Element.createNew();
        me.shapeType = "复合图形";
        me.shape = null;
        me.childs = []; //子数组对象
        //初始化函数
        me.init = function(x, y, w, h) {
            me.x = x;
            me.y = y;
            me.width = w;
            me.height = h;
        };

        //判断鼠标是否在图形内部
        me.isInside = function(x, y) {
            if (x >= me.x - 2 && x <= (me.x + me.width + 4) && y >= me.y - 2 && y <= (me.y + me.height + 4)) { return true; } else { return false; }
        };
        me.draw = function(ctx) {
            ctx.save();

            ctx.restore();
        };
        return;
    }
};

//复合图形对象
WebGraph.Shape.Grid3D = {
    createNew: function() {
        var me = WebGraph.Model.Element.createNew();
        me.shapeType = "复合3Dgrid图形";
        me.color;
        me.length;
        me.count;
        //初始化函数
        me.init = function(x, y, width, height, color, length, count) {
            me.x = x;
            me.y = y;
            me.width = width;
            me.height = height;
            me.color = color;
            me.length = length;
            me.count = count;
        };

        //判断鼠标是否在图形内部
        me.isInside = function(x, y) {
            if (x >= me.x - 2 && x <= (me.x + me.width + 4) && y >= me.y - 2 && y <= (me.y + me.height + 4)) { return true; } else { return false; }
        };
        me.draw = function(ctx) {
            ctx.save();
            // WebGraph.Drawing2D.draw3DGrid(ctx,width,height,color, length, count);
            WebGraph.Drawing3D.draw3DGrid(ctx, me.width, me.height, me.color, me.length, me.count);
            ctx.restore();
        };
        return me;
    }
};


//3D矩形对象
WebGraph.Shape.Rect3D = {
    createNew: function(id) {
        var me = WebGraph.Shape.ShapeBase.createNew();
        me.shapeType = "3D矩形";
        me.rx = 0;
        me.ry = 0;
        me.eleva = 0.6; //仰角
        me.depth = 10;

        me.topPath = null;
        me.sidePath = null;
        me.frontPath = null;

        me.topColor = null;
        me.sideColor = null;
        me.frontColor = null;

        me.imageX = null;
        me.imageY = null;
        me.image = null;

        if (id != undefined)
            me.id = id;

        //初始化函数
        me.init = function(x, y, w, h, d, e, strokeWidth, strokeColor, fillColor) {
            me.x = x;
            me.y = y;
            me.width = w;
            me.height = h;
            me.eleva = e; //仰角
            me.depth = d;
            me.strokeWidth = strokeWidth;
            me.stroke = strokeColor;
            me.fill = fillColor;
            //三个面顶点坐标（上 前 右侧）
            me.topPath = WebGraph.Shape.Path.createNew();
            me.frontPath = WebGraph.Shape.Path.createNew();
            me.sidePath = WebGraph.Shape.Path.createNew();
            me.setSidePoints();

            //三个面颜色
            me.topColor = fillColor;
            var hexColor = fillColor; // this.colourNameToHex(color);
            if (hexColor) {
                var r = hexColor.substring(1, 3);
                var g = hexColor.substring(3, 5);
                var b = hexColor.substring(5, 7);
                var decR = parseInt(r, 16);
                var decG = parseInt(g, 16);
                var decB = parseInt(b, 16);
                var darkFactor1 = .8;
                var darkFactor2 = .5;
                me.frontColor = 'rgb(' + Math.round(decR * darkFactor1) + ',' + Math.round(decG * darkFactor1) + ',' + Math.round(decB * darkFactor1) + ')';
                me.sideColor = 'rgb(' + Math.round(decR * darkFactor2) + ',' + Math.round(decG * darkFactor2) + ',' + Math.round(decB * darkFactor2) + ')';
            }
            me.topPath.fill = me.topColor;
            me.frontPath.fill = me.frontColor;
            me.sidePath.fill = me.sideColor;

        };
        me.setSidePoints = function() {
            //三个面顶点坐标（上 前 右侧）
            var pNW = { x: me.x, y: me.y };
            var pNE = { x: me.x + me.width, y: me.y };
            var pSW = { x: me.x, y: me.y + me.height };
            var pSE = { x: me.x + me.width, y: me.y + me.height };
            var pNW2 = WebGraph.Math.getAnglePoint({ x: me.x, y: me.y }, me.depth, me.eleva);
            var pNE2 = { x: pNW2.x + me.width, y: pNW2.y };
            var pSW2 = { x: pNW2.x, y: pNW2.y + me.height };
            var pSE2 = { x: pNW2.x + me.width, y: pNW2.y + me.height };

            me.topPath.points = pNW.x + "," + pNW.y + " " + pNW2.x + "," + pNW2.y + " " + pNE2.x + "," + pNE2.y + " " + pNE.x + "," + pNE.y + " " + pNW.x + "," + pNW.y;
            me.frontPath.points = pNW.x + "," + pNW.y + " " + pNE.x + "," + pNE.y + " " + pSE.x + "," + pSE.y + " " + pSW.x + "," + pSW.y + " " + pNW.x + "," + pNW.y;
            me.sidePath.points = pNE.x + "," + pNE.y + " " + pNE2.x + "," + pNE2.y + " " + pSE2.x + "," + pSE2.y + " " + pSE.x + "," + pSE.y + " " + pNE.x + "," + pNE.y;
        };

        me.setBounds = function(x, y, w, h) {
            me.x = x;
            me.y = y;
            me.width = w;
            me.height = h;
            me.setSidePoints();
        };

        me.setMoveAfter = function(newX, newY) {
            me.setSidePoints();
        };
        //判断鼠标是否在图形内部
        me.isInside = function(mx, my) {
            var x = mx;
            var y = my;
            var h = 0;

            if (me.selector) h = 15
                //如果旋转
            if (me.rotate != 0) {
                var rotatePoint = WebGraph.Math.getRotatePoint({
                    x: mx,
                    y: my
                }, {
                    x: me.x + me.width / 2,
                    y: me.y + me.height / 2
                }, -me.rotate);
                x = rotatePoint.x;
                y = rotatePoint.y;
            }

            if (x >= me.x - 2 && x <= (me.x + me.width + 4) && y >= me.y - 2 - h && y <= (me.y + me.height + 4 + h)) {
                return true;
            }

            if (me.topPath.isInside(mx, my)) return true;
            if (me.sidePath.isInside(mx, my)) return true;

            return false;

        };

        me.drawChilds = function(ctx, left, top, w, h) {};
        me.draw = function(ctx) {
            ctx.save();
            //旋转
            var rx = me.x;
            var ry = me.y;
            if (me.rotate != 0) {
                ctx.translate(me.x + me.width / 2, me.y + me.height / 2);
                ctx.rotate(me.rotate * Math.PI / 180);
                rx = -me.width / 2;
                ry = -me.height / 2;
            }
            // 设置图形透明度
            // 使用gloabalAlpha属性，值介于0到1，0：完全透明，1：完全不透明
            // ctx.globalAlpha = me.opacity;

            ctx.lineWidth = me.strokeWidth;


            me.topPath.draw(ctx);
            me.sidePath.draw(ctx);

            me.frontPath.hovered = me.hovered;
            me.frontPath.selected = me.selected;
            if (me.hovered) {
                me.frontPath.strokeStyle = me.hoverStroke;
                me.frontPath.lineWidth = me.strokeWidth + 1;
            } else

            if (me.selected) {
                me.frontPath.strokeStyle = me.selectedStroke;
                me.frontPath.lineWidth = me.strokeWidth + 1;
            }
            if (me.selected == false && me.hovered == false)
                me.frontPath.strokeStyle = me.stroke;

            me.frontPath.draw(ctx);
            //如果是图片
            if (me.image == null && me.imageSrc) {
                me.image = new Image();
                me.image.src = me.imageSrc;
            }

            if (me.image) {
                ctx.drawImage(me.image, rx, ry, me.width, me.height);
                if (me.hovered || me.selected) {
                    WebGraph.Drawing2D.roundRect(ctx, rx, ry, me.width, me.height, 5, false, true);
                }
            }

            //画上下左右中文本
            me.draw5Text(me, rx, ry, ctx);
            //画图形内部对象
            me.drawChilds(ctx, rx, ry, me.width, me.height);
            //画选择器
            if (me.selector && me.selector.visible) {
                me.selector.draw(ctx, rx, ry);
            }
            ctx.restore();
        };

        return me;
    }
};



/* Web拓扑图形组件
 *作者： 刘金山
 *日期： 2014-07-01
 */

//控件对象

//超链接文本对象
WebGraph.Controls.LinkText = {
    createNew: function() {
        //继承
        var t = WebGraph.Shape.Text.createNew();
        t.ShapeType = "超链接文本";
        t.href = "#";
        t.mouseDown = function(e, p) {
            window.location.href = t.href;
        };

        t.mouseUp = function(e, p) {

        };

        t.mouseMove = function(e, p) {};
        return t;
    }
};

//按钮对象
WebGraph.Controls.Button = {
    createNew: function() {
        //继承
        var t = WebGraph.Shape.Rect.createNew();
        t.ShapeType = "Button";
        t.href = "#";
        //  t.mouseDown = function(e,p) {
        // 	window.location.href=t.href; 
        // };

        // t.mouseUp = function(e,p) {

        // };

        // t.mouseMove = function(e,p) {  
        // };	
        return t;
    }
};


//进度条
WebGraph.Controls.ProgressBar = {
    createNew: function(id) {
        var me = WebGraph.Model.Element.createNew();
        me.ShapeType = "进度条";
        me.Text = "正在加载数据...";

        //初始化函数
        me.init = function(x, y, w, h) {
            me.x = x;
            me.y = y;
            me.width = w;
            me.height = h;
        };

        // function drawProcess() {
        //    // 选出页面上所有class为process的canvas元素,然后迭代每一个元素画图(这里用Jquery的选择器选的)
        // $('canvas.process').each(function() {
        //            // 第一部先拿到canvas标签中间的文字,就是那个61%(这里的stringTrim方法是我自己的方法,去前后空格的方法很多的,这里就不贴出来了)
        // 	var text = commonutil.stringTrim($(this).text());
        // 	var process = text.substring(0, text.length-1);

        //            // 一个canvas标签
        // 	var canvas = this;
        //            // 拿到绘图上下文,目前只支持"2d"
        // 	var context = canvas.getContext('2d');
        // // 将绘图区域清空,如果是第一次在这个画布上画图,画布上没有东西,这步就不需要了
        // 	context.clearRect(0, 0, 48, 48);

        // // ***开始画一个灰色的圆
        // 	context.beginPath();
        //           &nbsp;// 坐标移动到圆心
        // 	context.moveTo(24, 24);
        //            // 画圆,圆心是24,24,半径24,从角度0开始,画到2PI结束,最后一个参数是方向顺时针还是逆时针
        // 	context.arc(24, 24, 24, 0, Math.PI * 2, false);
        // 	context.closePath();
        //            // 填充颜色
        // 	context.fillStyle = '#ddd';
        // 	context.fill();
        //            // ***灰色的圆画完

        // 	// 画进度
        // 	context.beginPath();
        //            // 画扇形的时候这步很重要,画笔不在圆心画出来的不是扇形
        // 	context.moveTo(24, 24);
        //            // 跟上面的圆唯一的区别在这里,不画满圆,画个扇形
        // 	context.arc(24, 24, 24, 0, Math.PI * 2 * process / 100, false);
        // 	context.closePath();
        // 	context.fillStyle = '#e74c3c';
        // 	context.fill();

        // 	// 画内部空白
        // 	context.beginPath();
        // 	context.moveTo(24, 24);
        // 	context.arc(24, 24, 21, 0, Math.PI * 2, true);
        // 	context.closePath();
        // 	context.fillStyle = 'rgba(255,255,255,1)';
        // 	context.fill();

        // // 画一条线
        // 	context.beginPath();
        // 	context.arc(24, 24, 18.5, 0, Math.PI * 2, true);
        // 	context.closePath();
        //            // 与画实心圆的区别,fill是填充,stroke是画线
        // 	context.strokeStyle = '#ddd';
        // 	context.stroke();

        //            //在中间写字
        //     context.font = "bold 9pt Arial";
        //     context.fillStyle = '#e74c3c';
        //     context.textAlign = 'center';
        //     context.textBaseline = 'middle';
        //     context.moveTo(24, 24);
        //     context.fillText(text, 24, 24);
        // }
        me.draw = function(ctx) {
            ctx.save();

            ctx.restore();
        };
        return;
    }
};




//tip对象
WebGraph.Controls.toolTip = {
    createNew: function(id) {
        var me = WebGraph.Shape.Rect.createNew();
        me.ShapeType = "tip";
        me.tipContext = [];
        me.tipText = null;
        me.rx = 5;
        //me.font="9px 宋体";
        me.draw = function(ctx) {
            ctx.save();
            ctx.scale(1, 1);

            var xy = me.initContext(ctx);
            var cx = xy.X;
            var cy = xy.Y;
            var w = 50; //me.width;
            var h = 30; //me.height;

            if (me.tipContext == null && me.tipText) {
                me.tipContext = [];
                me.tipContext.push(me.tipText);
            }
            if (me.tipContext && me.tipContext.length > 0) {
                ctx.font = me.font;
                //计算字符串宽度
                var metrics;

                for (var i = me.tipContext.length - 1; i >= 0; i--) {
                    metrics = ctx.measureText(me.tipContext[i]);
                    if (w < metrics.width) w = metrics.width;
                }
                if (w > ctx.canvas.clientWidth / 2) {
                    w = ctx.canvas.clientWidth / 2;
                }

                if (w + cx + 10 > ctx.canvas.clientWidth)
                    cx = cx - w - 30;

                var tipCtx = [];
                var text;
                for (var i = 0; i < me.tipContext.length; i++) {
                    text = me.tipContext[i];
                    metrics = ctx.measureText(text);
                    if (metrics.width > w) {
                        var n = text.length;
                        var wordWidth = metrics.width / n; //单词宽度
                        var wordCount = parseInt(w / wordWidth) - 1; //个数
                        var rowCount = metrics.width / w; //分行
                        var startLocation = 0; //分行位置
                        for (var ii = 0; ii < rowCount; ii++) {
                            tipCtx.push(text.substr(startLocation, wordCount));
                            startLocation = startLocation + wordCount;
                            //如果是最后行
                            if (wordCount + startLocation > text.length)
                                wordCount = text.length - startLocation;
                        }

                    } else
                        tipCtx.push(text);
                }
                h = tipCtx.length * 25;
                ctx.globalAlpha = 0.9;
                ctx.fillStyle = "gold";
                if (me.rx > 0) //圆角矩形
                    WebGraph.Drawing2D.roundRect(ctx, cx, cy, w + 25, h + 5, me.rx, true, true);
                else
                    WebGraph.Drawing2D.Rect(ctx, cx, cy, w + 25, h + 5);
                ctx.globalAlpha = 1;
                var offsetY = cy + 20;
                ctx.fillStyle = "black";
                for (var i = 0; i < tipCtx.length; i++) {
                    ctx.fillText(tipCtx[i], cx + 10, offsetY);
                    offsetY = offsetY + 20;
                }
                //        	for (var i =0; i <me.tipContext.length; i++) {
                //        		 text=me.tipContext[i];
                //        		metrics = ctx.measureText(text);
                // if (metrics.width > w) {
                // 	var n = text.length;
                // 	var wordWidth = metrics.width / n; //单词宽度
                // 	var wordCount = parseInt(w / wordWidth)-1;//个数
                // 	var rowCount=metrics.width/w;//分行
                // 	var startLocation=0; //分行位置
                // 	for(var ii=0;ii<rowCount;ii++)
                // 	{
                // 		var txt = text.substr(startLocation, wordCount);
                // 		ctx.fillText(txt, cx + 10, offsetY);
                // 		offsetY = offsetY + 20;
                // 		startLocation=startLocation+wordCount;
                // 		//如果是最后行
                // 		if (wordCount+startLocation>text.length)
                // 			wordCount=text.length-startLocation;
                // 	}


                // } else {
                // 	ctx.fillText(text, cx + 10, offsetY);
                // 	offsetY = offsetY + 20;
                // }            		 
                //        	} 
            }
            ctx.restore();
        };

        return me;
    }
};

