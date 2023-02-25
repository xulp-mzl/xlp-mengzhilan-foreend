import Vue from 'vue'
import Vuex from 'vuex'

import tabStore from '@/store/tab'
import menuStore from '@/store/menu'

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
    tab: tabStore,
    menu: menuStore
  }
})
