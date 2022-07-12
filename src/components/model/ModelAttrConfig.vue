<template>
  <common-dialog dialog-title="模型字段信息" :visible.sync="visible" width="85%"
                 :before-close="handleBeforeClose" :class="[loading ? 'overflow-hidden' : '', 'base-config-dialog']">
    <template #body>
      <common-border-scroll-table-with-page ref="tableData"
                                     :data="tableData"
                                     :table-title="tableTitle"
                                     :filterable="true"
                                     :filter-info="filterInfo"
                                     type="index"
                                     :row-option-width="200"
                                     :current-page.sync="currentPage"
                                     :total="total"
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

        <template #rowOption="scope">
          <el-button type="text" size="small" @click.native.stop="editModel(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click.native.stop="openConfig(scope.row, 2)">配置基本信息</el-button>
          <el-button type="text" size="small" @click.native.stop="openConfig(scope.row, 3)">模型字段信息配置</el-button>
        </template>
      </common-border-scroll-table-with-page>
    </template>
  </common-dialog>
</template>

<script>

import FormMixins from '@/components/mixins/form/FormMixins'
import CommonBorderScrollTableWithPage from '@/components/common/CommonBorderScrollTableWithPage'
import PaginationTableDataMixins from '@/components/mixins/table/PaginationTableDataMixins'
import CommonDialog from '@/components/common/CommonDialog'
import {tableTitle, filterInfo} from '@/js/model/modelField'
import {getModelAttrs} from '@/js/api/modelAttr'

export default {
  name: 'ModelAttrConfig',
  mixins: [FormMixins, PaginationTableDataMixins],
  components: {
    CommonDialog,
    CommonBorderScrollTableWithPage
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
      pageSize: 50
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
