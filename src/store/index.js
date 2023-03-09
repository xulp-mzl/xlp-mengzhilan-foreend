import Vue from 'vue'
import Vuex from 'vuex'

import tabStore from '@/store/modules/tab'
import menuStore from '@/store/modules/menu'
import headerStore from '@/store/modules/header'
import getters from '@/store/getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuItemInfo: {
    },
    currentSelectedTabName: '',
    reloadCurrentPage: true
  },
  mutations: {
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
    menu: menuStore,
    header: headerStore
  },
  getters
})
