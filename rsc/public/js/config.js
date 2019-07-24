$(function(){ 
    $(document).ajaxError(
            function(event,xhr,options,exc ){
                if(xhr.status == 'undefined'){
                    return;
                }
                switch(xhr.status){
                    case 403:
                       //未授权
                    	 alert("您的身份验证过期!");
                    	 location.href=getloginAddr();
                        break;
                    case 404:
                        alert("没有找到该资源！");
                        break;
                }
            }
    );
});
function getloginAddr(){
	return "http://"+this.location.hostname+":"+this.location.port+"/tools/";
}

function getWebPath(){
	//var basePath =(new RegExp("htt.*//.*?/.*?/")).exec(window.document.location.href);
	var basePath =(new RegExp("htt.*//.*?/")).exec(window.document.location.href);
	return basePath;
}

window.rootPath = getWebPath();

var APP_MODES = {
	"PC":"PC",
	"MOBILE":"MOBILE"
};

$(function(){ 
	//add message event listener
	if(window.addEventListener){
		window.addEventListener('message',function(e){
			receiveMessage(e);
		},false);
	}else if(window.attachEvent){
		window.attachEvent('message',function(e){
			receiveMessage(e);
		});
	}
});
function sendMessage(msg){
	if(parent){
		parent.postMessage(msg,"*");
	}
}

function receiveMessage(event)
{
	// 我们能信任信息来源吗？
	//if (event.origin !== "http://example.com:8080")
	//  return;  
	// event.data
	// event.source 
	// event.origin 来源
	//event.source.postMessage("hi there yourself!" + "is: rheeeeet!", event.origin);
	//"appmode","oprtype","restype","resid";
	var param = event.data;
	if(!param) return;
	var oprCon = $.parseJSON(param);
	if("locate" == oprCon.oprtype){
		if(locateExtend){
			locateExtend(oprCon.restype,oprCon.resid);
		}
	}
}

//
