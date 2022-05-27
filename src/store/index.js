import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuItemInfo: {
    },
    currentSelectedTabName: '',
    reloadCurrentPage: true
  },
  mutations: {
    setMenuItemInfo(state, menuItemInfo){
      state.menuItemInfo = menuItemInfo
    },
    setCurrentSelectedTabName(state, currentSelectedTabName){
      state.currentSelectedTabName = currentSelectedTabName
    },
    setReloadCurrentPage(state, reloadCurrentPage){
      state.reloadCurrentPage = reloadCurrentPage
    }
  },
  actions: {
  },
  modules: {
  }
})
