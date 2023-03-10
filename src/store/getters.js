const getters = {
  isCollapse: state => state.header.isCollapse,
  breadcrumb: state => state.breadcrumb,
  menus: state => state.menus,
  activeMenu: state => state.activeMenu,
  tabList: state => state.tabList,
  currentTab: state => state.currentTab
}
export default getters
