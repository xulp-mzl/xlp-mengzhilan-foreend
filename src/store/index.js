import Vue from 'vue'
import Vuex from 'vuex'

import tabStore from '@/store/modules/tab'
import menuStore from '@/store/modules/menu'
import headerStore from '@/store/modules/header'
import getters from '@/store/getters'
import util from '@/js/util'
import { getBreadcrumb } from '@/js/breadcrumbUtils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    reloadCurrentPage: true,

    menus: [],
    activeMenu: '',
    // 头部菜单面包屑
    breadcrumb: [],

    // tabs
    tabList: [],
    currentTab: {}
  },
  mutations: {
    setReloadCurrentPage(state, reloadCurrentPage){
      state.reloadCurrentPage = reloadCurrentPage
    },

    setMenus(state, menus){
      state.menus = menus
    },
    setRoute(state, route){
      const { matched } = route
      const len = matched.length
      // 清空数组
      state.breadcrumb = []
      // 计算当前活动的菜单项
      for (let i = len - 1; i >= 0; i--){
        const { path } = matched[i]
        const item = util.findFromTree(state.menus, path, 'path')
        if (item){
          state.activeMenu = path
          // 计算头部面包屑
          state.breadcrumb = getBreadcrumb(item, state.menus)

          // tabs
          state.currentTab = item
          const index = state.tabList.findIndex(item => item.path === path)
          if (index < 0){
            state.tabList.push(item)
          }
          break
        }
      }
    },
    // 移除tab
    removeTabInStore(state, tabName){
      const index = state.tabList.findIndex(item => item.path === tabName)
      if (index >= 0){
        state.tabList.splice(index, 1)
        const len = state.tabList.length
        if (len > 0){
          if (tabName === state.currentTab.path){
            state.currentTab = state.tabList[index === len ? index - 1 : index]
          }
        } else {
          state.currentTab = {}
        }
      }
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
