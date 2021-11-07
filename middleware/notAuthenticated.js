export default function ({ store, redirect}) {
  // if the user is authenticated redirect to home page
  if (store.state.user) {
    return redirect('/')
  }
}