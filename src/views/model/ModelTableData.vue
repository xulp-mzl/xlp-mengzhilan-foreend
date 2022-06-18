<template>
  <div class="model-table-data-container">
    <common-border-table-with-page
     :data="tableData"
     v-loading="loading"
     :table-title="tableTitle"
     :filterable="true"
     :filter-into="filterInto"
     @search-data="filterData"
     @clear-data="resetData"
     type="selection"
     :row-option-width="350"
     @size-change="handleSizeChange"
     @current-page-change="handleCurrentPageChange"
     :current-page.sync="currentPage"
     :page-size="pageSize"
     :page-sizes="[2,4,8]"
     :total="total">

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
import {getModelData} from '@/js/api/model'
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
    hideModel(){

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
