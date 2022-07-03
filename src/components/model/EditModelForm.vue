<template>
  <common-dialog title="编辑模型信息" :visible.sync="visible"
                 :before-close="handleBeforeClose">

    <template #body>
      <el-form :model="modelInfo" label-width="100px" ref="form" size="medium">
        <el-form-item label="模型名称："
                      prop="beanName"
                      :rules="[
                { required: true, message: '模型名称不能为空'},
              ]"
        >
          <el-input v-model.trim="modelInfo.beanName" autocomplete="off" placeholder="请输入模型名称" class="custom-input"></el-input>
        </el-form-item>

        <el-form-item
            label="排序号："
            prop="orderNo"
            :rules="[{ type: 'number', message: '排序号必须为数字值'}]"
        >
          <el-input v-model.number="modelInfo.orderNo" autocomplete="off" class="custom-input" ></el-input>
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <div class="dialog-footer" style="padding-right: 20%;">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="save" :disabled="disabled">保存</el-button>
        <el-button type="info" @click="resetForm($refs.form)">重置</el-button>
      </div>
    </template>
  </common-dialog>
</template>

<script>

import CommonDialog from '@/components/common/CommonDialog'
import FormMixins from '@/components/mixins/form/FormMixins'
import {saveModel} from '@/js/api/model'

export default {
  name: 'EditModelForm',
  components: {
    CommonDialog
  },
  mixins: [FormMixins],
  props: {
    modelInfo: {
      default: () => {
        return {
          beanId: null,
          beanName: '',
          orderNo: 0
        }
      },
      type: Object
    }
  },
  data(){
    return {
      disabled: false
    }
  },
  methods: {
    save(){
      const canSave = this.validateForm(this.$refs.form)
      if (canSave){
        this._save()
      } else {
        this.$msgAlert('请按要求填好表格数据后，再提交！', 'error')
      }
    },
    async _save(){
      this.disabled = true
      const response = await saveModel(this.modelInfo)
      if (response.errorMsg){
        this.$msgAlert(response.errorMsg, 'error')
      } else {
        // 刷新表格数据
        this.$emit('reload-parent-table', true)
        this.closeDialog()
        this.$tips('数据修改成功！')
      }
      this.disabled = false
    }
  }
}
</script>
