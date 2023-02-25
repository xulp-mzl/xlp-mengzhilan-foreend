const tabStore = {
  state: {
    isCollapse: false // 控制菜单收起还是折叠

  },
  mutations: {
    setCollapse(state){
      state.isCollapse = !state.isCollapse
    }
  },
  actions: {

  },
  getters: {

  }
}

export default tabStore
