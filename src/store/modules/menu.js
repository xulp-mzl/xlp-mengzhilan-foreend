import util from '@/js/util'
import { getBreadcrumb } from '@/js/breadcrumbUtils'

const menuStore = {
  state: {
    currentMenu: {},
    menus: [],
    activeMenu: '',
    // 头部菜单面包屑
    breadcrumb: []
  },
  mutations: {
    setCurrentMenu(state, currentMenu){
      state.currentMenu = currentMenu
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
          // 当前活动的菜单项
          state.currentMenu = item
          break
        }
      }
    }
  },
  actions: {

  },
  getters: {

  }
}

export default menuStore
