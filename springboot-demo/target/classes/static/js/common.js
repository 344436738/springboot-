var Utils = {
	//prd
	//url:"http://172.30.21.74:7005/visualizationplatform_reptile/landcarriage/services.vc",	
	//local
	url:"http://127.0.0.1:8080/visualizationplatform-reptile/",	
	//向服务中心发送异步请求
	ajaxService : function(serviceName, body,ck1,ck2) {
         var json = {};
		var head = {};
		head.serviceName = serviceName;
		head.clientName = "前台接口";
		json.head = head;
		json.body = body;

		$.ajax({
			type : 'POST',
			url : this.url,
			data : JSON.stringify(body),
		
			contentType:'application/json;charset=UTF-8',   
			success : function(data) {
				ck1(data);
			},
			error : function(data) {
				console.log(data);
				if(ck2){
					ck2();
				}
			}
		});

	},
	Serviceajax : function(serviceName, body,ck1,ck2) {
		$.ajax({
			type : 'POST',
			url : serviceName,
			data : JSON.stringify(body),
			dataType:'json',
			contentType:'application/json;charset=UTF-8',    
			success : function(data) {
				ck1(data);
			},
			error : function(data) {
				console.log(data);
				if(ck2){
					ck2();
				}
			}
		});

	},
	
	
	
	//空字符串判断
	isEmptyString : function (str) {
	    if (str == null || str == "" || str == undefined || str == 'undefined') {
		    return true;
	    } else {
		    return false;
	    }
    },
    // 获取url上的参数
    getUrlParam : function(paraName) {    	
    	var url = location.href;
    	if(url.indexOf("#") > 0){
    		var paraString = url.substring(url.indexOf("#") + 1, url.length);
    	    if(this.isEmptyString(paraString)){
    	    	return "";
    	    }
    	    paraString = base64.decode64(paraString);
    	    paraString = base64.utf8to16(paraString)
    	    var params = paraString.split("&");
    	    var paraObj = {}
    	    for (i = 0; j = params[i]; i++) {
    	       paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j
    	           .indexOf("=") + 1, j.length);
    	     }
    	    
    	    var returnValue = paraObj[paraName.toLowerCase()];
    	    if (typeof (returnValue) == "undefined") {
    	       return "";
    	    }else {
    	       return returnValue;
    	    }
    	}else{
    		return "";
    	}
	    
   },
   //获取url的参数（新的）
    getParam : function (name) {
        var search = document.location.search;
        //alert(search);
        var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
        var matcher = pattern.exec(search);
        var items = null;
        if (null != matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
        return items;
    }

    
    
    
    
};
