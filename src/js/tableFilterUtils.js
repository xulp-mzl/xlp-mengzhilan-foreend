import dayjs from 'dayjs'

/**
 * 过滤普通数据
 * @param filterData
 * @param filterFieldInfo
 * @returns {[]|*}
 */
export function filterTableData(filterData, filterFieldInfo){
  if (!filterData || !filterFieldInfo) return filterData
  if (typeof filterFieldInfo === 'object'){
    const newFilterData = []
    // 循环过滤数据
    filterData.forEach((item) => {
      let success = true
      for (const key in item){
        success = findDataSuccess(item, filterFieldInfo, key)
        if (!success) break
      }
      if (success){
        newFilterData.push(item)
      }
    })
    return newFilterData
  }
  return filterData
}

/**
 * 过滤树结构数据
 *
 * @param filterData
 * @param filterFieldInfo
 * @returns {[]|*}
 */
export function filterTableTreeData(filterData, filterFieldInfo){
  if (!filterData || !filterFieldInfo) return filterData
  if (typeof filterFieldInfo === 'object'){
    const newFilterData = []
    // 循环过滤数据
    filterData.forEach((item) => {
      let success = true
      for (const key in item){
        success = findDataSuccess(item, filterFieldInfo, key)
        if (!success) break
      }
      if (success){
        newFilterData.push(item)
      }
    })
    return newFilterData
  }
  return filterData
}

function findDataSuccess(filterData, filterFieldInfo, key){
  const filterFieldType = filterFieldInfo[key + '_type']
  if (filterFieldType === 'datetime' ||
      filterFieldType === 'date' ||
      filterFieldType === 'time'){
    const itemValue = filterData[key]

    let startDate = filterFieldInfo[key + '_start']
    let endDate = filterFieldInfo[key + '_end']
    let suitValue = false
    if (filterFieldType === 'datetime'){
      if (isInstance(startDate, '[object Date]')){
        startDate = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss')
      }
      if (isInstance(endDate, '[object Date]')){
        endDate = dayjs(endDate).format('YYYY-MM-DD HH:mm:ss')
      }
    } else if (filterFieldType === 'date'){
      if (isInstance(startDate, '[object Date]')){
        startDate = dayjs(startDate).format('YYYY-MM-DD')
      }
      if (isInstance(endDate, '[object Date]')){
        endDate = dayjs(endDate).format('YYYY-MM-DD')
      }
    } else if (filterFieldType === 'time'){
      if (isInstance(startDate, '[object Date]')){
        startDate = dayjs(startDate).format('HH:mm:ss')
      }
      if (isInstance(endDate, '[object Date]')){
        endDate = dayjs(endDate).format('HH:mm:ss')
      }
    }
    if (!startDate || (itemValue && startDate <= itemValue)){
      suitValue = true
    } else {
      suitValue = false
    }
    if (suitValue && (!endDate || (itemValue && endDate >= itemValue))){
      suitValue = true
    } else {
      suitValue = false
    }
    return suitValue
  } else {
    const condition = filterFieldInfo[key]
    // 判断是否有条件，没有直接返回true
    if (condition === undefined || condition === null || condition === ''){
      return true
    }
    const itemValue = filterData[key]
    if (filterFieldType === 'multSelect'){
      if (isInstance(condition, '[object Array]')){
        return condition.length === 0 || condition.some(item => item == itemValue)
      } else {
        return condition == itemValue
      }
    } else if (filterFieldType === 'select'){
      return condition == itemValue
    } else {
      const optionType = filterFieldInfo[key + '_option'] ||
          (isInstance(itemValue, '[object Number]') ? '=' : 'like')
      switch (optionType){
        case '=':
          return condition == itemValue
        case '<=':
          return condition <= itemValue
        case '>=':
          return condition >= itemValue
        case '!=':
          return condition != itemValue
        case '>':
          return condition > itemValue
        case '<':
          return condition < itemValue
        case 'like':
          return itemValue !== undefined && itemValue !== null &&
                 itemValue.toString().indexOf(condition) >= 0
        default:
          break
      }
    }
    return false
  }
}

function isInstance(obj, objType) {
  return Object.prototype.toString.call(obj) === objType
}
