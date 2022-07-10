<template>
  <common-dialog dialog-title="模型字段信息" :visible.sync="visible" width="85%"
                 :before-close="handleBeforeClose" :class="[loading ? 'overflow-hidden' : '', 'base-config-dialog']">
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
                                     :page-size="50"
                                     @search-data="filterData"
                                     @clear-data="resetData"
                                     @size-change="handleSizeChange"
                                     @current-page-change="handleCurrentPageChange"
                                     @selection-change="handleSelectionChange"
                                     @row-click="handleRowClick">

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
      </common-border-table-with-page>
    </template>
  </common-dialog>
</template>

<script>

import FormMixins from '@/components/mixins/form/FormMixins'
import CommonBorderTableWithPage from '@/components/common/CommonBorderTableWithPage'
import PaginationTableDataMixins from '@/components/mixins/table/PaginationTableDataMixins'
import CommonDialog from '@/components/common/CommonDialog'
import {tableTitle, filterInfo} from '@/js/model/modelField'

export default {
  name: 'ModelAttrConfig',
  mixins: [FormMixins, PaginationTableDataMixins],
  components: {
    CommonDialog,
    CommonBorderTableWithPage
  },
  props: {
    modelId: {
      default: '',
      type: String
    },
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
      canAddExtAttr: false
    }
  },
  methods: {
    addExtField(){

    }
  },
  created(){
    console.log(this.modelInfo)
    this.canAddExtAttr = this.modelInfo.canExtend
    this.initData(filterInfo, tableTitle)
  }
}
</script>

<style>
  .el-dialog__body{
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
