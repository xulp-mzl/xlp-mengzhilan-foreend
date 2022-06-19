<template>
  <div class="model-table-data-container">
    <common-border-table-with-page ref="tableData"
     :data="tableData"
     v-loading="loading"
     :table-title="tableTitle"
     :filterable="true"
     :filter-into="filterInto"
     type="selection"
     :row-option-width="350"
     :current-page.sync="currentPage"
     :page-size="pageSize"
     :page-sizes="[2,4,8]"
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
        <el-button @click.native.stop="deleteMenuItem(scope.row)" type="text" size="small" style="color: red;">删除</el-button>
        <el-button type="text" size="small" @click.native.stop="editMenuItem(scope.row)">编辑</el-button>
      </template>
    </common-border-table-with-page>

   <!-- <edit-menu-item-form :visible="showCreateForm" @removed="handleRemove" v-if="!isRemoved"
                         @reload-parent-table="reloadData" :item-info="edit ? selectedRow : undefined"
                         :edit="edit"
                         :parent-id="selectedRowIndex">
    </edit-menu-item-form>-->
  </div>
</template>

<script>

import {tableTitle, filterInto} from '@/js/model/model'
import {getModelData, hideModels} from '@/js/api/model'
import CommonBorderTableWithPage from '@/components/common/CommonBorderTableWithPage'
import PaginationTableDataMixins from '@/components/mixins/table/PaginationTableDataMixins'

export default {
  name: 'MenuTableData',
  components: {
    CommonBorderTableWithPage
  },
  mixins: [PaginationTableDataMixins],
  data(){
    return {
      edit: false,
      pageSize: 4
    }
  },
  methods: {
    reloadData(reload){
      if (reload) {
        // this.$router.go(0)
        this.$store.commit('setReloadCurrentPage', false)
        this.$nextTick(() => {
          this.$store.commit('setReloadCurrentPage', true)
        })
      }
    },
    async getModelData(){
      this.loading = true
      const tableData = await getModelData()
      if (tableData.errorMsg){
        this.$msgAlert(tableData.errorMsg, 'error')
      } else {
        this.sourceTableData = tableData.data
        this.filterTableData = [...this.sourceTableData]
        this.total = this.filterTableData.length
        this.getTablePageData(this.currentPage, this.pageSize)
      }
      this.loading = false
    },
    /**
     * 设置隐藏模型操作
     */
    hideModel(){
      const selectionDataIds = []
      this.selections.forEach((item) => {
        selectionDataIds.push(item.beanId)
      })
      if (selectionDataIds.length === 0) {
        this.$msgAlert('请选择要操作的数据！', 'error')
        return
      }
      this._hideModel(selectionDataIds.join(','))
    },
    async _hideModel(selectionDataIds){
      const response = await hideModels()
      if (response.errorMsg){
        this.$msgAlert(response.errorMsg, 'error')
      } else {
        this.getModelData()
      }
    }
  },
  created(){
    this.initData(filterInto, tableTitle)
    this.getModelData()
  }
}
</script>

<style lang="less">
  .model-table-data-container{
    height: 100%;
  }
</style>
