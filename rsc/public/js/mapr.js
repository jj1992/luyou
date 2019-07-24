 
	function getloginAddr(){
		return "http://"+this.location.hostname+":"+this.location.port+"/tools/";
	}	
	
 	var map;
 	//内
	// var fzdMapServer = "http://132.90.156.30:8001/arcgis/rest/services/prm_map/MapServer";
	var fzdMapServer = "http://202.96.18.74:9003/arcgis/rest/services/prm_map/MapServer";
 	//外
	var serverREST = "http://202.96.18.90:8064/arcgis/rest/services";
 	//
 	var geometryService2 = serverREST + "/Geometry/GeometryServer";
 	var geometryService = geometryService2;
	//bg
	// var bgurl = serverREST + "/BT_BACK_2012/MapServer";
	var bgurl = serverREST + "/BT_BACK_2012/MapServer";
	//有可能不同，重新定义一个
	// var louyuMapServer = serverREST + "/building/MapServer";	
	var louyuMapServer = serverREST + "/LianXinLyTest/MapServer";	
	var louyuUrl = louyuMapServer + "/0";
	var pfUrl =  louyuMapServer + "/1";	
	var fzdUrl = fzdMapServer +"/3"
	//
	var lyFields = ["BUILDINGNAME","BUILDINGNO"];
	var pfFields = ["NAME","FLDTAG"];
	var fzdFields = ["NAME","REFID"];
	
	var LayerNames ={
		"LYNAME":"建筑",
		"PFNAME":"平房_2012"
	};
	
	var bgLayer;
	var louyuLayer;
	var pfLayer;
	var jzwLayer;
	var fzdLayer;	
	//
	var locateGraphic;
	// var searchLocateGraphic;
	
	var fzdSymbol;
	var fzdSelGraphic;
	var fzdSearchGraphic;
	var jzwSymbol;
	var jzwSelGraphic;
	var lySymbol;
	var lySelGraphic;
	var lySearchGraphic;

	var lyClickGraphic;

	//存放gis调用相关的参数供外部调用
	var gisParams = {};
	
