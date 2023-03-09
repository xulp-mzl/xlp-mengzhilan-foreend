import util from '@/js/util'

export const getBreadcrumb = function(childMenuItem, items) {
  const breadcrumbs = []
  let menuItem = childMenuItem
  while (menuItem){
    breadcrumbs.push(menuItem.title)
    if (menuItem.parentId){
      menuItem = util.findFromTree(items, menuItem.parentId, 'id')
    } else {
      menuItem = null
    }
  }
  return breadcrumbs.reverse()
}
