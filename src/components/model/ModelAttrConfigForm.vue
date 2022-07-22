<template>
  <common-dialog  :visible.sync="visible"
                  width="60%"
                  append-to-body
                 :before-close="handleBeforeClose"
                  :class="[loading ? 'overflow-hidden' : '', 'model-attr-config-dialog']">
    <template #title>
      <div>
        <span style="color: #43b8c2">【{{modelId}}--{{attrId}}】</span>
        <span>模型字段信息</span>
      </div>
    </template>
    <template #body>
      <div class="attr-body">
        <el-form :model="modelAttrInfo" label-width="112px" ref="form" size="mini">
          <div class="attr-title">基础属性</div>
          <el-row :gutter="5">
            <el-col :span="8">
              <el-form-item
                  label="属性id："
              >
                <el-input v-model="modelAttrInfo.attrId" disabled class="custom-input" type="mini"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="模型名称："
                  prop="attrName"
                  :rules="[
                    { required: true, message: '模型名称不能为空'},
                  ]"
              >
                <el-input v-model.trim="modelAttrInfo.attrName" autocomplete="off" placeholder="请输入属性名称" class="custom-input" type="mini"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="排序号："
                  prop="orderNo"
                  :rules="[
                    { required: true, message: '排序号不能为空'},
                    { type: 'number', message: '排序号必须为数字值'}
                  ]"
              >
                <el-input v-model.number="modelAttrInfo.orderNo" autocomplete="off" class="custom-input" type="mini"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="attr-title">其他配置</div>

          <el-row :gutter="5">
            <el-col :span="8">
              <el-form-item
                  label="新增时可编辑："
                  prop="adding"
              >
                <el-radio-group v-model="modelAttrInfo.adding" type="mini" @change="addingChange">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="新增时可显示："
                  prop="addingShow"
              >
                <el-radio-group v-model="modelAttrInfo.addingShow" type="mini">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="提示信息："
                  prop="placeholder"
              >
                <el-input v-model="modelAttrInfo.placeholder" autocomplete="off" class="custom-input" type="mini" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="5">
            <el-col :span="8">
              <el-form-item
                  label="编辑时可编辑："
                  prop="edit"
              >
                <el-radio-group v-model="modelAttrInfo.edit" type="mini" @change="editChange">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="编辑时可显示："
                  prop="editShow"
              >
                <el-radio-group v-model="modelAttrInfo.editShow" type="mini">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="是否必填："
                  prop="required"
              >
                <el-radio-group v-model="modelAttrInfo.required" type="mini" :disabled="disabled">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="5">
            <el-col :span="8">
              <el-form-item
                  label="自定义输入框："
                  prop="slot"
              >
                <el-radio-group v-model="modelAttrInfo.slot" type="mini" @change="slotChange">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="自定义类名："
                  prop="itemClassName"
              >
                <el-input v-model.number="modelAttrInfo.itemClassName"
                          autocomplete="off"
                          class="custom-input" type="mini">
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="文本长度："
                  prop="textMaxLength"
                  :rules="[
                    validateInt('文本长度必须是不小于0的整数！')
                  ]"
              >
                <el-input v-model.number="modelAttrInfo.textMaxLength"
                          autocomplete="off"
                          class="custom-input"
                          type="mini"
                          :disabled="disabled">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="5" v-if="!disabled">
            <el-col :span="8">
              <el-form-item
                  label="输入框类型："
                  prop="formInputType"
              >
                <el-radio-group v-model="modelAttrInfo.formInputType" type="mini" >
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="自定义类名："
                  prop="itemClassName"
              >
                <el-input v-model.number="modelAttrInfo.itemClassName"
                          autocomplete="off"
                          class="custom-input" type="mini">
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="文本长度："
                  prop="textMaxLength"
                  :rules="[
                    validateInt('文本长度必须是不小于0的整数！')
                  ]"
              >
                <el-input v-model.number="modelAttrInfo.textMaxLength"
                          autocomplete="off"
                          class="custom-input"
                          type="mini"
                          :disabled="disabled">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </template>
  </common-dialog>
</template>

<script>

import FormMixins from '@/components/mixins/form/FormMixins'
import CommonDialog from '@/components/common/CommonDialog'
import {getModelAttr} from '@/js/api/modelAttr'
import RuleValidation from '@/components/mixins/rules/RuleValidation'

export default {
  name: 'ModelAttrConfigForm',
  mixins: [FormMixins, RuleValidation],
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
    },
    /**
     * 属性名称
     */
    attrName: {
      default: '',
      type: String
    }
  },
  data(){
    return {
      loading: true,
      modelAttrInfo: {},
      disabled: false
    }
  },
  methods: {
    async getAttr(){
      this.loading = true
      const appLoading = this.$appLoading(null, '.model-attr-config-dialog .el-dialog')
      const response = await getModelAttr(this.modelId, this.attrId)
      if (response.errorMsg){
        this.$msgAlert(response.errorMsg, 'error')
      } else {
        this.modelAttrInfo = response.data
        if (!this.modelAttrInfo.attrName){
          this.modelAttrInfo.attrName = this.attrName
        }
        if (!this.modelAttrInfo.attrId){
          this.modelAttrInfo.attrId = this.attrId
        }
        if (this.modelAttrInfo.slot === true){
          this.disabled = true
          this.modelAttrInfo.textMaxLength = 0
        }
        console.log(this.modelAttrInfo)
      }
      this.loading = false
      appLoading.close()
    },
    addingChange(val){
      if (val === true){
        this.modelAttrInfo.addingShow = val
      }
    },
    editChange(val){
      if (val === true){
        this.modelAttrInfo.editShow = val
      }
    },
    slotChange(val){
      this.disabled = val
      if (val){
        this.modelAttrInfo.required = false
        this.modelAttrInfo.placeholder = ''
        this.modelAttrInfo.textMaxLength = 0
        this.$refs.form.clearValidate('textMaxLength')
      } else {

      }
    }
  },
  mounted(){
    this.getAttr()
  }
}
</script>

<style lang="less">
  .attr-body{
    .attr-title{
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 10px;
      color: darkgoldenrod;
    }
    .custom-input{
      .el-input__inner{
        width: 100% !important;
      }
    }
  }
</style>
