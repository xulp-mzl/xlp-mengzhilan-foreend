import request from '@/js/request'

const BASE_URL = '/menus'

export function getMenuItemData(){
  return request.get(BASE_URL)
}

export function deleteMenuItem(id) {
  return request.delete(BASE_URL + '/' + id)
}

export function saveMenuItemData(itemInfo, type) {
  type = !type ? 'post' : type
  if (type.toLowerCase() === 'post'){
    return request.post(BASE_URL, itemInfo)
  } else {
    return request.put(BASE_URL, itemInfo)
  }
}
