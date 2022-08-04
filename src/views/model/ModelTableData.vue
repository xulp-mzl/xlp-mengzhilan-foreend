<template>
  <div class="model-table-data-container">
    <common-border-table-with-page ref="tableData"
     :data="tableData"
     v-loading="loading"
     :table-title="tableTitle"
     :filterable="true"
     :filter-info="filterInfo"
     type="selection"
     :row-option-width="300"
     :current-page.sync="currentPage"
     :total="total"
     @search-data="filterData"
     @clear-data="resetData"
     @size-change="handleSizeChange"
     @current-page-change="handleCurrentPageChange"
     @selection-change="handleSelectionChange"
     @row-click="handleRowClick">

      <template #tableToolbar>
        <div class="table-toolbar">
          <el-button type="primary" icon="el-icon-plus" plain size="small" @click="hideModel">隐藏模型</el-button>
        </div>
      </template>

      <template #rowOption="scope">
        <el-button type="text" size="small" @click.native.stop="openModelOpenDialog(scope.row, 1)">编辑</el-button>
        <el-button type="text" size="small" @click.native.stop="openModelOpenDialog(scope.row, 2)">配置基本信息</el-button>
        <el-button type="text" size="small" @click.native.stop="openModelOpenDialog(scope.row, 3)">模型属性配置</el-button>
        <el-button type="text" size="small" @click.native.stop="openModelOpenDialog(scope.row, 4)">模型表格配置</el-button>
      </template>
    </common-border-table-with-page>

    <edit-model-form
        :visible="showCreateForm"
        :model-info="selection"
         @removed="openAndCloseDialog"
         @reload-parent-table="reloadData"
         v-if="!isRemoved && optionBtn === 1"
      >
    </edit-model-form>

    <edit-model-config-form
        :visible="showCreateForm"
        :model-id="modelId"
        @removed="openAndCloseDialog"
        v-if="!isRemoved && optionBtn === 2">
    </edit-model-config-form>

    <model-attr-config
        :visible="showCreateForm"
        :model-info="selection"
        @removed="openAndCloseDialog"
        v-if="!isRemoved && optionBtn === 3">
    </model-attr-config>
  </div>
</template>

<script>

import {tableTitle, filterInfo} from '@/js/model/model'
import {getModelData, hideModels} from '@/js/api/model'
import CommonBorderTableWithPage from '@/components/common/CommonBorderTableWithPage'
import PaginationTableDataMixins from '@/components/mixins/table/PaginationTableDataMixins'
import EditModelForm from '@/components/model/EditModelForm'
import EditModelConfigForm from '@/components/model/EditModelConfigForm'
import ModelAttrConfig from '@/components/model/ModelAttrConfig'

export default {
  name: 'MenuTableData',
  components: {
    CommonBorderTableWithPage,
    EditModelForm,
    EditModelConfigForm,
    ModelAttrConfig
  },
  mixins: [PaginationTableDataMixins],
  data(){
    return {
      optionBtn: 1,
      selection: undefined,
      modelId: ''
    }
  },
  methods: {
    openModelOpenDialog(row, optionBtn){
      this.handleRowClick(row)
      this.selection = row
      this.optionBtn = optionBtn
      this.modelId = row.beanId
      this.openAndCloseDialog(true, false)
    },
    async getModelData(){
      this.loading = true
      const tableData = await getModelData()
      if (tableData.errorMsg){
        this.$msgAlert(tableData.errorMsg, 'error')
      } else {
        this.initTableData(tableData.data)
      }
      this.loading = false
    },
    /**
     * 设置隐藏模型操作
     */
    hideModel(){
      if (!this.validateSelected()) return
      const selectionDataIds = []
      this.selections.forEach((item) => {
        selectionDataIds.push(item.beanId)
      })
      const appLoading = this.$appLoading()
      this.$myConfirm('执行该操作后，模型不在显示，是否继续该操作？', () => {
        this._hideModel(selectionDataIds.join(','), appLoading)
      }, () => appLoading.close())
    },
    async _hideModel(selectionDataIds, appLoading){
      const response = await hideModels(selectionDataIds)
      appLoading.close()
      if (response.errorMsg){
        this.$msgAlert(response.errorMsg, 'error')
      } else {
        this.getModelData()
      }
    },
    async reloadData(isRefreshed){
      if (isRefreshed === true){
        await this.getModelData()
        this.refreshPage()
      }
    }
  },
  created(){
    this.initData(filterInfo, tableTitle)
    this.getModelData()
  }
}
</script>

<style lang="less">
  .model-table-data-container{
    height: 100%;
  }
</style>
