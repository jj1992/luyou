import Vue from 'vue';
import App from './App.vue';

import './plugins/axios'
import router from './plugins/router'
import './plugins/muse'
import searchInput from "@/components/moudles/Search.vue";
import vflex from "@/components/moudles/VFlexContainer.vue";
import hfLoadMore from "@/components/moudles/LoadContainer.vue"
import store from'./plugins/store';
import loading from'./plugins/loading';
import md5 from 'js-md5';
import util from "./plugins/utils.js";
import './assets/icon/font.css'
import VueResource from 'vue-resource'
Vue.use(VueResource)
import VueJsonp from 'vue-jsonp'
Vue.use(VueJsonp)
import $ from 'jquery'
var coordtransform = require('coordtransform')
Vue.prototype.$coordtransform = coordtransform;
Vue.config.productionTip = false
Vue.component('searchInput',searchInput);
Vue.component('vflex',vflex);
Vue.component('hfLoadMore',hfLoadMore);
Vue.prototype.$md5 = md5;
Vue.prototype.$util = util;
import FastClick from 'fastclick';
FastClick.attach(document.body);
new Vue({
  render: h => h(App),
  router:router,
  store:store,
  loading:loading
}).$mount('#app')

// FastClick.prototype.focus = function(targetElement) {
//   var length;
//   if (deviceIsIOS&& targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
//    length = targetElement.value.length;
//    targetElement.focus();
//    targetElement.setSelectionRange(length, length);  
//   } else {
//    targetElement.focus();
//  }
//  };