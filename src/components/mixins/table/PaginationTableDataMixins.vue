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
    filterData(data){
      if (hasFilterCondition(this.tableData.length === 0 ? this.filterTableData : this.tableData, data)) {
        this.filterTableData = filterTableData([...this.sourceTableData], data) || []
        this.currentPage = 1
        this.total = this.filterTableData.length
        this.getTablePageData(this.currentPage, this.pageSize)
      }
    },
    resetData(data){
      if (hasFilterCondition(this.tableData.length === 0 ? this.filterTableData : this.tableData, data)) {
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
      console.log(this.currentPage)
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
      const index = (currentPage - 1) * pageSize
      const endIndex = index + pageSize
      this.tableData = []
      for (let i = index; i < this.filterTableData.length && i < endIndex; i++){
        this.tableData.push(this.filterTableData[i])
      }
    }
  }
}
</script>
