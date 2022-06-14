/*
 * @Author: Nn
 * @Date: 2022-06-14 15:13:45
 * @LastEditors: Nn
 * @LastEditTime: 2022-06-14 17:33:03
 * @Description: 路由
 */

import Vue from 'vue';
//  --1.--导入路由对象
import VueRouter from 'vue-router';

//引入布局
// import loginLot from '../layouts/loginLot.vue';
import defaultLot from '../layouts/default.vue';

//
import odooRpc from '@/odoorpc';

//引入组件
import Home from '@/pages/home.vue';
import Login from '@/pages/login.vue';
import Register from '@/pages/register.vue';

//  --2.--注入VueRouter插件
Vue.use(VueRouter);

//路由1
const mainRoutes = [
    {
        path:'/',
        name:'home',
        component:defaultLot,
        redirect:'/home',
        children:[
            {
                path:'/home',
                name:'home',
                meta:{title:'首页'},
                component:Home
            },
        ]
    }
];
//路由2
const loginRoutes = [
    {
        path:'/userLogin',
        name:'userLogin',
        meta:{title:'管理员登录'},
        component:Login
    },
    {
        path:'/userRegister',
        name:'userRegister',
        meta:{title:'管理员注册'},
        component:Register
    }
];

const allRoutes = [ ...mainRoutes, ...loginRoutes ];

//  --3.-- 创建一个路由器实例 （机场）
const router = new VueRouter({
    //路由器工作模式（默认是 hash）
    mode:'hash',
    //  --4.-- 对路由实例设置 映射配置（航线）是一个对象
    routes:allRoutes
});

//全局前置路由守卫 ---- 初始化的时候被调用；每次路由切换之前被调用
router.beforeEach( async (to,from,next)=>{
    console.log("beforeEach ---> to,from",to, from);
    // next();

    const whiteList = ['/userLogin', '/test'];
    if (whiteList.includes(to.path)) {
        next();
        return;
    }
    const hasToken = await odooRpc.web.session_check();
    console.log('======= hasToken =======',hasToken);
    if (hasToken) {
        next();
        return;
    } else {
        next(`/userLogin?redirect=${to.path}`)
        return;
    }
})

//全局后置路由守卫 ---- 初始化的时候被调用；每次路由切换之后被调用（没有 next 参数）
router.afterEach((to,from)=>{
    console.log("afterEach ---> to,from",to, from);
    if(to.meta.title){ 
        document.title = to.meta.title //修改网页的title
    }else{
        document.title = '智力竞技综合管理平台'
    }
})

export default router;
