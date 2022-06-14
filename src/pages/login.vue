<!--
 * @Author: Nxf
 * @Date: 2022-04-05 22:03:13
 * @LastEditors: Nn
 * @LastEditTime: 2022-06-14 17:31:00
 * @Descripttion: 登录页面
-->

<template>
  <div>
    <a-layout style="height: 100vh">
      <a-layout-header style="height:10vh; font-size:30px; font-weight:bolder ">
        <div class="layout-logo">
          <img height="50px" width="50px" src="../assets/logo.png"/>
        </div>
        <div
          style="height:69px; font-size:30px; lineHeight:69px; color:white;"
        >
            {{ appName }}
        </div>
      </a-layout-header>
      <a-layout-content style="height:85vh">
        <div :style="{ background: '#fff'}">
          <div style="float: right; margin: 100px 150px 0">
            <a-card :title="loginTitle">
              <a-form
                :form="loginForm"
                @submit="handleSubmit"
                style="width:300px"
              >
                <a-form-item>
                  <a-input
                    v-decorator="[
                        'loginAccount',
                        {
                         rules: [
                           { required: true, message: '请输入账号!', whitespace: true}
                         ]
                        }
                    ]"
                    placeholder="请输入账号"
                  >
                    <a-icon
                      slot="prefix"
                      type="user"
                      style="color: rgba(0,0,0,.25)"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-input
                    v-decorator="[
                       'loginPassword',
                         { rules: [{ required: true, message: '请输入密码！' }] }
                    ]"
                    type="password"
                    placeholder="请输入密码"
                  >
                    <a-icon
                      slot="prefix"
                      type="lock"
                      style="color: rgba(0,0,0,.25)"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-button
                    type="primary"
                    html-type="submit"
                    class="login-form-button"
                    
                  >
                    登 录
                  </a-button>
                </a-form-item>
              </a-form>
            </a-card>
          </div>
        </div>
      </a-layout-content>
      <a-layout-footer style="height:5vh; line-height:5vh; padding:0px; text-align: center; font-size: 10px; font-weight: bolder; backgroundColor:lightGray">
        {{ appCompany }}
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script>
  import Vue from "vue";
  import { Layout, Icon, Menu, Input, Form, Card} from "ant-design-vue";
  import 'ant-design-vue/dist/antd.css';
  import odooRpc from '@/odoorpc';
  
  Vue.use(Layout).use(Form).use(Icon).use(Menu).use(Input).use(Card);
  // import {mapActions} from 'vuex';

  export default {
    name: 'LoginCpnt',
    data(){
      return{
         appCompany:process.env.VUE_APP_COMPANY,
         appName:process.env.VUE_APP_NAME,
         loginTitle:process.env.VUE_APP_LOGIN_TITLE,
         
      }
    },
    beforeCreate() {
      this.loginForm = this.$form.createForm(this);
    },
    mounted(){
      console.log('------ process.env -------',process.env);
    },
    methods: {
      // ...mapActions(['handleLogin','getUserInfo']),
      check(rule, value, callback) {
        console.log(rule + '----' + value)
        callback()
        // callback('Two passwords that you enter is inconsistent!')
      },
      handleSubmit(e) {
        e.preventDefault()
        this.loginForm.validateFields( async(err, values) => {
        
        console.log('------ login ------',values);
        const{loginAccount, loginPassword} = values;
        const db = process.env.VUE_APP_ODOO_DB;
        
        
        const res = await odooRpc.web.session.authenticate({
          db,
          login: loginAccount,
          password: loginPassword
        })

        console.log('======= login =======', res);
        // return res;
        if (res.uid) {
          // localStorage.setItem('userName',res.name);
          const session = odooRpc.env;
          console.log('==== session ====',session);
          this.$router.push({
            name: 'home'
          })
        }
        
        //   this.$router.push({
        //     name: 'adminCenter'
        //   })

          // if (!err) {
          //   this.handleLogin({
          //     loginAccount: this.loginForm.getFieldValue('loginAccount'),
          //     loginPassword: this.$encruption(this.loginForm.getFieldValue('loginPassword'))
          //   }).then(res => {
          //     if (this.token != '' && res.code == 200) {
          //       this.getUserInfo().then(res => {
          //         if (res.code = 200) {
          //           this.$router.push({
          //             name: 'adminCenter'
          //           })
          //         }
          //       })
          //     } else {
          //       this.$message.error('账号密码错误！');
          //     }
          //   })
          // }
        })
      }
    },
    computed: {
      msg() {
        return this.$store.getters.msg;
      },
      token() {
        return this.$store.getters.token;
      },
    },
    
  }
</script>
<style scoped>
  .layout-logo {
    width: 100px;
    height: 30px;
    border-radius: 10px;
    float: left;
    position: relative;
    left: 20px;
  }
</style>
