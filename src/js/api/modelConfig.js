import request from '@/js/request'

const BASE_URL = '/model/configs'

export function saveBaseInfo(baseConfig) {
  return request.post(BASE_URL, baseConfig)
}
