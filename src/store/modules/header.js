const headerStore = {
  state: {
    isCollapse: false // 控制菜单收起还是折叠
  },
  mutations: {
    toggleSide(state){
      state.isCollapse = !state.isCollapse
    }
  },
  actions: {

  }
}

export default headerStore
