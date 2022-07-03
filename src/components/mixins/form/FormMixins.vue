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
     */
    closeDialog(){
      this.$emit('removed', !this.visible, true)
    },
    /**
     * 重置表单
     * @param elForm
     */
    resetForm(elForm){
      if (elForm) {
        elForm.resetFields()
      }
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
