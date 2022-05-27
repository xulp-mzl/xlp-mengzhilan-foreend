const util = {}

util.findDomClassName = function(dom) {
  let classNames = []
  if (dom){
    const attribute = dom.getAttribute('class')
    if (attribute) classNames = attribute.split(' ')
  }
  return classNames
}

/**
 * 递归查询树
 *
 * @param tree
 * @param targetValue
 * @param fieldName
 * @param findItem 用作递归查询字段
 * @returns {null|*}
 */
util.findFromTree = function(tree, targetValue, fieldName, findItem){
  if (findItem) return findItem
  if (tree && fieldName){
    tree.forEach((item) => {
      if (item[fieldName] === targetValue){
        findItem = item
      }
      // eslint-disable-next-line no-prototype-builtins
      if (!findItem && typeof item === 'object' && item.hasOwnProperty('children')){
        findItem = this.findFromTree(item.children, targetValue, fieldName, findItem)
      }
    })
    return findItem
  }
  return null
}

export default util
