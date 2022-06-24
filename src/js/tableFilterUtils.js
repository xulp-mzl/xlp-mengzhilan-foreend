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
    const array = []
    for (let i = 0; i < filterData.length; i++) {
      let match = true
      for (const key in filterData[i]){
        match = findDataSuccess(filterData[i], filterFieldInfo, key)
        if (!match) break
      }
      if (filterTableTreeData(filterData[i].children, filterFieldInfo).length > 0 || match) {
        array.push({
          ...filterData[i],
          children: filterTableTreeData(filterData[i].children, filterFieldInfo)
        })
      }
    }
    return array
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

export function hasFilterCondition(filterData, filterFieldInfo){
  let hasCondition = false
  if (filterData && filterData.length > 0){
    const item = filterData[0]
    for (const key in item){
      const value = filterFieldInfo[key + '_start'] ||
        filterFieldInfo[key + '_end'] || filterFieldInfo[key]
      hasCondition = value !== undefined && value !== null && value !== ''
      if (hasCondition && isInstance(value, '[object Array]') && value.length === 0){
        hasCondition = false
      }
      // 假如有条件直接返回true
      if (hasCondition) break
    }
  }
  return hasCondition
}

export function getFieldFilterInfo(filterInfo){
  const newFilterData = {}
  if (filterInfo){
    for (const key in filterInfo){
      if (filterInfo[key].propType === 'datetime' ||
        filterInfo[key].propType === 'date' ||
        filterInfo[key].propType === 'time'){
        newFilterData[key + '_start'] = isInstance(filterInfo[key].defaultValue, '[object Date]')
          ? filterInfo[key].defaultValue : undefined
        newFilterData[key + '_end'] = undefined
      } else if (filterInfo[key].propType === 'multSelect'){
        newFilterData[key] = isInstance(filterInfo[key].defaultValue, '[object Array]')
          ? filterInfo[key].defaultValue : undefined
      } else {
        newFilterData[key] = filterInfo[key].defaultValue === undefined
          ? '' : filterInfo[key].defaultValue
        newFilterData[key + '_option'] = filterInfo[key].optionType
      }
      newFilterData[key + '_type'] = filterInfo[key].propType
    }
    return newFilterData
  }
}
