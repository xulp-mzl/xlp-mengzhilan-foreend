import request from '@/js/request'

const BASE_URL = '/model/configs'

/**
 * 保存基本配置信息
 *
 * @param baseConfig
 * @returns {Promise<AxiosResponse<T>>}
 */
export function saveBaseInfo(baseConfig) {
  return request.post(BASE_URL, baseConfig)
}

/**
 * 根据模型id获取基本配置信息
 *
 * @param modelId
 * @returns {Promise<AxiosResponse<T>>}
 */
export function getBaseConfigInfo(modelId) {
  return request.get(BASE_URL + '?modelId=' + modelId)
}
