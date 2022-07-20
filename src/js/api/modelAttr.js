import request from '@/js/request'

const BASE_URL = '/model/attrs'

export function getModelAttrs(modelId) {
  return request.get(BASE_URL + '?modelId=' + modelId)
}

/**
 * 获取模型表单配置详细信息
 *
 * @param modelId
 * @param attrId
 */
export function getModelAttr(modelId, attrId) {
  return request.get(BASE_URL + '/' + modelId + '/' + attrId)
}
