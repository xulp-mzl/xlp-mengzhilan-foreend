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
      isRemoved: false,
      tableTitle: undefined,
      filterInto: undefined
    }
  },
  methods: {
    getElTable(){
      return this.$refs.tableData?.$refs.elTable
    },
    handleRemove(showCreateForm, isRemoved){
      this.showCreateForm = showCreateForm
      this.isRemoved = isRemoved
    },
    initData(filterInto, tableTitle){
      this.filterInto = filterInto
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
    }
  }
}
</script>
