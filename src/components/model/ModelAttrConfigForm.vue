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
        <el-form :model="modelAttrInfo" label-width="100px" ref="form" size="mini">
          <div class="attr-title">基础属性</div>
          <el-row :gutter="5">
            <el-col :span="8">
              <el-form-item label="模型名称："
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
                  :rules="[{ type: 'number', message: '排序号必须为数字值'}]"
              >
                <el-input v-model.number="modelAttrInfo.orderNo" autocomplete="off" class="custom-input" type="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                  label="排序号："
                  prop="orderNo"
                  :rules="[{ type: 'number', message: '排序号必须为数字值'}]"
              >
                <el-input v-model.number="modelAttrInfo.orderNo" autocomplete="off" class="custom-input" type="mini"></el-input>
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
      modelAttrInfo: {}
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
        console.log(this.modelAttrInfo)
      }
      this.loading = false
      appLoading.close()
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
