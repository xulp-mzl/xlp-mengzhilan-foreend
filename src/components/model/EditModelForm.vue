<template>
  <common-dialog title="编辑模型信息" :visible.sync="visible"
                 :before-close="handleBeforeClose">

    <template #body>
      <el-form :model="modelInfo" label-width="100px" ref="form" size="medium">
        <el-form-item label="模型名称："
                      prop="title"
                      :rules="[
                { required: true, message: '菜单名称不能为空'},
              ]"
        >
          <el-input v-model="modelInfo.title" autocomplete="off" placeholder="请输菜单名称" class="custom-input"></el-input>
        </el-form-item>

        <el-form-item label="路由地址："
                      prop="path">
          <el-input v-model="modelInfo.path" autocomplete="off" placeholder="请输入路由地址" class="custom-input"></el-input>
        </el-form-item>

        <el-form-item label="图标类型：" prop="iconType">
          <el-select v-model="modelInfo.iconType" placeholder="请选择图标类型">
            <el-option label="" value=""></el-option>
            <el-option label="element-ui" value="element-ui"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图标描述：" prop="icon">
          <el-input v-model="modelInfo.icon" autocomplete="off" placeholder="图标描述" class="custom-input"></el-input>
        </el-form-item>

        <el-form-item
            label="排序号："
            prop="weight"
            :rules="[{ type: 'number', message: '排序号必须为数字值'}]"
        >
          <el-input v-model.number="modelInfo.weight" autocomplete="off" class="custom-input" ></el-input>
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <div class="dialog-footer" style="padding-right: 20%;">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="save" :disabled="disabled">保存</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
      </div>
    </template>
  </common-dialog>
</template>

<script>

import CommonDialog from '@/components/common/CommonDialog'
import FormMixins from '@/components/mixins/form/FormMixins'

export default {
  name: 'EditModelForm',
  components: {
    CommonDialog
  },
  mixins: [FormMixins],
  props: {
    edit: {
      default: false,
      type: Boolean
    },
    modelInfo: {
      default: () => {
        return {
          modelId: null,
          modelName: '',
          weight: 0
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
    handleBeforeClose(){
      this.closeDialog()
    },
    save(){
      const canSave = this.validateForm(this.$refs.form)
      if (canSave){

      } else {
        this.$msgAlert('请按要求填好表格数据后，再提交！', 'error')
      }
    },
    closeDialog(){
      this.$emit('removed', !this.visible, true)
    },
    resetForm(){
      this.$refs.form.resetFields()
    }
  }
}
</script>
