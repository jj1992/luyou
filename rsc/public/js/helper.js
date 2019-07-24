
var baiduHelper = {
	getBaiduLL : function(retFunc){	
    	var   geolocation = new BMap.Geolocation();
		//enable sdk location
		geolocation.enableSDKLocation();
		geolocation.getCurrentPosition(function(r){
			var ret = {};
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				//r.point.lng+','+r.point.lat
				ret.error = "0";
				ret.lng = r.point.lng;
				ret.lat = r.point.lat;
				// alert("r.point.lng:"+r.point.lng+",r.point.lat:"+r.point.lat)
				//retFunc(ret);				
				convertBd_test(ret, retFunc);
			}
			else {
				ret.error = "1";			
				retFunc(ret);
			}	
		},{enableHighAccuracy: true});
	}
};

function convertBd_test(baiduLL,retFunc){
	var x=baiduLL.lng;//longitude
	var y=baiduLL.lat;//latitude
	//var x = 116.39516057658;
	//var y = 39.980382664578;		
	var ggPoint = new BMap.Point(x,y);
	var convertor = new BMap.Convertor();
	var pointArr = [];
	pointArr.push(ggPoint);
	convertor.translate(pointArr, 1, 5, function (data){
			if(data.status === 0) {
				//data.points[0]
				var x2 = data.points[0].lng;  
				var y2 = data.points[0].lat;  
				// alert("x2:"+x2+",y2:"+y2)
				retFunc({"error":"0","lng2":x2,"lat2":y2,"lng":x,"lat":y});
			}else{
				retFunc({"error":"1"});
			}        
	});    
}
function convertBaiduLL(baiduLL,retFunc){
	var x=baiduLL.lng;//longitude
	var y=baiduLL.lat;//latitude
	var url="http://api.map.baidu.com/ag/coord/convert?from=0&to=4&x="+ x +"&y="+y;
	alert(url);
	/*var data = {"error":0,"x":"MTE2LjQxMzk3OTU5MjM=","y":"MzkuOTg5NzY0MzkxMjIy"}
	var base = new Base64();  
	var x2 = base.decode(data.x);  
	var y2 = base.decode(data.y);
	retFunc({"error":"0","lng2":x2,"lat2":y2,"lng":x,"lat":y});*/
	$.getJSON(url,function(data){
		if(data.error == "0") {
			var base = new Base64();  
			var x2 = base.decode(data.x);  
			var y2 = base.decode(data.y);
			retFunc({"error":"0","lng2":x2,"lat2":y2,"lng":x,"lat":y});
		} 
		else{
			return {"error":"1"};
		}
	});
	/*$.ajax({
		type: "get",
		url: url,		
		crossDomain: true,
		//dataType: "json",
		async: true,
		success: function(data) {
		    alert(data);
		    //{“error”:0,”x”:”MTIxLjUwMDIyODIxNDk2″,”y”:”MzEuMjM1ODUwMjYwMTE3″} 
			if(data.error == "0") {
				var base = new Base64();  
				var x2 = base.decode(data.x);  
				var y2 = base.decode(data.y);
				retFunc({"error":"0","lng2":x2,"lat2":y2,"lng":x,"lat":y});
			} 
			else{
				return {"error":"1"};
			}
		}
	});*/
}

/** 
* 
*  Base64 encode / decode 
* 
*  @author haitao.tu 
*  @date   2010-04-26 
*  @email  tuhaitao@foxmail.com 
* 
*/  
   
function Base64() {  
   
    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  
   
    // public method for encoding  
    this.encode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = _utf8_encode(input);  
        while (i < input.length) {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output +  
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +  
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
        }  
        return output;  
    }  
   
    // public method for decoding  
    this.decode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = _utf8_decode(output);  
        return output;  
    }  
   
    // private method for UTF-8 encoding  
    _utf8_encode = function (string) {  
        string = string.replace(/\r\n/g,"\n");  
        var utftext = "";  
        for (var n = 0; n < string.length; n++) {  
            var c = string.charCodeAt(n);  
            if (c < 128) {  
                utftext += String.fromCharCode(c);  
            } else if((c > 127) && (c < 2048)) {  
                utftext += String.fromCharCode((c >> 6) | 192);  
                utftext += String.fromCharCode((c & 63) | 128);  
            } else {  
                utftext += String.fromCharCode((c >> 12) | 224);  
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
                utftext += String.fromCharCode((c & 63) | 128);  
            }  
   
        }  
        return utftext;  
    }  
   
    // private method for UTF-8 decoding  
    _utf8_decode = function (utftext) {  
        var string = "";  
        var i = 0;  
        var c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
    }  
}