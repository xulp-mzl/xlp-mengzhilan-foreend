import request from '@/js/request'

const BASE_URL = '/models'

export function getModelData() {
  return request.get(BASE_URL)
}
