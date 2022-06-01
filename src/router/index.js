import Vue from 'vue'
import VueRouter from 'vue-router'

import CommonTableInfo from '@/views/CommonTableInfo'
import MenuTableData from '@/views/menu/MenuTableData'

// fix vue-router NavigationDuplicated
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return VueRouterPush.call(this, location).catch(err => err)
}
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return VueRouterReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {path: '/menu/setting', component: MenuTableData},
  {path: '/tableInfo2', component: CommonTableInfo},
  {path: '/tableInfo3', component: CommonTableInfo},
  {path: '/tableInfo4', component: CommonTableInfo}
]

const router = new VueRouter({
  routes
})

export default router