//定义地图图层的ID		
	var LayerIDConstant = {
		"BJ":"BJ",
		"FZD":"FZD",
		"JZW":"JZW",
		"LY":"LY",
		"PF":"PF",
		"JF":"JF"			
	};
	
	
	function initializeEsriJS(){
		require([
			"dojo/parser",
			"esri/Color", 
			"esri/geometry/Point",
			"esri/graphic","esri/dijit/Scalebar",
			"esri/layers/ArcGISTiledMapServiceLayer",
			"esri/layers/FeatureLayer",
			"esri/map","esri/renderers/SimpleRenderer","esri/symbols/SimpleMarkerSymbol",
			"esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol",
			"esri/symbols/SimpleLineSymbol",
			"esri/config","esri/tasks/GeometryService","esri/tasks/ProjectParameters",
			"esri/tasks/query",
			"esri/tasks/QueryTask","esri/tasks/FindTask","esri/tasks/FindParameters",
			"esri/geometry/Extent","dojo/_base/connect","dojo/_base/array",
			"dojo/domReady!"
			],
			function (parser, Color,Point,Graphic,Scalebar,
			ArcGISTiledMapServiceLayer,FeatureLayer,
			Map,SimpleRenderer,SimpleMarkerSymbol,
			PictureMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol,
			esriConfig,GeometryService,ProjectParameters,
			Query, QueryTask,FindTask,FindParameters,
			Extent,connect,array
			){
			parser.parse();

			var lyMinScale = 100000;
	//定义地图操作对象	        
			var mapOprate = {
				curTool : "default",//"add" ,"selectpoint"
				drawTool: "",//Point,Polygon,Polyline
				serachDist: 5,
				serachCenterX: 0,
				searchCenterY: 0,
				devId:"",
				devType:"",
				curX:0,
				curY:0
			};

			
	//配置代理	
			// esriConfig.defaults.io.proxyUrl = proxy_url;
			// esriConfig.defaults.io.alwaysUseProxy = true;
			// esriConfig.defaults.io.corsDetection = false;
			// esriConfig.defaults.geometryService = new GeometryService(geometryService);
			
			//116.388648,39.97408
			var initExent =  new Extent({xmin:116.358648,ymin:39.95408,xmax:116.388648,ymax: 39.97408,spatialReference:{wkid: 4326 }});
	//arcgis创建map,定义初始区域	        // create the map
			map = new Map("ui-map", { logo: false, zoom: 8,sliderStyle: "small",slider:true,extent: initExent});
	//地图比例尺	        
	        var scalebar = new Scalebar({
	            map: map,
	            scalebarStyle:Scalebar.esriScalebarRuler,
	            scalebarUnit:"metric"
	          });

	//添加地图加载时点击地图的监听事件
			var layersLoaded = 0; 
			var loading = dojo.byId("loadingImg");        
			connect.connect(map, "onLoad", function(evt) {
				getBaiduLocal();
				// showLoading();
				map.on("click",function(evt){
					window.focus();
          clearTempGraphics();
					gisParams.coordinate(evt.mapPoint.x,evt.mapPoint.y);

					//点击地图任意坐标生成红色十字
					var point = new Point(evt.mapPoint.x,evt.mapPoint.y,map.spatialReference);
					//map.centerAt(point);
					var sym = getMarkerSybmol("selpolyred");
					lyClickGraphic = new Graphic(point,sym);
					map.graphics.add(lyClickGraphic);
				})
				// baiduHelper.getBaiduLL(getBaiduLLRet);
			});
			//正在加载图片，需要就放开
			// connect.connect(map, "onZoomStart", showLoading);//开始缩放
			// connect.connect(map, "onPanStart", showLoading);//鼠标移动

			//获取百度坐标
			function getBaiduLocal(){
				
				//H5定位gps
				// if (navigator.geolocation){
				// 	navigator.geolocation.getCurrentPosition(function (position) {
				// 		var x = position.coords.longitude;
				// 		var y = position.coords.latitude;
				// 		zoomtoLL(x,y);
				// 	})
				// }else{
				// 	displayTip("获取地理位置错误");
				// }

				//原生坐标
				if(window.parent.nativeApis){
					window.parent.nativeApis.startLocation();
					window.parent.onLocationResult =(longitude,latitude)=>{
						//alert("经度："+longitude+"纬度："+latitude);
						var wgs = coordtransform.gcj02towgs84(longitude,latitude);
						zoomtoLL(wgs[0],wgs[1]);
					}
				}else{
					//浏览器定位baidu
					var geolocation = new BMap.Geolocation();
					geolocation.enableSDKLocation();
					geolocation.getCurrentPosition(function(r){
						if(this.getStatus() == BMAP_STATUS_SUCCESS){
							var wgs = coordtransform.bd09towgs84(r.point.lng,r.point.lat);
							zoomtoLL(wgs[0],wgs[1]);
						}else{
							// displayTip("获取地理位置错误");
						}
					})
				}
			}

	//添加背景图层		        
			bgLayer = new ArcGISTiledMapServiceLayer(bgurl,{id:LayerIDConstant.BJ});
			map.addLayer(bgLayer);
			// connect.connect(bgLayer, "onUpdate", hideLoading);
					
	//添加楼宇图层		    
			louyuLayer = new FeatureLayer(louyuUrl,{id:LayerIDConstant.LY,
					mode: FeatureLayer.MODE_ONDEMAND,
					visible: true, 
					outFields:lyFields
				});
			lySymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
				new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([125,255,255,0.35]), 1)
				,new Color([125,125,125,0.35]));
			var renderer2 = new SimpleRenderer(lySymbol);
			louyuLayer.setRenderer(renderer2);
			louyuLayer.setSelectionSymbol(getMarkerSybmol("selpolygon"));
			louyuLayer.setMinScale(lyMinScale);
			// map.addLayer(louyuLayer);
			// connect.connect(louyuLayer, "onUpdate", hideLoading);	
	//添加平方图层		    	        
			pfLayer = new FeatureLayer(pfUrl,
				{mode: FeatureLayer.MODE_ONDEMAND,visible: true,id:LayerIDConstant.PF
					,outFields: pfFields
			});
			var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
					new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([196,196,196,0.35]), 1)
				,new Color([196,196,196,0.35]));		   		
			var renderer1 = new SimpleRenderer(symbol);	        
			pfLayer.setRenderer(renderer1);
			pfLayer.setSelectionSymbol(getMarkerSybmol("selpolygon"));
			pfLayer.setMinScale(lyMinScale);
			
			// map.addLayer(pfLayer);	
			// connect.connect(pfLayer, "onUpdate", hideLoading);       
	//添加放置点图层fzd layer
			// var featureCollection = {
			// 	"layerDefinition": null,
			// 	"featureSet": {"features": [],"geometryType": "esriGeometryPoint"}
			// };
			
			// fzdSymbol = getMarkerSybmol("placepoint");
			// var fzdRenderer = getRenderer(LayerIDConstant.FZD);
			// featureCollection.layerDefinition = {
			// 	"geometryType": "esriGeometryPoint",
			// 	"objectIdField": "ObjectID",
			// 	"drawingInfo": {
			// 			"renderer": fzdRenderer
			// 		},
			// 		"fields": [{
			// 			"name": "REFID",
			// 			"alias": "REFID",
			// 			"type": "esriFieldTypeInteger"
			// 		}, {
			// 			"name": "NAME",
			// 			"alias": "NAME",
			// 			"type": "esriFieldTypeString"
			// 		}]
			// };
			// //create a feature layer based on the feature collection
			// fzdLayer = new FeatureLayer(featureCollection, {id: LayerIDConstant.FZD });

			fzdSymbol = getMarkerSybmol("placepoint");
			fzdLayer = new FeatureLayer(fzdUrl,
				{mode: FeatureLayer.MODE_ONDEMAND,visible: true,id:LayerIDConstant.FZD,outFields:fzdFields});
			var renderer1 = new SimpleRenderer(fzdSymbol);	        
			fzdLayer.setRenderer(renderer1);
			fzdLayer.setSelectionSymbol(getMarkerSybmol("placepoint_big"));
			fzdLayer.setMinScale(lyMinScale);
			
			// map.addLayer(fzdLayer);
			// connect.connect(fzdLayer, "onUpdate", hideLoading); 	
