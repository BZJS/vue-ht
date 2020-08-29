import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Login = () =>
    import ('../components/comment/Login/Login')
const Home = () =>
    import ('../views/Home/Home')
const WelCome = () =>
    import ('../views/Home/Childrens/WelCome')
const User = () =>
    import ('../views/Home/Childrens/User')

// 权限列表
const Rights = () =>
    import ('../views/Power/Rights')
    // 角色列表
const Roles = () =>
    import ('../views/Power/Roles')



Vue.use(VueRouter)

const routes = [{
        path: '/login',
        component: Login
    },
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/home',
        component: Home,
        redirect: '/Welcome',
        children: [{
                path: '/Welcome',
                component: WelCome,
            },
            { path: '/users', component: User },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles }

        ]

    }
]

const router = new VueRouter({
        mode: 'history',
        base: process.env.BASE_URL,
        routes
    })
    // 设置全局路由导航守卫
router.beforeEach((to, from, next) => {
    // 这里设置路由跳转限制
    // 跳转到login组件没限制,直接放行
    // 然后全部路由都会进行一个判断,有token,直接放行,该干嘛干嘛,没有token,只能去往login组件
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router