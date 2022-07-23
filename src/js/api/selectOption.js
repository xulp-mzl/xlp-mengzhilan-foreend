import request from '@/js/request'

const BASE_URL = '/select/options'

/**
 * 获取表单条目输入类容下拉框选择内容
 */
export function getFormInputType() {
  return request.get(BASE_URL + '/formInputType')
}
