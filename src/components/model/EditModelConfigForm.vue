<template>
  <common-dialog :dialog-title="'【' + modelId + '】基本操作信息配置'" :visible.sync="visible"
                 :before-close="handleBeforeClose" :class="[loading ? 'overflow-hidden' : '', 'base-config-dialog']">

    <template #body>
      <el-form :model="modelConfig" label-width="200px" ref="form" size="medium">
        <el-form-item label="表格中数据是否可搜索：" prop="filterable">
          <el-radio-group v-model="modelConfig.filterable">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="表格首列类型：" prop="firstColumnType">
          <el-select v-model="modelConfig.firstColumnType" >
            <el-option
                v-for="item in firstColumnTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="表单宽度：" prop="formWidth"
                      :rules="[validateInt('表单宽度必须是正整数')]">
          <el-input v-model.number="modelConfig.formWidth" autocomplete="off">
            <template slot="append">
              <el-tooltip content="点击切换单位" placement="top" effect="light">
                <el-button @click="changeWidthUnit(formWidthUnit, 'formWidth')">{{formWidthUnit}}</el-button>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="表单宽度是否全屏：" prop="fullscreen">
          <el-radio-group v-model="modelConfig.fullscreen">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="表单拆分列数：" prop="splitColumnCount">
          <el-select v-model="modelConfig.splitColumnCount" >
            <el-option
                v-for="item in splitColumnCountData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="表单描述宽度：" prop="formItemLabelWidth"
                      :rules="[validateInt('表单描述宽度必须是正整数')]">
          <el-input v-model.number="modelConfig.formItemLabelWidth" autocomplete="off">
            <template slot="append">
              <el-tooltip content="点击切换单位" placement="top" effect="light">
                <el-button @click="changeWidthUnit(formItemLabelWidthUnit, 'formItemLabelWidth')">{{formItemLabelWidthUnit}}</el-button>
              </el-tooltip>
            </template>
          </el-input>
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
import {saveBaseInfo, getBaseConfigInfo} from '@/js/api/modelConfig'
import RuleValidation from '@/components/mixins/rules/RuleValidation'

export default {
  name: 'EditModelConfigForm',
  components: {
    CommonDialog
  },
  mixins: [FormMixins, RuleValidation],
  props: {
    modelId: {
      default: '',
      type: String
    }
  },
  data(){
    return {
      disabled: false,
      modelConfig: {
        filterable: false,
        firstColumnType: 'none',
        formWidth: null,
        fullscreen: false,
        splitColumnCount: 1,
        formItemLabelWidth: 100
      },
      firstColumnTypes: [
        {value: 'none', label: '无'},
        {value: 'index', label: 'index'},
        {value: 'selection', label: 'selection'}
      ],
      splitColumnCountData: [
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
        {value: 4, label: '4'},
        {value: 6, label: '6'},
        {value: 8, label: '8'},
        {value: 12, label: '12'}
      ],
      formWidthUnit: 'px',
      formItemLabelWidthUnit: 'px',
      loading: true
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
      const sendData = {...this.modelConfig}
      sendData.modelId = this.modelId
      let value = sendData.formWidth
      if (value && value > 0){
        sendData.formWidth = sendData.formWidth + this.formWidthUnit
      }
      value = sendData.formItemLabelWidth
      if (value && value > 0){
        sendData.formItemLabelWidth = sendData.formItemLabelWidth + this.formItemLabelWidthUnit
      }
      const response = await saveBaseInfo(sendData)
      if (response.errorMsg){
        this.$msgAlert(response.errorMsg, 'error')
      } else {
        this.closeDialog()
        this.$tips('数据修改成功！')
      }
      this.disabled = false
    },
    /**
     * 单位改变
     * @param unit
     * @param prop
     */
    changeWidthUnit(unit, prop){
      if (prop === 'formWidth'){
        this.formWidthUnit = this._getChangedUnit(unit)
      } else {
        this.formItemLabelWidthUnit = this._getChangedUnit(unit)
      }
    },
    _getChangedUnit(unit){
      return unit === 'px' ? '%' : 'px'
    },
    /**
     * 获取基本信息
     * @returns {Promise<void>}
     */
    async getBaseConfigInfo(){
      this.loading = true
      const appLoading = this.$appLoading(null, '.base-config-dialog .el-dialog')
      const response = await getBaseConfigInfo(this.modelId)
      if (response.errorMsg){
        this.$msgAlert(response.errorMsg, 'error')
      } else {
        const data = response.data
        if (data && typeof data === 'object'){
          for (const key in this.modelConfig){
            if (key === 'formWidth'){
              const countAndUnit = this._getCountAndUnit(data[key])
              if (countAndUnit.length > 0){
                this.modelConfig[key] = countAndUnit[1]
                this.formWidthUnit = countAndUnit[0]
              }
            } else if (key === 'formItemLabelWidth'){
              const countAndUnit = this._getCountAndUnit(data[key])
              if (countAndUnit.length > 0){
                this.modelConfig[key] = countAndUnit[1]
                this.formItemLabelWidthUnit = countAndUnit[0]
              }
            } else {
              this.modelConfig[key] = data[key]
            }
          }
        }
      }
      this.loading = false
      appLoading.close()
    },
    _getCountAndUnit(value){
      const countAndUnit = []
      if (value){
        countAndUnit.push(value.endsWith('px') ? 'px' : '%')
        countAndUnit.push(value.substring(0, value.length - (value.endsWith('px') ? 2 : 1)))
      }
      return countAndUnit
    }
  },
  created(){

  },
  mounted(){
    this.getBaseConfigInfo()
  }
}
</script>