//添加建筑物图层 jzwlayer
			var jzwCollection = {
				"layerDefinition": null,
				"featureSet": {"features": [],"geometryType": "esriGeometryPoint"}
			};
			var jzwsymjson =  new PictureMarkerSymbol({
				"url":"images/Building32.png",
				"height":20,
				"width":20,
				"type":"esriPMS"            	   
				});
				jzwSymbol = new SimpleMarkerSymbol(jzwsymjson);
				jzwCollection.layerDefinition = {
				"geometryType": "esriGeometryPoint",
				"objectIdField": "ObjectID",
				"drawingInfo": {
				"renderer": {
					"type": "simple",
					"symbol": jzwsymjson
				}
				},
				"fields": [{
					"name": "REFID",
					"alias": "REFID",
					"type": "esriFieldTypeInteger"
				}, {
					"name": "NAME",
					"alias": "NAME",
					"type": "esriFieldTypeString"
				}]
			};
			//create a feature layer based on the feature collection
			jzwLayer = new FeatureLayer(jzwCollection, {id: LayerIDConstant.JZW });

			// map.addLayer(jzwLayer);
			// connect.connect(jzwLayer, "onUpdate", hideLoading); 
				
//指定的层添加到映射后触发,放置点图层加载数据
			// map.on("layer-add-result", function(result) {
			// 	if(result.layer.id == LayerIDConstant.FZD){
			// 	//   requestFzds();
			// 	}
			// });
			//add the feature layer that contains the flickr photos to the map
			//
			function cancelEvent(evt){
				evt = evt || window.event; 
				if (evt.stopPropagation) { 
					evt.stopPropagation();//IE以外 
				} else { 
					evt.cancelBubble = true;//IE 
				} 
			}

			function showLoading() {
				esri.show(loading);
				map.disableMapNavigation();
				map.hideZoomSlider();
			  }
	  
			function hideLoading() {
				// layersLoaded++;
				// if (layersLoaded === map.layerIds.length) {
					esri.hide(loading);
					map.enableMapNavigation();
					map.showZoomSlider();
					layersLoaded = 0;
				// }
			}
