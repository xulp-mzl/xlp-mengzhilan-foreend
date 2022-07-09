<template>
  <common-dialog dialog-title="模型字段信息" :visible.sync="visible"
                 :before-close="handleBeforeClose" >

  </common-dialog>
</template>

<script>

import FormMixins from '@/components/mixins/form/FormMixins'
import CommonDialog from '@/components/common/CommonDialog'

export default {
  name: 'ModelFieldConfig',
  mixins: [FormMixins],
  components: {
    CommonDialog
  },
  data(){
    return {

    }
  }
}
</script>

<style scoped>

</style>
