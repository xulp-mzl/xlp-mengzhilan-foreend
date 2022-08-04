<template>
  <div></div>
</template>

<script>
export default {
  name: 'FormMixins',
  props: {
    /**
     * form公用dialog是否显示
     */
    visible: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    /**
     * 验证表单信息是否填全
     *
     * @param form
     * @returns {boolean}
     */
    validateForm(form){
      let success = form !== null && form !== undefined
      // eslint-disable-next-line no-unused-expressions
      this.$refs.form?.validate((valid) => {
        if (!valid) {
          success = false
          return false
        }
      })
      return success
    },
    /**
     * 关闭表单
     * @param isRefreshed 关闭表单时，是否刷新数据，true：刷新，false:不刷新
     */
    closeDialog(isRefreshed){
      this.$emit('removed', !this.visible, true)
      // 发送关闭表单的事件
      this.$emit('reload-parent-table', isRefreshed)
    },
    /**
     * 重置表单
     * @param elForm
     */
    resetForm(elForm){
      if (elForm) {
        elForm.resetFields()
      }
    },
    /**
     * 点击关闭按钮，执行的函数
     */
    handleBeforeClose(){
      this.closeDialog()
    }
  }
}
</script>

<style lang="less">
  .el-dialog__body{
    .el-form{
      .custom-input{
        .el-input__inner{
          width: 60%;
         }
      }
      .el-select--medium{
        width: 60%;
      }
      .el-input-group--append{
        width: 60%;
      }
    }
  }
</style>
