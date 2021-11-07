// 只有
const cookieparser = process.server ? require('cookieparser') : undefined


//* 在服务器渲染期间 运行都是一个实例
//* 为了防止数据冲突， 务必要把state设置为一个函数，返回一个数据对象
export const state = () => {
  return {
    // * 当前用户登录的状态
    user: null
  }
}

export const mutations =  {
  setUser(state, data){
    state.user = data
  }
}

export const actions =  {
  // * nuxtServerInit 是一个特殊的 action 方法
  // * 这个 action 会在服务端渲染期间自动调用
  // * 作用：初始化容器数据，传递数据给客户端使用

  nuxtServerInit({ commit }, { req }) {
    let user = null

    // * 如果请求头中有 cookie
    if(req.headers.cookie){
      //* 使用 cookieparser 把 cookie 字符串转为 JavaScript 对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }

    //* 提交mutation 修改 state 状态
    commit('setUser', user)
  }
  
};