//点击楼宇层触发的方法	        
					
			connect.connect(louyuLayer, 'onClick', function(evt) {
				//select the clicked feature
				if(mapOprate.curTool == "add" || mapOprate.curTool == "selectpoint"){
					return;
				}
				var name = evt.graphic.attributes["BUILDINGNAME"];
				var constructionNo = evt.graphic.attributes["BUILDINGNO"];
				// console.log("楼宇："+name+"("+constructionNo+")");
				gisParams.showLocalResult(constructionNo,'0');
				clearTempGraphics();
				lySelGraphic = evt.graphic;
				clickFeatureEvent(louyuLayer,evt);
				cancelEvent(evt);
			}); 
			
//从搜索楼宇点击定位
			function showLocalInMap(name,constructionNo,buildingType){
				clearTempGraphics();
				var findTask, findParams;
				findTask = new FindTask(louyuMapServer);
				//create find parameters and define known values
				findParams = new FindParameters();
				findParams.contains = false;
				findParams.returnGeometry = true;
				findParams.layerIds = [0,1];
				findParams.searchFields = [lyFields[0],pfFields[0]];
				findParams.searchText = name;
				findTask.execute(findParams, function(results) {
					if(results && results.length > 0){
						for(var i=0;i<results.length;i++){
							var graphic = results[i].feature;
							if(graphic.attributes["BUILDINGNO"] == constructionNo){
								lySearchGraphic = graphic;
								lySearchGraphic.setSymbol(getMarkerSybmol("selpolygon"));
								lySearchGraphic.draw();
								map.graphics.add(lySearchGraphic);
								map.setLevel(8);
								convertGeomandCenter(graphic);
								gisParams.showLocalResult(constructionNo,buildingType);
								return true;
							}
						}
					}else{
						gisParams.showError("暂无位置信息！");
						gisParams.showLocalResult(constructionNo,buildingType);
					}
					
				}, function (err) {
					gisParams.showError("获取定位失败！");
				});
			}
			gisParams.showLocalInMap = showLocalInMap;

//从搜索平方点击定位
			function showLocalInMap2(name,constructionNo,buildingType){
				clearTempGraphics();
				var findTask, findParams; 
				findTask = new FindTask(louyuMapServer);
				//create find parameters and define known values
				findParams = new FindParameters();
				findParams.contains = false;
				findParams.returnGeometry = true;
				findParams.layerIds = [0,1];
				findParams.searchFields = [lyFields[0],pfFields[0]];
				findParams.searchText = name;
				findTask.execute(findParams, function(results) {
					if(results && results.length > 0){
						for(var i=0;i<results.length;i++){
							var graphic = results[i].feature;
							if(graphic.attributes["FLDID"] == constructionNo){
								lySearchGraphic = graphic;
								lySearchGraphic.setSymbol(getMarkerSybmol("selpolygon"));
								lySearchGraphic.draw();
								map.graphics.add(lySearchGraphic);
								map.setLevel(8);
								convertGeomandCenter(graphic);
								gisParams.showLocalResult(constructionNo,buildingType);
								return true;
							}
						}
					}else{
						gisParams.showError("暂无位置信息！");
						gisParams.showLocalResult(constructionNo,buildingType);
					}
					
				}, function (err) {
					gisParams.showError("获取定位失败！");
				});
			}
			gisParams.showLocalInMap2 = showLocalInMap2;



