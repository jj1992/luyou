/* 
 *右键菜单：ContextMenu
 *作者： 刘金山
 *日期： 2014-07-01
 */

/*
 * ContextMenu（右键菜单）类共两个成员变量和两个成员方法。
 * 两个成员没有太多让使用者去了解的意义。使用者只要关心其
 * 中的两个方法就够了。下面介绍两个方法。
 * ***************************************************
 * addItem(itemText,styleImg,ev)方法，给右键菜单添加功能
 * 项,共三个参数。
 * itemText : 功能项（subItem,下同）的文字
 * styleImg : 功能项的小图标
 * ev       : 功能项被点击时响应的函数
 * ***************************************************
 * addMenuTo(obj)方法,将该右键菜单应用到指定的元素。共一
 * 个参数。
 * obj : 应用该右键菜单的元素
 */
WebGraph.Controls.ContextMenu = function(divID) {
    //this.menu       = document.createElement("div");
    this.menu = document.getElementById(divID);
    this.menuBody = document.createElement("ul");
    this.target;
    this.visible = false;
    this.clearMenu = function() {
        if (this.menu != null && this.menu.childNodes.length > 0) {
            for (var i = this.menu.childNodes.length - 1; i >= 0; i--)
                this.menu.removeChild(this.menu.childNodes[i]);
        }
    };
    this.showMenu = function(evt, target) {
        var XPos = evt.clientX;
        var YPos = evt.clientY;
        var s_Top = document.documentElement.scrollTop || document.body.scrollTop; //向下滚动了多少
        var s_Left = document.documentElement.scrollLeft || document.body.scrollLeft; //向左滚动了多少

        this.menu.style.top = parseInt(YPos) + s_Top + "px";
        this.menu.style.left = parseInt(XPos) + s_Left + "px";
        this.menu.style.display = "inline-block";
        this.menu.style.visibility = "visible";
        // this.menu.style.zindex  = "99";
        // this.menu.style.position="absolute";
        this.target = target;
        this.visible = true;
        //return false;
    };

    this.hidenMenu = function() {
        this.menu.style.visibility = "hidden";
        this.menu.style.display = "none";
        this.visible = false;
    };


    /**
     * addItem方法给右键菜单添加功能项。共三个参数
     * itemText :功能项（subItem,下同）的文字
     * styleImg : 功能项的小图标
     * ev       :功能项被点击时响应的函数 
     */
    this.addItem = function(itemText, styleImg, ev) {
        var subItem = document.createElement("li");
        var menu = this.menu;

        subItem.innerHTML = itemText;

        with(subItem.style) {
            /*配合外部样式表，控制样式*/
            className = "ContextMenuSubItem";
            fontSize = "12px";
            height = "16px";
            paddingLeft = "22px";
            margin = "2px";
            background = "url(" + styleImg + ") no-repeat #cde6c7";
            opacity = "0.7";
            cursor = "default";
        }
        subItem.onmouseover = function() {
            with(subItem.style) {
                opacity = "1";
                cursor = "default";
                background = "url(" + styleImg + ") no-repeat #abc88b";
            }
        };
        subItem.onmouseout = function() {
            subItem.style.opacity = "0.7";
            subItem.style.cursor = "default";
            subItem.style.background = "url(" + styleImg + ") no-repeat #cde6c7";
        };
        subItem.onclick = function() {
            subItem.style.cursor = "default";
            /*
             * 特别提醒：此处如果你把以下这句写成"menu.style.cssText = 'display:none;'"
             * 会出现一个很奇怪的现象。那就是当menu每改变一个或多个样式时，
             * 其余未改动的样式会全部丧失，不得不把其他样式再次重设。这问
             * 题浪费了我3~4个钟，后来不得已，一句一句代码看了几遍，再次
             * 看到这时，隐约想起在网上有文章说过，cssText设置样式会有
             * “一改全无”的现象。这才搞定。
             */
            menu.style.display = "none";
            ev();
            return false;
        };

        this.menuBody.appendChild(subItem);
    };
    /**
     * addMenuTo方法将该右键菜单应用到指定的元素。一个参数。
     * obj : 应用该右键菜单的元素
     */
    this.addMenuTo = function(obj) {
        /*设置ul的样式*/
        with(this.menuBody.style) {
                /*配合外部样式表，控制样式*/
                className = "myContextMenuBody";
                listStyle = "none";
                listStylePosition = "inside";
                margin = "0px";
                padding = "0px";
            }
            /*设置div的样式*/
        with(this.menu.style) {
            /*配合外部样式表，控制样式*/
            className = "myContextMenu";
            position = "absolute";
            display = "none"
            background = "#cde6c7";
            width = "110px";
            zindex = "99";
            border = "1px solid #1d953f"
        }

        this.menu.appendChild(this.menuBody);
        document.body.appendChild(this.menu);
        /*由于在事件函数内，this指代的对象不再是本类的对象，
         * 所以为以下函数定义一个全局变量menu
         */
        var menu = this.menu;
        obj.onblur = function() {
                menu.style.display = "none"; //none";
            }
            //暂时不用这个事件
            // obj.oncontextmenu = function(ev){
            //     menu.style.top     = ev.pageY;
            //     menu.style.left    = ev.pageX;
            //     menu.style.display = "block";
            //     return false;
            // }
    }
};

