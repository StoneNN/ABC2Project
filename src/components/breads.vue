<!--
 * @Author: Nn
 * @Date: 2022-04-13 11:50:28
 * @LastEditors: Nn
 * @LastEditTime: 2022-06-10 17:49:35
 * @Description: breadCrumb
-->


<template>
  <div class="mianBaoXie">

    <a-breadcrumb separator="/">
      <a-breadcrumb-item
        v-for="(item, index) of breadLists"
        :key="index"
        style="padding: 0px"
      >
        <router-link :to="item" style="font-size: 12px;">{{
          breadCrumbNameMap[item]
        }}</router-link>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
  import Vue from "vue";
  import { Breadcrumb } from "ant-design-vue";
  import 'ant-design-vue/dist/antd.css';
  
  Vue.use(Breadcrumb);
  
  export default {
    name:"BreadCrumbCpnt",
    props:{
      currentPath:String,
    },
    data(){
      return{
        breadLists:[],
        breadCrumbNameMap:{

          '/home':'首页',

          '/financial':'财务信息',
          '/financial/orderList':'订单列表',
          '/financial/orderList/orderDetail':'订单详情',
          '/financial/rulesList':'规则列表',
          '/financial/rulesList/rulesDetail':'规则详情',
          '/financial/invoiceList':'发票列表',
          '/financial/invoiceList/invoiceDetail':'发票详情',
      
          '/user':'管理员信息',
          '/user/userList':'管理员列表',
          '/user/userList/userInfo':'管理员详情',
          '/user/userList/userEdit':'管理员编辑',
          '/user/userList/userCreate':'管理员新建',
           
          '/company':'公司信息',
          '/company/companyList':'公司列表',
          '/company/companyList/companyInfo':'公司详情',
          '/company/companyList/companyEdit':'公司编辑',
          '/company/companyList/companyCreate':'公司新建',

          '/customer':'客户信息',
          '/customer/customerList':'客户列表',
          '/customer/customerList/customerInfo':'客户详情',
          '/customer/customerList/customerEdit':'客户编辑',
          '/customer/customerList/customerCrate':'客户新建',

          '/product':'产品信息',
          '/product/productList':'产品列表',
          '/product/productList/productInfo':'产品详情',
          '/product/productList/productEdit':'产品编辑',
          '/product/productList/productCreate':'新建产品',

          '/country':'国家信息',
          '/country/countryList':'国家列表',
          '/country/countryList/countryInfo':'国家详情',
          '/country/countryList/countryEdit':'国家编辑'
        }
      }
    },
    watch: {
      $route: "init",
    },
    mounted() {
      console.log('-----this 1----',this);
      console.log('-----this.$route.path----',this.$route.path);
      this.getCurrentPath();
    },
    methods: {
       getCurrentPath () {

        const localPath = localStorage.getItem('currentPath');
        const pathSnippets = localPath.split("/").filter(i => i);
        console.log("-----pathSnippets----", pathSnippets);

        var breads = pathSnippets.map((_, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
          console.log("-----url----", url);
          return (
            url
          );
        });
        console.log('----breads--',breads);
      
        this.breadLists = breads;
        console.log('====== route breadLists ======',this.breadLists);
      },
      init(to, from) {
        console.log('====== route ======',this.$route);
        console.log('====== route to ======',to.path, from.path);
        //、、、
        localStorage.setItem('currentPath',to.path);
        localStorage.getItem('currentPath');

        const pathSnippets = to.path.split("/").filter(i => i);
        console.log("-----pathSnippets----", pathSnippets);

        var breads = pathSnippets.map((_, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
          console.log("-----url----", url);
          return (
            url
          );
        });
        console.log('----breads--',breads);
        // 、、、
        // if (matched.length && matched[0].name !== "home") {
        //   matched = [
        //     { 
        //       path:'/home',
        //       name:'home',
        //       meta:{title:'首页'}
        //     },
        //     ...matched
        //   ];
        // }
        this.breadLists = breads;
        console.log('====== route breadLists ======',this.breadLists);
      },
    },
  };
</script>

<style scoped>
  .mianBaoXie {
    background-color: white;
    width: 100%;
    padding: 5px 0px;
    margin-bottom: 10px;
    margin-top: 5px;
    border: 1px solid #dddddd;
    padding-left: 10px;
    border-radius: 10px;
    text-align: left;
    height: 33px;
    /* position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0; */
  }
</style>