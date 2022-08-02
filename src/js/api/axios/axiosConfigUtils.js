/**
 * axios表单请求设置
 */
export const axiosCommonConfig = {
  transformRequest: [function(data) {
    let ret = ''
    for (const key in data) {
      ret += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
    }
    return ret
  }],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}