//显示机房和壁挂点
			var bnoList = new Array();
			var pointList = new Array();
			var isFirst = true;
			var tempGraphics = [];
			map.on("extent-change",function(){
				// console.log(map.__LOD.level);
				if(map.__LOD.level >= 9){
					if(isFirst){
						for ( var i = 0,len = pointList.length;i <len; i++){
							map.graphics.add(pointList[i]);
						}
						isFirst = false;
					}
					getGraphicData();
				}else{
					for ( var i = 0,len = pointList.length;i <len; i++){
						map.graphics.remove(pointList[i]);
					}
					isFirst = true;
					tempGraphics = louyuLayer.graphics;
				}
			});
			var sendGraphics = new Array();
			function getGraphicData(){
				var lyGraphics = louyuLayer.graphics;
				if(lyGraphics.length == 0){
					lyGraphics = tempGraphics;
				}
				var sendList = new Array();
				array.some(lyGraphics,function(g){
					var gid = g.attributes["BUILDINGNO"];
					if(bnoList.indexOf(gid) == -1){
						bnoList.push(gid);
						sendList.push(gid);
						sendGraphics.push(g);
					}
				}); 
				if(sendList.length > 0){
					gisParams.getBuildingItem(sendList);
				}
			}
			//显示机房
			var	sym_jf = getMarkerSybmol("croom");
			var	sym_bgd = getMarkerSybmol("wallpoint");
			function showCRoomInMap(data){
				var currentGraphic = null;
				var count = data.length;
				while(count > 0){
					var item = data[data.length-count];
					array.some(sendGraphics,function(g){
						var gid = g.attributes["BUILDINGNO"];
						if(item.buildNo == gid){
							currentGraphic = g;
						}
					}); 
					var _extent = currentGraphic._extent;
					var x = rnd(_extent.xmin,_extent.xmax);
					var y = rnd(_extent.ymin,_extent.ymax);
					var point = new Point(x,y,map.spatialReference);
					if (currentGraphic.geometry.contains(point)) {
						var graphic = null;
						if(item.type == 249){
							graphic = new Graphic(point,sym_jf);
						}else if(item.type == 382){
							graphic = new Graphic(point,sym_bgd);
						}
						map.graphics.add(graphic);
						pointList.push(graphic);
						count--;
					}
				}
			}
			gisParams.showCRoomInMap = showCRoomInMap;
			//获取随机数
			function rnd(min, max){
				return Math.random() * (max - min) + min
			}


//点击平房层触发的方法		    
			connect.connect(pfLayer, 'onClick', function(evt) {	
				if(mapOprate.curTool == "add" || mapOprate.curTool == "selectpoint"){
					return;
				}
				// console.log(evt.graphic);
				var name = evt.graphic.attributes["NAME"];
				var constructionNo = evt.graphic.attributes["FLDID"];
				// console.log("楼宇："+name+"("+constructionNo+")");
				gisParams.showLocalResult(constructionNo,'1');
				clearTempGraphics();
				lySelGraphic = evt.graphic;
				clickFeatureEvent(pfLayer,evt);
				cancelEvent(evt);
			});
//点击放置点层触发的方法		        
			connect.connect(fzdLayer, 'onClick', function(evt) {
				if(mapOprate.curTool == "add" || mapOprate.curTool == "selectpoint"){
					return;
				}
				// console.log("放置点："+evt.graphic.attributes["REFID"]+evt.graphic.attributes["NAME"]);
				gisParams.showOutPLocalResult(evt.graphic.attributes["REFID"]);
				clearTempGraphics();
				clickFeatureEvent(fzdLayer,evt);
				cancelEvent(evt);
			});

