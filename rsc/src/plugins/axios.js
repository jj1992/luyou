"use strict";

import Vue from 'vue';
import axios from "axios";
import Toast from 'muse-ui-toast';
import qs from  'qs';

Vue.use(Toast);

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
 axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
//axios.defaults.headers.common['AuSthorization'] = "1111";
let config = {
 baseURL: "/api",
  //baseURL: "/",
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
   withCredentials: true, // Check cross-site Access-Control
   
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  (config)=> {
    
    // Do something before request is sent

    let token = window.localStorage.getItem("token");
    let areaIds =  window.localStorage.getItem("AreaIds");
    let authorName =  window.localStorage.getItem("AuthorName");
    let bureaus =  window.localStorage.getItem("Bureaus");

    if(token){//token
      config.headers.Authorization = "Bearer " + token;
    }
    if(authorName){//用户名
      config.headers.AuthorName = authorName;
    }
    // 等后台aop拦截写好了注释掉这里 两个if 权限和局所
    if(areaIds){//权限
      config.headers.AreaIds = areaIds;
    }
    if(bureaus){//局所
      config.headers.Bureaus = bureaus;
    }
    //在所有请求上添加参数 权限和局所
    if(config.data){
      config.data += '&' + qs.stringify({AreaIds:areaIds,Bureaus:bureaus});
    } else {
      config.data = qs.stringify({AreaIds:areaIds,Bureaus:bureaus});
    }
    return config;
  },
  (error)=> {
    // Do something with request error
    // Toast.error('网络异常');
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  (response)=> {
    const data = response.data;
    // Do something with response data
    if(data.code != 200){
      Toast.error(data.msg);
    } 
    if(data.data === null){
      //data.code = 999; //当数据不存在时，修改状态码为999 如果需要提示，可以在方法中自行定义
      // Toast.error('数据为空');
      
    }

    return response;
  },
  (error)=> {
    // Do something with response error
    if(error && error.response){
      const errorSts = error.response.status;
      switch (errorSts) {
        case 404:
            Toast.error('无法连接服务器');
          break;
        case 504:
            Toast.error('服务器连接超时');
          break;
      }
    }
   
    
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;