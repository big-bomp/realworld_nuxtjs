# nuxt 官网 https://nuxtjs.org/

## 路由使用方式
+ 第一种  
  + 通过在pages里面 按照路由规则 不需要自己配置 
+ 第二种
  + 通过 nuxt.config.js配置  
  ```js
  /**
   * Nuxt.js 配置文件
  * */

  module.exports = {
    router: {
      linkActiveClass: 'active',
      // 自定义路由表规则
      extendRoutes(routes, resolve) {
        // 清除Nuxt.js 基于pages 目录 
        // 默认生成的路由表规则
        routes.splice(0)

        routes.push(...[
          {
            path: '/',
            component: resolve(__dirname, 'pages/layout/'),
            children: [
              {
                path: '', //默认子路由
                name: 'home',
                component: resolve(__dirname, 'pages/home/')
              },
              {
                path: '/login',
                name: 'login',
                component: resolve(__dirname, 'pages/login/')
              },
              {
                path: '/register',
                name: 'login',
                component: resolve(__dirname, 'pages/login/')
              },
              {
                path: '/profile/:username',
                name: 'profile',
                component: resolve(__dirname, 'pages/profile')
              },
              {
                path: '/settings',
                name: 'settings',
                component: resolve(__dirname, 'pages/settings')

              },
              {
                path: '/editor',
                name: 'editor',
                component: resolve(__dirname, 'pages/editor/')
              },
              {
                path: '/article/:slug',
                name: 'article',
                component: resolve(__dirname, 'pages/article')
              }
            ]
          }
        ])
      }
    }
  }
  ```
##### 路由跳转方式
通过`<nuxt-link></nuxt-link>`进行导航跳转  类似 vue 的 `<router-link></router-link>`

##### 选中之后的样式
+ 默认选中路由之后  会加上一个 nuxt-link-active  的类名
+ 可以在 **nuxt.config.js** 中 通过 **linkActiveClass: 'active'**,来进行修改
+ 加上exact 可以进行精确匹配样式 


##### 表单
+ required 触发表单验证
+ type= email 验证邮箱

##### store
+ nuxtServerInit()  
  这是在sotre 里面调用 初始化容器 以及 需要传递给 客户端的数据
  这个特殊的action 只会在服务端渲染的期间运行

+ cookieparser
  解析cookie ，字符串转为对象形式 

##### middleware 中间件
+ 路由中间件
作用：
  在请求之前进行拦截 可以拦截客户端 也可以拦截服务端
  ```js
  //*    middleware/authenticated.js
  /**
   * 验证是否登录的中间件
   * */ 

  export default function ({ store, redirect}) {
    // if the user is not authenticated
    if (!store.state.user) {
      return redirect('/login')
    }
  }
  ```
  **然后再需要使用的页面**
  ```js
    export default {
    // 在路由匹配组件渲染之前会执行中间件处理
    middleware: 'authenticated',  //后面你是取得文件名
    name: 'EditorIndex'
    }
  ```

##### watchQuery

监听参数字符串更改并在更改时执行 组件方法 （asyncData,fetch, validate, layout,...)
在分页的时候 会使用到  默认是关闭的  
```js
watchQuery:['page']
```

##### 插件
需要在 nuxt.config.js 的文件夹里配置
通过插件机制获取到上下文对象{query, params,req, res, app, store...}
插件导出函数 必须作为 default 对象
```js
  module.exports={
    // 注册插件
  plugins: [
    '~/plugins/request.js'
  ]
  }
```

##### markdown-it
转换markdown 格式

##### 发布部署
```js
//package.json 文件
'scripts': {
  "dev": "nuxt",
  "build": "nuxt build",
  "start": "nuxt start"
}
```

+ 配置 Host + Port
+ 压缩发布包
+ 把发布包传到服务端
+ 解压
+ 安装依赖
+ 启动服务

```js
// nuxt.config.js 文件
 server: {
    host: '0.0.0.0',
    port: 3000
  },
```
##### 方式1 直接启动node
+ 需要部署的文件有 .nuxt, static, nuxt.config.js, package.json, package-lock.json

+ ssh root@120.24.39.185    //连接远程服务器
+ mkdir realworld_nuxtjs    //创建文件
+ cd realworld_nuxtjs
+ exit
+ scp 本地文件 root@120.24.39.185:加上远程文件的路径  //将本地路径上传到服务器
+ ssh root@120.24.39.185    //连接远程服务器
+ unpzip 文件名  //如果是zip就先解压
+ npm i 
+ npm run start


##### 方式2 pm2启动node
+ npm install --global pm2  //在服务端下载
+ pm2 start npm -- start  //通过pm2启动项目
+ 关闭的几种方式
  1. pm2 stop 0   //0是id名
  2. 


pm2 常用命令
命令              说明
1. pm2 list     查看应用列表
2. pm2 start    启动应用
3. pm2 stop     停止启用
4. pm2 reload   重载应用
5. pm2 restart  重启应用
6. pm2 delete   删除应用

