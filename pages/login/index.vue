<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">
            {{ isLogin ? 'Sign in' : 'Sign up'}}
          </h1>
          <p class="text-xs-center">
            <a href="">Have an account?</a>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, filed) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{filed}} {{message}}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSbumit">
            <fieldset class="form-group" v-if="!isLogin">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="user.username"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                v-model= "user.email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="user.password"
                required
                minlength="8"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sign in' : 'Sign up'}}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {login, register} from '@/api/user';

const Cookie = process.client ? require('js-cookie') : undefined
export default {
  middleware: 'notAuthenticated',
  name: "LoginIndex",
  computed:{
    isLogin(){
      return this.$route.name === 'login'
    }
  },
  data(){
    return {
      user: {
        username: '',
        email: '123@abc.com',
        password: '12345678'
      },
      errors: {},  //错误信息
    }
  },
  methods:{
    // 表达提交
    async onSbumit(){
      try {
        const { data } = this.isLogin
        ? await login({
            user: this.user
          })
        : await register({
          user: this.user
        })
       
        // //* 保存登录状态
        this.$store.commit('setUser', data.user) 

        //  //* 数据本地存储 持久化
        Cookie.set('user', data.user)

        // 跳转到首页
        this.$router.push('/')
      } catch (error) {
        //  console.log("请求失败",error )
         this.errors = error.response.data.errors
      }
     
    }
  }
};
</script>

<style></style>
