import Vue from 'vue'

/**
 * 消息提示框
 *
 * @param msg
 * @param type 消息类型【success / info / warning / error】，值不给时，默认时info
 */
Vue.prototype.$msgAlert = function(msg, type) {
  this.$alert(msg, '消息提示', {
    type: type || 'info'
  })
}

/**
 * 判断给定的对象是否是指定类型的实例
 *
 * @param obj []
 * @param objType 例如'[object Array]'
 */
Vue.prototype.$isInstance = function(obj, objType) {
  return Object.prototype.toString.call(obj) === objType
}

/**
 * 消息提示
 *
 * @param msg
 * @param tipType
 */
Vue.prototype.$tips = function(msg, tipType) {
  this.$message({
    message: msg,
    type: tipType || 'success'
  })
}

/**
 * 确认框
 *
 * @param msg 提示信息
 * @param confirmCallbackFun 点确定按钮回调函数
 * @param cancelCallbackFun 点取消按钮回调函数
 */
Vue.prototype.$myConfirm = function(msg, confirmCallbackFun, cancelCallbackFun) {
  this.$confirm(msg || '', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (typeof confirmCallbackFun === 'function'){
      confirmCallbackFun()
    }
  }).catch(() => {
    if (typeof cancelCallbackFun === 'function'){
      cancelCallbackFun()
    }
  })
}

/**
 * loading框
 *
 * @param msg 加载中提示类容 获取$loading的配置对象
 */
Vue.prototype.$appLoading = function(msg) {
  if (this.$isInstance(msg, '[object Object]')){
    return this.$loading(msg)
  } else {
    msg = msg || '数据处理中。。。'
    return this.$loading({
      lock: true,
      text: msg,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
}
