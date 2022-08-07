import axios from 'axios'

// 调用 axios.create() 函数，创建一个 axios 的实例对象，用 request 来接收
const request = axios.create({
  // 指定请求的根路径
  baseURL: '/api'
})

// 定义拦截器
request.interceptors.request.use(config => {
  // 1.主要对config数据进行变换
  // 2.可以用来请求时，添加动画加载效果
  // 3.某些网络请求（比如登入Token）
  // 必须返回该参数
  return config
}, error => {
  console.log(error)
  return error
})

request.interceptors.response.use(result => {
  return result.data
}, error => {
  console.log(error.toJSON())
  const {message, name, status} = error.toJSON()
  return {errorMsg: message, name, status}
})

export default request
