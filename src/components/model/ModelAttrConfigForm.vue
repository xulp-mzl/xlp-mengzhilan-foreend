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
                <el-input v-model="modelAttrInfo.attrId" disabled class="custom-input"></el-input>
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
                <el-input v-model.trim="modelAttrInfo.attrName" autocomplete="off" placeholder="请输入属性名称" class="custom-input"></el-input>
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
                <el-input v-model.number="modelAttrInfo.orderNo" autocomplete="off" class="custom-input"></el-input>
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
                <el-radio-group v-model="modelAttrInfo.adding" @change="addingChange">
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
                <el-radio-group v-model="modelAttrInfo.addingShow">
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
                <el-input v-model="modelAttrInfo.placeholder"
                          autocomplete="off"
                          class="custom-input"
                          :disabled="disabled"
                          placeholder="请输入填写提示信息"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="5">
            <el-col :span="8">
              <el-form-item
                  label="编辑时可编辑："
                  prop="edit"
              >
                <el-radio-group v-model="modelAttrInfo.edit" @change="editChange">
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
                <el-radio-group v-model="modelAttrInfo.editShow">
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
                <el-radio-group v-model="modelAttrInfo.required" :disabled="disabled">
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
                <el-radio-group v-model="modelAttrInfo.slot" @change="slotChange">
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
                          class="custom-input"
                          placeholder="自定义类名，例如：custom-class"
                         >
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
                <el-select v-model="modelAttrInfo.formInputType"
                           placeholder="请选择输入框类型"
                           style="width: 100%;"
                           class="custom-input">
                  <el-option
                      v-for="option in formInputTypes"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="默认值："
                  prop="defaultValue"
              >
                <el-input v-model="modelAttrInfo.defaultValue"
                          autocomplete="off"
                          class="custom-input"
                          placeholder="请输入默认值">
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item
                  label="值来源类型："
                  prop="valueFromType"
              >
                <el-select v-model="modelAttrInfo.valueFromType"
                           placeholder="请选择值来源类型"
                           clearable
                           style="width: 100%;"
                           class="custom-input"
                           @change="valueFromTypeChange">
                  <el-option
                      label="来自接口实现类（对可选框生效）"
                      value="CLASS">
                  </el-option>
                  <el-option
                      label="来自外部链接（对弹框选择生效）"
                      value="URL">
                  </el-option>
                  <el-option
                    label="自定义输入（对可选框生效）"
                    value="CUSTOM">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="5" v-if="!disabled && valueFromInputFlag !== undefined">
            <el-col :span="16">
              <el-form-item
                  label="值来源："
                  prop="valueFrom">
                <el-select v-model="modelAttrInfo.valueFrom" v-if="valueFromInputFlag === 'CLASS'"
                           placeholder="请选择"
                           style="width: 100%;"
                           class="custom-input">
                  <el-option
                      v-for="option in formValueFromSelection"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value">
                  </el-option>
                </el-select>
                <el-input v-model="modelAttrInfo.valueFrom" v-if="valueFromInputFlag ==='URL'"
                          autocomplete="off"
                          class="custom-input"
                          placeholder="请输入问外部链接">
                </el-input>
                <el-input v-model="modelAttrInfo.valueFrom" v-if="valueFromInputFlag ==='CUSTOM'"
                          class="custom-input"
                          type="textarea"
                          resize="none"
                          :rows="3"
                          placeholder="请输入自定义值（json格式）">
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
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
import {getFormInputType, getFormValueFromSelection} from '@/js/api/selectOption'

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
    },
    formFieldType: {
      default: '',
      type: String
    }
  },
  data(){
    return {
      loading: true,
      modelAttrInfo: {},
      disabled: false,
      formInputTypes: [],
      valueFromInputFlag: undefined,
      formValueFromSelection: []
    }
  },
  methods: {
    /**
     * 获取属性配置信息
     * @returns {Promise<void>}
     */
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
        if (!this.modelAttrInfo.formInputType){
          if (this.formFieldType === 'DATE'){
            this.$set(this.modelAttrInfo, 'formInputType', 'DATE')
          } else if (this.formFieldType === 'BOOLEAN'){
            this.$set(this.modelAttrInfo, 'formInputType', 'BOOLEAN')
          } else {
            this.$set(this.modelAttrInfo, 'formInputType', 'TEXT')
          }
        }
        // eslint-disable-next-line no-prototype-builtins
        if (!this.modelAttrInfo.hasOwnProperty('defaultValue')){
          this.$set(this.modelAttrInfo, 'defaultValue', '')
        }
        // eslint-disable-next-line no-prototype-builtins
        if (!this.modelAttrInfo.hasOwnProperty('valueFrom')){
          this.$set(this.modelAttrInfo, 'valueFrom', '')
        }
        // eslint-disable-next-line no-prototype-builtins
        if (!this.modelAttrInfo.hasOwnProperty('valueFromType')){
          this.$set(this.modelAttrInfo, 'valueFromType', '')
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
    },
    /**
     * 获取表单条目输入类容下拉框选择内容
     */
    async getFormInputType(){
      const response = await getFormInputType()
      if (response.errorMsg){
        this.$msgAlert(response.errorMsg, 'error')
      } else {
        this.formInputTypes = response.data
      }
    },
    valueFromTypeChange(val){
      if (val === '') {
        this.valueFromInputFlag = undefined
      } else {
        this.valueFromInputFlag = val
      }
    },
    async getFormValueFromSelection(){
      const response = await getFormValueFromSelection()
      if (response.errorMsg){
        this.$msgAlert(response.errorMsg, 'error')
      } else {
        this.formValueFromSelection = response.data
      }
    }
  },
  mounted(){
    this.getAttr()
    this.getFormInputType()
    this.getFormValueFromSelection()
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
