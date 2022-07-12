import request from '@/js/request'

const BASE_URL = '/model/attrs'

export function getModelAttrs(modelId) {
  return request.get(BASE_URL + '?modelId=' + modelId)
}
