// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import '@/assets/index.css'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

//将axios放到vue原型上
Vue.prototype.$http = axios
//发送axios请求的公共路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
//请求拦截器
axios.interceptors.request.use(function(config){
  //请求数据时将token放入请求头，这样后端才能判断返回数据
  config.headers.Authorization = localStorage.getItem('token');
  return config;
})
//响应拦截器
axios.interceptors.response.use(function(response){
  //如果这里的token是伪造的，会进行拦截，并跳回登录页
  if(response.data.meta.status === 401){
    router.push('/login');
  }
  return response;
})

Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