// //使用方法
// function initMenu(webCanvas)
// {
//     var menu = new ContextMenu();
//     menu.clearMenu();

//     menu.addItem(
//         "新增",
//         "images/go-down.png",
//         function(obj) {
//             return function() {
//                 alert('右键[新增]事件 ID：' + obj.selectedShape.id);
//             }
//         }(webCanvas)
//     );
//     menu.addItem(
//         "修改",
//         "images/go-up.png",
//         function(obj) {
//             return function() {
//                 alert('右键[修改]事件 ID：' + obj.selectedShape.id);
//             }
//         }(webCanvas)
//     );
//     menu.addItem(
//         "删除",
//         "img/003.gif",
//         function(obj) {
//             return function() {
//                 alert('右键[删除]事件 ID：' + obj.selectedShape.id);
//             }
//         }(webCanvas)
//     );

//     menu.addMenuTo(webCanvas.canvas);
//     return menu;
// }



// /**
// *根据传入的id显示右键菜单
// */
// function showMenu(evt,id)
// {
//  //menuForm.id.value = id;
//  if("" == id)
//  {
//      popMenu(itemMenu,100,"100");
//  }
//  else
//  {
//      popMenu(itemMenu,100,"111");
//  }
//  event.returnValue=false;
//  event.cancelBubble=true;
//  return false;
// }
// /**
// *显示弹出菜单
// *menuDiv:右键菜单的内容
// *width:行显示的宽度
// *rowControlString:行控制字符串，0表示不显示，1表示显示，如“101”，则表示第1、3行显示，第2行不显示
// */
// function popMenu(menuDiv,width,rowControlString)
// {
//  //创建弹出菜单
//  var pop=window.createPopup();
//  //设置弹出菜单的内容
//  pop.document.body.innerHTML=menuDiv.innerHTML;
//  var rowObjs=pop.document.body.all[0].rows;
//  //获得弹出菜单的行数
//  var rowCount=rowObjs.length;
//  //循环设置每行的属性
//  for(var i=0;i<rowObjs.length;i++)
//  {
//  //如果设置该行不显示，则行数减一
//  var hide=rowControlString.charAt(i)!='1';
//  if(hide){
//  rowCount--;
//  }
//  //设置是否显示该行
//  rowObjs[i].style.display=(hide)?"none":"";
//  //设置鼠标滑入该行时的效果
//  rowObjs[i].cells[0].onmouseover=function()
//  {
//  this.style.background="#818181";
//  this.style.color="white";
//  }
//  //设置鼠标滑出该行时的效果
//  rowObjs[i].cells[0].onmouseout=function(){
//  this.style.background="#cccccc";
//  this.style.color="black";
//  }
// }
// //屏蔽菜单的菜单
// pop.document.oncontextmenu=function()
// {
//     return false;
// }
// //选择右键菜单的一项后，菜单隐藏
// pop.document.onclick=function()
// {
//  pop.hide();
// }
// //显示菜单
// pop.show(event.clientX-1,event.clientY,width,rowCount*25,document.body);
//  return true;
// }
// function create()
// {
//  alert("create" + menuForm.id.value + "!");
// }
// function update()
// {
//  alert("update" + menuForm.id.value + "!");
// }
// function del()
// {
//  alert("delete" + menuForm.id.value + "!");
// }
// function clickMenu()
// {
//  alert("you click a menu!");
// }