//从搜索放置点点击定位
			function showSearchPlacePointInMap(name,id){
				// console.log("名称："+name+",id:"+id);
				clearTempGraphics();
				var findTask, findParams;
				findTask = new FindTask(fzdMapServer);
				//create find parameters and define known values
				findParams = new FindParameters();
				findParams.contains = false;
				findParams.returnGeometry = true;
				findParams.layerIds = [3];
				findParams.searchFields = [fzdFields[1]];
				findParams.searchText = id;
				findTask.execute(findParams, function(results) {
					if(results && results.length >0){
						for(var i=0;i<results.length;i++){
							fzdSearchGraphic = results[i].feature;
							fzdSearchGraphic.setSymbol(getMarkerSybmol("placepoint_big"));
							fzdSearchGraphic.draw();
							map.graphics.add(fzdSearchGraphic);
							map.setLevel(8);
							convertGeomandCenter(fzdSearchGraphic);
							gisParams.showOutPLocalResult(id);
							return true;
						}
					}else{
						gisParams.showError("暂无位置信息！");
						gisParams.showOutPLocalResult(id);
					}
					
				}, function (err) {
					gisParams.showError("获取定位失败！");
				});
				
				// array.some(fzdLayer.graphics,function(g){
				// 	var gname = g.attributes["POINTNAME"];
				// 	var gid = g.attributes["POINTID"];
				// 	if(gname == name && gid == id){
				// 		gisParams.showOutPLocalResult(id);
				// 		clearTempGraphics();
				// 		if(fzdSelGraphic){
				// 			resetSymbol(fzdLayer,fzdSelGraphic);
				// 		}
				// 		fzdSelGraphic = g;
				// 		fzdSelGraphic.setSymbol(getMarkerSybmol("placepoint_big"));
				// 		fzdSelGraphic.draw();
				// 		convertGeomandCenter(g);
				// 	}
				// }); 
			}
			gisParams.showSearchPlacePointInMap = showSearchPlacePointInMap;
//点击建筑物层触发的方法		        
			connect.connect(jzwLayer, 'onClick', function(evt) {
				if(mapOprate.curTool == "add" || mapOprate.curTool == "selectpoint"){
					return;
				}
				clickFeatureEvent(jzwLayer,evt);
				cancelEvent(evt);
			});

//放置点数据，请求放置点数据(调接口)	
			function requestFzdSucceeded(data) {
				//loop through the items and add to the feature layer
				var features = [];
				array.forEach(data, function(item) {
					if(item.x && item.y){
						var attr = {};
						attr["POINTID"] = item.pointID;
						attr["POINTNAME"] = item.name;
						var point = new Point(item.x,item.y,map.spatialReference);
						var graphic = new Graphic(point,fzdSymbol);
						graphic.setAttributes(attr);
						features.push(graphic);
						// fzdLayer.graphics.add(graphic);
					}
				});
				fzdLayer.applyEdits(features, null, null);      	
			}
			gisParams.requestFzdSucceeded = requestFzdSucceeded;
//点击定位获取当前位置		        
			function getCurrentLocation(){
				clearTempGraphics();
				clearSelection("none");
				// baiduHelper.getBaiduLL(getBaiduLLRet);
				getBaiduLocal();
			}
			gisParams.getCurrentLocation = getCurrentLocation;
			function getBaiduLLRet(ret){
				if("0" == ret.error){
					var x = 2 * ret.lng - ret.lng2;
					var y = 2 * ret.lat - ret.lat2; 
					zoomtoLL(x,y);        		
				}
				else{
					displayTip("获取地理位置错误");
				}
			}
//给定坐标重新定位			   
			function zoomtoLL(lon,lat){		
				var point = new Point(lon,lat,map.spatialReference);
				//map.centerAt(point);
				map.centerAndZoom(point,8);
				var sym = getMarkerSybmol("locate");
				if(!locateGraphic){	                	
					locateGraphic = new Graphic(point,sym);
					map.graphics.add(locateGraphic);
				}else{
					map.graphics.remove(locateGraphic);
					locateGraphic = new Graphic(point,sym);
					map.graphics.add(locateGraphic);
				}			    	
			}        
			
