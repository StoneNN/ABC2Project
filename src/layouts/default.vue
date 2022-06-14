<!--
 * @Author: Nxf
 * @Date: 2022-04-05 18:42:09
 * @LastEditors: Nn
 * @LastEditTime: 2022-06-11 11:04:57
 * @Descripttion: Default Layout
-->

<template>
  <a-layout id="components-layout-demo-side" style="height: 100vh; min-height: 100%; width:100%">
    <a-layout-sider v-model="collapsed" collapsible>
      <div class="logo">{{ appName }}</div>
      <a-menu 
        theme="dark" 
        :default-selected-keys="['1']" 
        mode="inline"
        :inlineIndent="inlineIndent"
        :defaultSelectedKeys="[$route.path]"
        :openKeys="openKeys"
        :inline-collapsed="collapsed"
        @openChange="onOpenChange"
        @click="menuClick"
      >
        <!-- 菜单遍历的开始 -->
        <template v-for="item in menuList">
          <!-- 如果当前遍历项没有children，视为子菜单项，注意所有的key都是path用于路由跳转，以及当前选中记录 -->
          <a-menu-item v-if="!item.children" :key="item.path">
            <a-icon :type="item.icon" />
            <span>{{ item.title }}</span>
          </a-menu-item>
          <!-- 否则视为子菜单，传入菜单信息并且运用下面定义的函数式组件 （ vue3 中 if 与 else 的 key 不能相同 ）-->
          <sub-menu v-else :key="item.path + 1" :menu-info="item" />
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style=" position:relative; padding: 0; backgroundColor:lightGray; height:10vh;">
        <a-dropdown>
          <a class="ant-dropdown-link">
            <!-- 你好，用户001
            <a-icon type="down" /> -->
            <img src="../assets/people.png" alt="UserHeader" style="width:30px">
          </a>
          <a-menu slot="overlay" style="text-align:right ">
            <a-menu-item>
              你好，{{sessionInfo.name}}!
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item>
              <a>管理员信息 ></a>
            </a-menu-item>
            <a-menu-item>
              <a-button  @click="logOutAction()">退出登录</a-button>
            </a-menu-item>
          </a-menu>
        </a-dropdown>  
      </a-layout-header>  
      <a-layout-content style="padding: 0 10px; height: 85vh; overflow:auto; ">
        <BreadCrumbRouter/>
        <!-- position:'relative',
            top:'0px',
            left:'10px',
            right:'10px',
            bottom:'10px', -->
        <div
          :style="{ 
            margin:'0',
            background:'#fff',
            marginBottom:'10px',
            minHeight:'92%',
            width:'100%',
            background:'white',
            overflow:'auto'
          }"
        >
          <router-view></router-view>
        </div>
        <a-modal
          title="提示"
          okText="确定"
          cancelText="取消"
          :visible="visible"
          :confirm-loading="confirmLoading"
          @ok="handleOk"
          @cancel="handleCancel"
        >
          <p>{{ ModalText }}</p>
        </a-modal>
      </a-layout-content>
      <a-layout-footer style="height:5vh; line-height:5vh; padding:0px; text-align: center; font-size: 10px; font-weight: bolder; backgroundColor:lightGray">
        {{ appCompany }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
 
  import Vue from "vue";
  import { Layout, Table, Icon, Menu, Dropdown, Button, Modal } from "ant-design-vue";
  import BreadCrumbRouter from "../components/breads.vue";
  import 'ant-design-vue/dist/antd.css';
  import odooRpc from '@/odoorpc';

  Vue.use(Layout).use(Table).use(Icon).use(Menu).use(Dropdown).use(Button).use(Modal);
  Vue.use(BreadCrumbRouter);
  
  // 定义函数式组件
  const SubMenu = {
    template: `
        <a-sub-menu :key="menuInfo.path" v-bind="$props" v-on="$listeners">
          
          <span slot="title">
            <a-icon :type="menuInfo.icon" /><span>{{ menuInfo.title }}</span>
          </span>

          <template v-for="item in menuInfo.children">
            <a-menu-item v-if="!item.children" :key="item.path">
              <a-icon :type="item.icon" />
              <span>{{ item.title }}</span>
            </a-menu-item>
            <sub-menu v-else :key="item.path" :menu-info="item" />
          </template>
          
        </a-sub-menu>
      `,
    name: 'SubMenu',
    // must add isSubMenu: true 此项必须被定义
    // isSubMenu: true,
    props: {
      // 解构a-sub-menu的属性，也就是文章开头提到的为什么使用函数式组件
      ...Menu.SubMenu.props,
      // 接收父级传递过来的菜单信息
      menuInfo: {
        type: Object,
        default: () => ({}),
      },
    },
  };
  export default {
    name:"defaultLayoutCpnt",
    // 注册局部组件
    components:{
      BreadCrumbRouter,
      'sub-menu': SubMenu,
    },
    data() {
      return {
        //
        appCompany:process.env.VUE_APP_COMPANY,
        appName:process.env.VUE_APP_NAME,
        
        // 菜单缩进
        inlineIndent:12,
        // 默认不折叠
        collapsed: false,
        // 全部顶级父节点,用来控制所有父级菜单只展开其中的一项，可用遍历菜单信息进行赋值
        rootSubmenuKeys: ['/infomationManage','/safeInfoManage','/qualityInfoManage'],
        // 展开的父菜单项
        openKeys: [], 
        // 选中的子菜单项
        defaultSelectedKeys: [this.$route.path], 
        // 菜单信息，可从后台获取
        menuList: [
        {
          key: '首页',
          title: '首页',
          path: '/home',
          icon:'home'
        },
        {
          key: '管理员信息',
          title: '管理员信息',
          icon:'user',
          path: '/user',
        },
        {
          key: '公司信息',
          title: '公司信息',
          icon:'cluster',
          path: '/company',
        },
        {
          key: '客户信息',
          title: '客户信息',
          icon:'team',
          path: '/customer',
        },
        {
          key: '产品信息',
          title: '产品信息',
          icon:'gold',
          path: '/product',
        },
        {
          key: '财务信息',
          title: '财务信息',
          icon:'account-book',
          children: [
            {
              key: '订单',
              title: '订单',
              path: '/financial/orderList',
              icon:'-',
            },
            {
              key: '规则',
              title: '规则',
              path: '/financial/rulesList',
              icon:'-',
            },
            {
              key: '发票',
              title: '发票',
              path: '/financial/invoiceList',
              icon:'-',
            },
          ],
        },
        {
          key: '国家信息',
          title: '国家信息',
          icon: 'state',
          path: '/country'
        },
        {
          key:'5',
          path: '/testPage',
          title:' 测试页面',
          icon:'api'
        }
        ],
        //当前路由路径
        currentPath:'',
        //
        sessionInfo: odooRpc.web.session.session_info || {},
        //modal
        ModalText: '是否要退出？',
        visible: false,
        confirmLoading: false,
      };
    },
    created(){
      // 将从缓存中取出openKeys
      const openKeys = window.sessionStorage.getItem('openKeys')
      if(openKeys){
        // 存在即赋值
        this.openKeys = JSON.parse(openKeys)
      }
    },
    mounted(){
      console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-',this);
      console.log('-=-=-=-=-=-=- current path -=-=-=-=-=-=-=-=-',this.$route.path);
    },
    watch:{
      '$route'(to, from){
        console.log('currentPath 检测到',to,from);
        this.currentPath = to.path;
        // localStorage.setItem('currentPath',to.path);
      }
    },
    methods: {
      // 点击菜单，路由跳转,注意的是当点击MenuItem才会触发此函数
      menuClick({ item, key, keyPath }) {
        console.log('------- menuClick1 -------',item);
        console.log('------- menuClick2 -------',key);
        console.log('------- menuClick3 -------',keyPath);
        // if (key) {
          
        // }
        localStorage.setItem("name","john");
        // 获取到当前的key,并且跳转[.catch()-->防止重复点击同一个menu报错]
        this.$router.push({
          path: key
        }).catch(err=>err);
      },
      onOpenChange(openKeys) {
        // 将当前打开的父级菜单存入缓存中
        window.sessionStorage.setItem('openKeys', JSON.stringify(openKeys))
        //  控制只打开一个
        const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.openKeys = openKeys;
        } else {
          this.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
      },
      //modal
      showModal() {
        this.visible = true;
      },
      handleOk() {
        // this.ModalText = 'The modal will be closed after two seconds';
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.confirmLoading = false;
          odooRpc.web.logout();
          this.$router.replace({ path: '/userLogin' });
        }, 1000);
      },
      handleCancel() {
        console.log('Clicked cancel button');
        this.visible = false;
      },
      
      //退出登录
      logOutAction(){
        console.log('======== 退出登录 =======');
        this.showModal();
        
      }
    },
  };
</script>

<style>
  #components-layout-demo-side .logo {
    height: 32px;
    line-height: 32px;
    font-weight: bolder;
    background: rgba(172, 166, 166, 0.2);
    margin: 16px;
    color: white;
  }
  .ant-dropdown-link {
    height: 40px;
    position:absolute;
    right: 10px;
    bottom: 10px;
    color: white;
  }
</style>
