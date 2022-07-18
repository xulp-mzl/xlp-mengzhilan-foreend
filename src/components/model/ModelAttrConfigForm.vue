<template>
  <common-dialog  :visible.sync="visible" width="60%" append-to-body
                 :before-close="handleBeforeClose" :class="[loading ? 'overflow-hidden' : '', 'base-config-dialog']">
    <template #title>
      <div>
        <span style="color: #43b8c2">【{{modelId}} —— {{attrId}}】</span>
        <span>模型字段信息</span>
      </div>
    </template>
  </common-dialog>
</template>

<script>

import FormMixins from '@/components/mixins/form/FormMixins'
import CommonDialog from '@/components/common/CommonDialog'

export default {
  name: 'ModelAttrConfigForm',
  mixins: [FormMixins],
  components: {
    CommonDialog
  },
  props: {
    /**
     * 模型id
     */
    modelId: {
      default: '',
      type: String
    },
    /**
     * 属性id
     */
    attrId: {
      default: '',
      type: String
    }
  },
  data(){
    return {
      loading: true
    }
  },
  methods: {

  },
  mounted(){
  }
}
</script>

<style>
  .el-dialog__body{
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