//添加放置点图层fzd	时调用		    
				function getRenderer(resType){			    	
					//create renderer			    	
					var uvrJson = {"type": "uniqueValue",
							"field1": "ZT",
							"defaultSymbol": {
									"color": [0,0,255,64],
									"size": 13,							
									"type": "esriSMS",
									"style": "esriSMSCircle",
									"outline": {
									"color": [0,0,0,255],
									"width": 1,
									"type": "esriSLS",
									"style": "esriSLSSolid"
									}
							},
							"uniqueValueInfos": [{
								"value": "0",
								"symbol": {
									"color": [255,0,0,80],
									"size": 13,							
									"type": "esriSMS",
									"style": "esriSMSCircle",
									"outline": {
									"color": [0,0,0,255],
									"width": 1,
									"type": "esriSLS",
									"style": "esriSLSSolid"
									}
								}
							}, {
								"value": "1",
								"symbol": {
									"color": [0,255,0,80],
									"size": 13,							
									"type": "esriSMS",
									"style": "esriSMSCircle",
									"outline": {
									"color": [0,0,0,255],
									"width": 1,
									"type": "esriSLS",
									"style": "esriSLSSolid"
									}
								}
							}]
							}
				return uvrJson;
			}
//定义定位图标symbol
			function getMarkerSybmol(resType){
				var lightLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
						new Color([128, 255, 255]), 2);
				var lightPolygonSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_DIAGONAL_CROSS, 
						lightLineSymbol, new Color([255, 255,128, 0.5]));
				var symbol;
				if(resType == "locate"){ //黑十字
					// symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CROSS, 14,
					// 	new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
					// 	new Color([0,0,128]), 2),
					// 	new Color([0,0,255,1])
					//    );
					//红色定位
					symbol = new PictureMarkerSymbol('./images/location.png', 23, 30);
				}		   			
				else if(resType == "selpolygon"){
					symbol = lightPolygonSymbol;
				}
				else if(resType == "seljzw"){
					symbol = new PictureMarkerSymbol('images/Building32Select.png', 22, 22);
				}
				else if(resType == "croom"){ //机房
					symbol = new PictureMarkerSymbol('./images/croom.png', 23, 30);
				}
				else if(resType == "wallpoint"){ //壁挂点
					symbol = new PictureMarkerSymbol('./images/wallpoint.png', 23, 30);
				}
				else if(resType == "placepoint"){ //放置点
					symbol = new PictureMarkerSymbol('./images/placepoint.png', 23, 30);
				}
				else if(resType == "placepoint_big"){ //放置点_大
					symbol = new PictureMarkerSymbol('./images/placepoint.png', 30, 39);
				}
				else if(resType == "selpoint_blue"){ //蓝圆
					symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 13,
						new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
						new Color([128, 255, 255]), 2),
						new Color([0, 0, 255,0.5])
					);
				}
				else if(resType == "selpoint_red"){ //红圆
					symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 13,
						new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
						new Color([128, 255, 255]), 2),
						new Color([255, 0, 0,0.5])
					);
				}
				else if(resType == "selpoint_green"){ //绿圆
					symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 13,
						new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
						new Color([128, 255, 255]), 2),
						new Color([0, 255, 0,0.5])
					);
				}
				else if(resType == "selpolyline"){
					symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
						new Color([255, 255, 0]), 2);
				}
				else if(resType == "selpolyred"){ //红十字
					symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CROSS, 14,
						new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
						new Color([255,0,0]), 2),
						new Color([0,255,0,0.25])
					);
				}			        
				return symbol;
			}	
//清除定位图标symbol时调用	            
			function resetSymbol(layer,g){
				var r = layer.renderer;
				if(!r){
					g.setSymbol(null);
					return;
				}
				var sym = r.getSymbol(g);
				if(sym){
					g.setSymbol(sym);
					g.draw();
				}
			}
