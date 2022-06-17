<template>
  <div class="model-table-data-container">
    <common-border-table-with-page
     :data="modelData"
     v-loading="loading"
     :table-title="tableTitle"
     :filterable="true"
     :filter-into="filterInto"
     @search-data="filterData"
     @clear-data="resetData"
     type="selection"
     :row-option-width="350"
     @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
     :current-page="currentPage"
     :page-size="pageSize"
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
import {filterTableTreeData} from '@/js/tableFilterUtils'
import {getModelData} from '@/js/api/model'
import CommonBorderTableWithPage from '@/components/common/CommonBorderTableWithPage'

export default {
  name: 'MenuTableData',
  components: {
    CommonBorderTableWithPage
  },
  data(){
    return {
      modelData: [],
      tempModelData: [],
      loading: false,
      showCreateForm: false,
      isRemoved: false,
      edit: false,
      tableTitle: undefined,
      filterInto: undefined,
      currentPage: 1,
      total: 8,
      pageSize: 3
    }
  },
  methods: {
    handleRemove(showCreateForm, isRemoved){
      this.showCreateForm = showCreateForm
      this.isRemoved = isRemoved
    },
    reloadData(reload){
      if (reload) {
        // this.$router.go(0)
        this.$store.commit('setReloadCurrentPage', false)
        this.$nextTick(() => {
          this.$store.commit('setReloadCurrentPage', true)
        })
      }
    },
    filterData(data){
      this.menuData = filterTableTreeData([...this.tempMenuData], data) || []
    },
    resetData(data){
      this.menuData = [...this.tempMenuData]
    },
    initData(){
      this.filterInto = filterInto
      this.tableTitle = tableTitle
    },
    async getModelData(){
      this.loading = true
      const tableData = await getModelData()
      if (tableData.errorMsg){
        this.$msgAlert(tableData.errorMsg, 'error')
      } else {
        this.tempModelData = tableData.data
        this.modelData = [...this.tempModelData]
      }
      this.loading = false
    },
    hideModel(){

    },
    handleSizeChange(val){
      this.pageSize = val
      this.getTablePageData(this.currentPage, val)
    },
    handleCurrentChange(val){
      this.getTablePageData(val, this.pageSize)
    },
    getTablePageData(currentPage, pageSize){
      currentPage = currentPage && currentPage > 0 ? currentPage : 1
      pageSize = pageSize && pageSize > 0 ? pageSize : 0
      const index = (currentPage - 1) * pageSize
      const endIndex = index + pageSize
      this.tableData = []
      for (let i = index; i < this.tableDataSource.length && i < endIndex; i++){
        this.tableData.push(this.tableDataSource[i])
      }
    }
  },
  created(){
    this.initData()
    this.getModelData()
  }
}
</script>

<style lang="less">
  .model-table-data-container{
    height: 100%;
  }
</style>
