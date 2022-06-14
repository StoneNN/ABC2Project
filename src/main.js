/*
 * @Author: Nn
 * @Date: 2022-06-13 11:04:54
 * @LastEditors: Nn
 * @LastEditTime: 2022-06-14 17:02:59
 * @Description: 
 */
import Vue from 'vue'
import App from './App.vue'

// 引入VueRouter
import VueRouter from 'vue-router';
// 引入路由器
import router from '@/router/index';

//
// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';

import rpc from './odoorpc';

const baseURL = process.env.VUE_APP_BASE_API;
const timeout = 50000;

// 注册 odoo addons, 包括 预定义的 menus, actions, views
// 自定义的 addons, 也在这里注册
const odooAddons = require.context('@/odoorpc/addons', true, /\.js$/);
const addons_list = [odooAddons];

rpc.init({ baseURL, timeout, addons_list });

//应用插件
Vue.use(VueRouter);
// Vue.use(Antd);

Vue.config.productionTip = false;


new Vue({

  router, // router
  render: h => h(App),

}).$mount('#app');
