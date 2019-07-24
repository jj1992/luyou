/* 
 *Web拓扑图形组件
 *作者： 刘金山
 *日期： 2014-07-01
 */

//Web图形画板对象  
WebGraph.Controls.WebTopology = {
    createNew: function(canvas_id) {
        var t = WebGraph.Model.CanvasBase.createNew(canvas_id);
        t.backColorTheme = 'RoyalBlue'; //RoyalBlue  //rgb(20,77,100)
        t.layers = null; //图层[]
        t.activeLayer = null; //当前激活的图层
        //t.symbol=[]；
        t.groups = null; //分组[]	
        t.buttons = null; //按钮 	
        t.selectedReDraw = true; //是否在选中图形对象时置顶重新画
        // //根节点
        // t.root = null;  
        // t.nodes=t.shapes;
        // t.node=null;
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

        //根据Id取shape对象
        t.getShape = function(id) {
            if (t.layers) {
                return t.layers.getShape(id);
            } else {
                var n = t.shapes.length;
                for (var i = 0; i < n; i++) {
                    if (t.shapes[i].id == id)
                        return t.shapes[i];
                }

                if (t.connector)
                    return t.connector.getShape(id);
                if (t.buttons)
                    return t.buttons.getShape(id);
            }
        };

        //获取点所在的图形对象
        t.getPointShape = function(x, y) {
            var shape = null;
            //按钮对象集合
            if (t.buttons) {
                var n = t.buttons.length;
                for (var i = n - 1; i >= 0; i--) {
                    shape = t.buttons[i];
                    if (shape.isInside(x, y))
                        return shape;
                    else
                        shape = null;
                }
            }



            if (t.layers) {
                shape = t.layers.getPointShape(x, y);
                if (shape) return shape;
            }

            var n = t.shapes.length;
            for (var i = n - 1; i >= 0; i--) {
                shape = t.shapes[i];
                if (shape.allowActive && shape.visible && shape.isInside(x, y))
                    return shape;
                else
                    shape = null;
            }

            //线对象
            if (t.connector) {
                shape = t.connector.getPointShape(x, y);
                if (shape) return shape;
            }

            return shape;

        };
        //绘制图形函数
        t.draw = function() {
            var ctx = t.context;
            if (t.doubleBuffer)
                ctx = t.bufferContext;

            //清空画板		
            ctx.clearRect(0, 0, t.canvas.width, t.canvas.height);
            //画背景
            if (t.backColorTheme) {
                var grd = ctx.createLinearGradient(0, -20, 0, t.canvas.height + 20);
                //grd.addColorStop(0,"Blue");
                grd.addColorStop(0, t.backColorTheme);
                grd.addColorStop(0.4, "FloralWhite");
                grd.addColorStop(0.5, "White");
                grd.addColorStop(0.6, "FloralWhite");
                grd.addColorStop(1, t.backColorTheme);
                ctx.fillStyle = grd;
            } else {
                ctx.fillStyle = t.backColor;
            }
            ctx.fillRect(0, 0, t.canvas.width, t.canvas.height);
            ctx.save();
            ctx.scale(t.scale, t.scale);

            if (t.centerPoint)
                ctx.translate(t.centerPoint.X, t.centerPoint.Y);
            var n = 0;

            n = t.backShapes.length;
            for (var i = 0; i < n; i++)
                t.backShapes[i].draw(ctx);


            //重画选中对象
            // if (t.selectedShape)
            // 	t.selectedShape.draw(ctx);
            // if (t.hoverShape)
            // 	t.hoverShape.draw(ctx);




            if (t.buttons != null) {
                n = t.buttons.length;
                for (var i = 0; i < n; i++) { if (t.buttons[i].visible) t.buttons[i].draw(ctx); }
            }

            n = t.shapes.length;
            for (var i = 0; i < n; i++) {
                if (t.shapes[i].visible) {
                    t.shapes[i].draw(ctx);
                    t.shapes[i].context = ctx; //画布对象
                }
            }

            //连接器
            if (t.connector != null)
                t.connector.draw(ctx);

            if (t.layers) {
                t.layers.draw(ctx);
            }
            //重画选中对象
            if (t.selectedReDraw) {
                if (t.selectedShape) {
                    t.selectedShape.draw(ctx);
                    if (t.selectedShape.groups) {
                        for (var i = 0; i < t.selectedShape.groups.length; i++) {
                            t.selectedShape.groups[i].draw(ctx);
                            if (t.selectedShape.groups[i].groups) {
                                for (var j = 0; j < t.selectedShape.groups[i].groups.length; j++) {
                                    t.selectedShape.groups[i].groups[j].draw(ctx);

                                }
                            }
                        }
                    }

                }




                if (t.hoverShape) {
                    if (t.hoverShape.allowActive) {
                        t.hoverShape.draw(ctx);
                        if (t.hoverShape.groups) {
                            for (var i = 0; i < t.hoverShape.groups.length; i++) {
                                if (t.hoverShape.groups[i].visible) {
                                    t.hoverShape.groups[i].draw(ctx);
                                    if (t.hoverShape.groups[i].groups) {
                                        for (var j = 0; j < t.hoverShape.groups[i].groups.length; j++) {
                                            t.hoverShape.groups[i].groups[j].draw(ctx);

                                        }
                                    }

                                }
                            }
                        }
                    }
                    //tip提示框
                    if (t.hoverShape.tipContext || t.hoverShape.tipText) {
                        if (t.tipBox == null) {
                            t.tipBox = WebGraph.Controls.toolTip.createNew();
                            t.tipBox.font = "12px 宋体";
                        }
                        if (t.tipBox.tipText || t.tipBox.tipContext) {
                            t.tipBox.tipContext = t.hoverShape.tipContext;
                            t.tipBox.tipText = t.hoverShape.tipText;
                            t.tipBox.x = t.hoverShape.mousePoint.x + 20;
                            t.tipBox.y = t.hoverShape.mousePoint.y;
                            // if (t.isMousedown==true)
                            t.tipBox.draw(ctx);
                        }
                    }


                }
            }
            //画选择器
            if (t.selector)
                t.selector.draw(ctx, 0, 0);

            //框选
            if (t.rectSelect)
                t.rectSelect.draw(ctx);
            //画图例
            if (t.legend && t.legend.visible == true)
                t.legend.draw(ctx);
            //画标尺
            if (t.showRuler) {
                WebGraph.Drawing2D.drawRulerX(ctx, t.canvas.width);
                WebGraph.Drawing2D.drawRulerY(ctx, t.canvas.height);
            }
            //画完后回调函数
            if (t.drawAfter)
                t.drawAfter(ctx);
            //双缓冲输出	 
            if (t.doubleBuffer) {
                t.context.clearRect(0, 0, t.canvas.width, t.canvas.height);
                t.context.drawImage(t.bufferCanvas, 0, 0);
            }

            ctx.restore();
        };
        t.getSvgString = function() {
            var svg = WebGraph.Model.CanvasToSvg.createNew(t);
            return svg.getSvgString();
        };

        return t;
    }
};