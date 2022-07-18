<template>
  <common-dialog :dialog-title="'【' + modelInfo.beanId + '】模型字段信息'"
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
             type="index"
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

        <template #tableToolbar v-if="canAddExtAttr">
          <div class="table-toolbar">
            <el-button type="primary" icon="el-icon-plus" plain size="small" @click="addExtField">添加扩展字段</el-button>
          </div>
        </template>

        <template #attributeType="scope">
          <div v-if="scope && scope.row && scope.row.attributeType === 'HARD_ATTR'">硬属性</div>
          <div v-if="scope && scope.row && scope.row.attributeType === 'EXTEND_ATTR'" style="color: chartreuse;">扩展属性</div>
        </template>

        <template #rowOption="scope">
          <el-button type="text" size="small" @click.native.stop="editModelAttr(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click.native.stop="deleteModelAttr(scope.row)" style="color: red;"
            v-if="scope.row && (scope.row.canDelete === true || scope.row.canDelete === 'true')">删除</el-button>
        </template>
      </common-border-table-with-page>

      <model-attr-config-form
          :visible="showCreateForm"
          :model-id="modelInfo.beanId"
          :attr-id="attrId"
          @removed="handleRemove"
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
import {getModelAttrs} from '@/js/api/modelAttr'
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
      attrId: ''
    }
  },
  methods: {
    addExtField(){

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
      this.handleRowClick(row)
      this.attrId = row.attrId
      this.handleRemove(true, false)
      const rowData = {...row, modelId: this.modelInfo.beanId}
      delete rowData.canDelete
      console.log(rowData)
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
