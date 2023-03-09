const getters = {
  isCollapse: state => state.header.isCollapse,
  breadcrumb: state => state.menu.breadcrumb,
  menus: state => state.menu.menus,
  activeMenu: state => state.menu.activeMenu
}
export default getters
