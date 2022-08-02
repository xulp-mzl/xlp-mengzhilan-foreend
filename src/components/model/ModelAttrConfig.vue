<template>
  <common-dialog :dialog-title="'【' + modelInfo.beanId + '】模型属性信息'"
                 :visible.sync="visible"
                 width="85%"
                 :before-close="handleBeforeClose"
                 :class="[loading ? 'overflow-hidden' : '', 'base-config-dialog']">
    <template #body>
      <common-border-table-with-page ref="tableData"
             :data="tableData"
             :table-title="tableTitle"
             :filterable="true"
             :filter-info="filterInfo"
             type="selection"
             :row-option-width="200"
             :current-page.sync="currentPage"
             :total="total"
             :table-height-fixed="false"
             :page-size="pageSize"
             @search-data="filterData"
             @clear-data="resetData"
             @size-change="handleSizeChange"
             @current-page-change="handleCurrentPageChange"
             @selection-change="handleSelectionChange"
             @row-click="handleRowClick"
             :default-style="{width: '100%', height: 'auto'}">

        <template #tableToolbar>
          <div class="table-toolbar">
            <el-button type="primary" icon="el-icon-plus" plain size="small"
                   @click="addExtField" v-if="canAddExtAttr">添加扩展字段</el-button>
            <el-button type="primary" icon="el-icon-setting" plain size="small"
                       @click="batchSetting">批量配置模型属性</el-button>
          </div>
        </template>

        <template #attributeType="scope">
          <div v-if="scope && scope.row && scope.row.attributeType === 'HARD_ATTR'">硬属性</div>
          <div v-if="scope && scope.row && scope.row.attributeType === 'EXTEND_ATTR'" style="color: chartreuse;">扩展属性</div>
        </template>

        <template #rowOption="scope">
          <div v-if="scope.row && (scope.row.canDelete === true || scope.row.canDelete === 'true')">
            <el-button type="text" size="small" @click.native.stop="deleteModelAttr(scope.row)" style="color: red;">删除</el-button>
            <el-button type="text" size="small" @click.native.stop="deleteModelAttr(scope.row)" style="color: lightgreen;">发布</el-button>
          </div>
          <el-button type="text" size="small" @click.native.stop="editModelAttr(scope.row)" v-else>编辑</el-button>
        </template>
      </common-border-table-with-page>

      <model-attr-config-form
          :visible="showCreateForm"
          :model-id="modelInfo.beanId"
          :attr-id="attrId"
          :attr-name="attrName"
          :form-field-type="formFieldType"
          :is-add="isAdd"
          @removed="openAndCloseDialog"
          v-if="!isRemoved">
      </model-attr-config-form>
    </template>
  </common-dialog>
</template>

<script>

import FormMixins from '@/components/mixins/form/FormMixins'
import CommonBorderTableWithPage from '@/components/common/CommonBorderTableWithPage'
import PaginationTableDataMixins from '@/components/mixins/table/PaginationTableDataMixins'
import CommonDialog from '@/components/common/CommonDialog'
import {tableTitle, filterInfo} from '@/js/model/modelField'
import {getModelAttrs, batchSetting} from '@/js/api/modelAttr'
import ModelAttrConfigForm from '@/components/model/ModelAttrConfigForm'

export default {
  name: 'ModelAttrConfig',
  mixins: [FormMixins, PaginationTableDataMixins],
  components: {
    CommonDialog,
    CommonBorderTableWithPage,
    ModelAttrConfigForm
  },
  props: {
    /**
     * 模型信息
     */
    modelInfo: {
      default: () => {},
      type: Object
    }
  },
  data(){
    return {
      canAddExtAttr: false,
      pageSize: 50,
      attrId: '',
      attrName: '',
      isAdd: false,
      formFieldType: ''
    }
  },
  methods: {
    addExtField(){
      this.isAdd = true
      this.attrId = undefined
      this.attrName = undefined
      this.formFieldType = undefined
      this.openAndCloseDialog(true, false)
    },
    async getAllAttrs(){
      this.loading = true
      const appLoading = this.$appLoading(null, '.base-config-dialog .el-dialog')
      const response = await getModelAttrs(this.modelInfo.beanId)
      if (response.errorMsg){
        this.$msgAlert(response.errorMsg, 'error')
      } else {
        this.initTableData(response.data)
      }
      this.loading = false
      appLoading.close()
    },
    editModelAttr(row){
      this.isAdd = false
      this.handleRowClick(row)
      this.attrId = row.attrId
      this.attrName = row.attrName
      this.formFieldType = row.formFieldType
      this.openAndCloseDialog(true, false)
    },
    /**
     * 批量设置模型属性配置信息
     */
    async batchSetting(){
      if (!this.selections || this.selections.length === 0){
        this.$msgAlert('请选择要操作的数据！', 'error')
        return
      }
      // eslint-disable-next-line no-unused-vars
      const appLoading = this.$appLoading()
      let attrIds = []
      this.selections.forEach((item) => {
        attrIds.push(item.attrId)
      })
      attrIds = attrIds.join(',')
      batchSetting(this.modelInfo.beanId, attrIds)
        .then((data) => {
          if (data.code !== 200 && data.errorMsg){
            this.$msgAlert(data.errorMsg, 'error')
            return
          }
          this.$tips('批量设置成功！')
          // 清除已有的选择
          // eslint-disable-next-line no-unused-expressions
          this.getElTable()?.clearSelection()
          appLoading.close()
        }).catch(() => {
          this.$msgAlert('批量设置模型属性信息失败！', 'error')
          appLoading.close()
        })
    }
  },
  created(){
    this.canAddExtAttr = this.modelInfo.canExtend
    this.initData(filterInfo, tableTitle)
  },
  mounted(){
    this.getAllAttrs()
  }
}
</script>

<style>
  .el-dialog__body{
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
