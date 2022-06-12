<template>
  <div class="model-table-data-container">
    <common-border-table ref="tableData"
       :data="modelData"
       v-loading="loading"
      :table-title="tableTitle"
      :filterable="true"
      :filter-into="filterInto"
      @search-data="filterData"
      @clear-data="resetData"
      type="index"
      :row-option-width="350">

      <template #rowOption="scope">
        <el-button @click.native.stop="deleteMenuItem(scope.row)" type="text" size="small" style="color: red;">删除</el-button>
        <el-button type="text" size="small" @click.native.stop="editMenuItem(scope.row)">编辑</el-button>
      </template>
    </common-border-table>

   <!-- <edit-menu-item-form :visible="showCreateForm" @removed="handleRemove" v-if="!isRemoved"
                         @reload-parent-table="reloadData" :item-info="edit ? selectedRow : undefined"
                         :edit="edit"
                         :parent-id="selectedRowIndex">
    </edit-menu-item-form>-->
  </div>
</template>

<script>

import CommonBorderTable from '@/components/common/CommonBorderTable'
import {tableTitle, filterInto} from '@/js/model/model'
import {filterTableTreeData} from '@/js/tableFilterUtils'

export default {
  name: 'MenuTableData',
  components: {
    CommonBorderTable
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
      filterInto: undefined
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
    }
  },
  created(){
    this.initData()
  }
}
</script>

<style lang="less">
  .model-table-data-container{
    height: 100%;
  }
</style>
