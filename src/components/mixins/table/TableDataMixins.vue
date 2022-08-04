<template>
  <div></div>
</template>

<script>

import {filterTableTreeData, hasFilterCondition} from '@/js/tableFilterUtils'

export default {
  name: 'TableDataMixins',
  data(){
    return {
      tableData: [],
      sourceTableData: [],
      filterTableData: [],
      loading: false,
      showCreateForm: false,
      isRemoved: true,
      tableTitle: undefined,
      filterInfo: undefined,
      // 存储选择的数据
      selections: []
    }
  },
  methods: {
    getElTable(){
      return this.$refs.tableData?.$refs.elTable
    },
    openAndCloseDialog(showCreateForm, isRemoved){
      this.showCreateForm = showCreateForm
      this.isRemoved = isRemoved
    },
    initData(filterInfo, tableTitle){
      this.filterInfo = filterInfo
      this.tableTitle = tableTitle
    },
    filterData(data){
      if (hasFilterCondition(this.tableData.length === 0 ? this.sourceTableData : this.tableData, data)){
        this.tableData = filterTableTreeData([...this.sourceTableData], data) || []
      }
    },
    resetData(data){
      if (hasFilterCondition(this.tableData.length === 0 ? this.sourceTableData : this.tableData, data)) {
        this.tableData = [...this.sourceTableData]
      }
    },
    /**
     * 验证是否选择了数据
     * @returns {boolean}
     */
    validateSelected(){
      if (!this.selections || this.selections.length === 0){
        this.$msgAlert('请选择要操作的数据！', 'error')
        return false
      }
      return true
    }
  }
}
</script>
