/**
 * 验证是否登录的中间件
 * */ 

export default function ({ store, redirect}) {
  // if the user is not authenticated
  if (!store.state.user) {
    return redirect('/login')
  }
}