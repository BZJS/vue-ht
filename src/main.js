import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入初始化的css
import './assets/css/global.css'
// 注册全局的Element组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message

// 使用axios
import axios from 'axios'
axios.defaults.baseURL = "http://47.115.124.102:8888/api/private/v1"
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')