<template>
  <common-dialog dialog-title="基本操作信息配置" :visible.sync="visible"
                 :before-close="handleBeforeClose">

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
import {saveBaseInfo} from '@/js/api/modelConfig'
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
      formItemLabelWidthUnit: 'px'
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
      this.modelConfig.modelId = this.modelId
      const response = await saveBaseInfo(this.modelConfig)
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
        if (unit === 'px'){
          this.formWidthUnit = '%'
        } else {
          this.formWidthUnit = 'px'
        }
      } else {
        if (unit === 'px'){
          this.formItemLabelWidthUnit = '%'
        } else {
          this.formItemLabelWidthUnit = 'px'
        }
      }
    }
  }
}
</script>
