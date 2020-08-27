import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Login = () =>
    import ('../components/comment/Login/Login')

Vue.use(VueRouter)

const routes = [{
        path: '/login',
        component: Login
    },
    {
        path: '/',
        redirect: '/login'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router