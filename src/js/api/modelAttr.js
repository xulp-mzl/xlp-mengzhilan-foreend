import request from '@/js/request'
import {axiosCommonConfig} from '@/js/api/axios/axiosConfigUtils'

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

/**
 * 保存信息
 * @param attribute
 */
export function saveAttribute(attribute) {
  return request.post(BASE_URL, attribute)
}

/**
 * 批量设置模型属性配置
 * @param modelId
 * @param attrIds
 */
export function batchSetting(modelId, attrIds) {
  return request.post(BASE_URL + '/batchSetting',
    {
      modelId,
      attrIds
    },
    axiosCommonConfig
  )
}

/**
 * 添加扩展属性
 * @param attribute
 */
export function addExtendAttribute(attribute) {
  return request.post(BASE_URL + '/addExtendAttribute', attribute)
}

/**
 * 删除模型属性
 * @param modelId
 * @param attrIds
 * @returns {Promise<AxiosResponse<T>>}
 */
export function deleteAttrs(modelId, attrIds) {
  return request.delete(BASE_URL + '?modelId=' + modelId + '&attrIds=' + attrIds)
}
