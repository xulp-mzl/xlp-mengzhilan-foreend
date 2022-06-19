import request from '@/js/request'

const BASE_URL = '/models'

export function getModelData() {
  return request.get(BASE_URL)
}

export function hideModels(modelIds) {
  return request.put(BASE_URL, new URLSearchParams({modelIds}))
}