//清除临时图层方法	            //clear  tmp graphic  //map.graphics
			function clearTempGraphics(){
				if(fzdSelGraphic){
					resetSymbol(fzdLayer,fzdSelGraphic);
					fzdSelGraphic.setSymbol(fzdSymbol);
					fzdSelGraphic.draw();
					fzdSelGraphic = null;		
				}
				if(fzdSearchGraphic){
					map.graphics.remove(fzdSearchGraphic);
					fzdSearchGraphic = null;
				}
				if(jzwSelGraphic){
					jzwSelGraphic.setSymbol(jzwSymbol);
					jzwSelGraphic.draw();
					jzwSelGraphic = null;	            		
				}
				if(lySelGraphic){
					// resetSymbol(lyLayer,lySelGraphic);
					lySelGraphic.setSymbol(lySymbol);
					lySelGraphic.draw();
					lySelGraphic = null;	            		
				}
				if(lySearchGraphic){
					map.graphics.remove(lySearchGraphic);
					lySearchGraphic = null;
				}
				if(lyClickGraphic){
					map.graphics.remove(lyClickGraphic);
					lyClickGraphic = null;
				}
			}
//清除选中方法	            //clear selection
			function clearSelection(curLyid){	            	
				array.forEach(map.graphicsLayerIds, function (lyid) {
					if(lyid == LayerIDConstant.FZD){
						return;
					}
					if(curLyid != lyid){
						var layer = map.getLayer(lyid);
						layer.clearSelection();
					}
				});
			}
//点击各图层时调用的方法	            //click event
			function clickFeatureEvent(layer,evt){
				// clearTempGraphics();
				if("default" == mapOprate.curTool){
					var lyid = layer.id;
					clearSelection(lyid);
					var fieldName = "REFID"; 
					if(LayerIDConstant.FZD == lyid){
						if(fzdSelGraphic){
							resetSymbol(fzdLayer,fzdSelGraphic);
						}
						fzdSelGraphic = evt.graphic;
						fzdSelGraphic.setSymbol(getMarkerSybmol("placepoint_big"));
						fzdSelGraphic.draw();
					}
					else if(LayerIDConstant.JZW == lyid){
						if(jzwSelGraphic){
							jzwSelGraphic.setSymbol(jzwSymbol);
							jzwSelGraphic.draw();
						}
						jzwSelGraphic = evt.graphic;
						jzwSelGraphic.setSymbol(getMarkerSybmol("seljzw"));
						jzwSelGraphic.draw();
					}
					else if(LayerIDConstant.LY == lyid || LayerIDConstant.PF == lyid){
						lySelGraphic = evt.graphic;
						lySelGraphic.setSymbol(getMarkerSybmol("selpolygon"));
						lySelGraphic.draw();
					}
					else{
						var query = new Query();
						query.geometry = evt.graphic.geometry;
						layer.selectFeatures(query,FeatureLayer.SELECTION_NEW);
					}
					
					//将几何中心转换为点击的图块
					convertGeomandCenter(evt.graphic);
				} 
			}				

//转换几何中心				
			function convertGeomandCenter(graphic){
				var geom = graphic.geometry;
				var params = new ProjectParameters();
				params.geometries = [geom];
				params.outSR = map.spatialReference;
									
				var gsvc = new GeometryService(geometryService2);
				gsvc.project(params, function (result) {
					//result[0].x;result[0].y;
					locatetogeom(graphic,result[0]);
				}, function (err) {
					// displayTip("坐标转换错误");
					//略过代理直接定位
					locatetogeom(graphic,graphic.geometry);
				});
			}
			function locatetogeom(graphic,newGeom){
				switch (newGeom.type) {
					case "point":
						map.centerAt(newGeom);
						break;
					case "polygon":
						map.centerAt(newGeom.getCentroid());
						break;
				}	
			}
		});      
	}	
	 
//*******************************************以上地图加载
//消息提示方法	 
	function displayTip(msg){
		gisParams.showError(msg);
	}
//页面加载触发
	$(function(){
		initializeEsriJS();
	});

