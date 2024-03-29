<template>
  <div></div>
</template>

<script>

import TableDataMixins from '@/components/mixins/table/TableDataMixins'
import {filterTableData, hasFilterCondition} from '@/js/tableFilterUtils'

export default {
  name: 'PaginationTableDataMixins',
  mixins: [TableDataMixins],
  data(){
    return {
      currentPage: 1,
      total: 0,
      pageSize: 10
    }
  },
  methods: {
    filterData(data, currentPage){
      if (hasFilterCondition(this.tableData.length === 0 ? this.sourceTableData : this.tableData, data)) {
        this.filterTableData = filterTableData([...this.sourceTableData], data) || []
        this.currentPage = currentPage || 1
        this.total = this.filterTableData.length
        this.getTablePageData(this.currentPage, this.pageSize)
      }
    },
    resetData(data){
      if (hasFilterCondition(this.tableData.length === 0 ? this.sourceTableData : this.tableData, data)) {
        this.filterTableData = [...this.sourceTableData]
        this.currentPage = 1
        this.total = this.filterTableData.length
        this.getTablePageData(this.currentPage, this.pageSize)
      }
    },
    /**
     * 每页数据大小发生改变，调用该函数
     *
     * @param val
     */
    handleSizeChange(val){
      this.pageSize = val
      this.getTablePageData(this.currentPage, val)
    },
    /**
     * 当前页序号发生改变，调用该方法
     *
     * @param val
     */
    handleCurrentPageChange(val){
      this.getTablePageData(val, this.pageSize)
    },

    /**
     * 获取分页的数据
     * @param currentPage
     * @param pageSize
     */
    getTablePageData(currentPage, pageSize){
      currentPage = currentPage && currentPage > 0 ? currentPage : 1
      pageSize = pageSize && pageSize > 0 ? pageSize : 0
      const length = this.filterTableData.length
      let index = (currentPage - 1) * pageSize
      // 处理数据删除时，当前页序号大于实际页序号的问题
      if (index >= length && currentPage > 0){
        this.currentPage = currentPage - 1
        index = (this.currentPage - 1) * pageSize
      }
      const endIndex = index + pageSize
      this.tableData = []

      for (let i = index; i < this.filterTableData.length && i < endIndex; i++){
        this.tableData.push(this.filterTableData[i])
      }
    },
    /**
     * 数据选择变化是调用该函数
     * @param selection
     */
    handleSelectionChange(selection){
      this.selections = selection
    },
    /**
     * 点击谋行时，调用该函数，并只选中点击的那行
     */
    handleRowClick(row){
      const elTable = this.getElTable()
      elTable.clearSelection()
      elTable.toggleRowSelection(row, true)
      elTable.setCurrentRow(row)
    },
    /**
     * 用远程的数据初始化表格数据
     *
     * @param fromRemoteData
     */
    initTableData(fromRemoteData){
      if (fromRemoteData){
        this.sourceTableData = fromRemoteData
        this.filterTableData = [...this.sourceTableData]
        this.total = this.filterTableData.length
        this.getTablePageData(this.currentPage, this.pageSize)
      }
    },
    /**
     * 重新刷新当前页
     */
    refreshPage(){
      const $table = this.$refs.tableData
      if ($table){
        this.filterData($table.getFilterData(), this.currentPage)
      }
    }
  }
}
</script>
