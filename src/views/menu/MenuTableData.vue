<template>
  <div class="menu-table-data-container">
    <common-border-table ref="tableData"
       :data="tableData"
       v-loading="loading"
       :row-key="rowKeyName"
       @row-click="handleRowClick"
       :table-title="tableTitle"
       :filterable="true"
       :filter-info="filterInfo"
       @search-data="filterData"
       @clear-data="resetData">
      <template #tableToolbar>
        <div class="table-toolbar">
          <el-button type="primary" icon="el-icon-plus" plain size="small" @click="createMenuItem">新建</el-button>
        </div>
      </template>

      <template #icon="scope">
        <i :class="scope.row.icon" v-if="scope.row.iconType === 'element-ui' && scope.row.icon"></i>
      </template>

      <template #title="scope">
        <el-radio v-model="selectedRowIndex" :label="scope.row[rowKeyName]" name="id"
                  @click.native.stop="selectRow">{{ scope.row.title }}</el-radio>
      </template>

      <template #rowOption="scope">
        <el-button @click.native.stop="deleteMenuItem(scope.row)" type="text" size="small" style="color: red;">删除</el-button>
        <el-button type="text" size="small" @click.native.stop="editMenuItem(scope.row)">编辑</el-button>
      </template>
    </common-border-table>

    <edit-menu-item-form :visible="showCreateForm" @removed="handleRemove" v-if="!isRemoved"
                         @reload-parent-table="reloadData" :item-info="edit ? selectedRow : undefined"
                         :edit="edit"
                         :parent-id="selectedRowIndex">
    </edit-menu-item-form>
  </div>
</template>

<script>

import {getMenuItemData, deleteMenuItem} from '@/js/api/menuItem'
import util from '@/js/util'
import EditMenuItemForm from '@/components/menu/EditMenuItemForm'
import CommonBorderTable from '@/components/common/CommonBorderTable'
import {tableTitle, filterInfo} from '@/js/menu/menuItem'
import TableDataMixins from '@/components/mixins/table/TableDataMixins'

export default {
  name: 'MenuTableData',
  components: {
    EditMenuItemForm,
    CommonBorderTable
  },
  mixins: [TableDataMixins],
  data(){
    return {
      selectedRowIndex: '',
      selectedRow: undefined,
      rowKeyName: 'id',
      edit: false
    }
  },
  methods: {
    async getMenuItemData(){
      this.loading = true
      const tableData = await getMenuItemData()
      if (tableData.errorMsg){
        this.$msgAlert(tableData.errorMsg, 'error')
      } else {
        this.sourceTableData = tableData.data
        this.tableData = [...this.sourceTableData]
      }
      this.loading = false
    },
    // 处理选中行的数据
    handleRowClick(row){
      if (this.selectedRowIndex == row[this.rowKeyName]){
        this.selectedRowIndex = ''
        this.selectedRow = undefined
        this.getElTable().setCurrentRow()
      } else {
        this.selectedRowIndex = row[this.rowKeyName]
        this.selectedRow = row
      }
    },
    createMenuItem(){
      this.edit = false
      this.handleRemove(true, false)
    },
    selectRow(e){
      const target = e.target
      if (this.$isInstance(target, '[object HTMLInputElement]')){
        const value = target.value
        if (this.selectedRow && value === this.selectedRowIndex){
          this.selectedRowIndex = ''
          this.selectedRow = undefined
          this.getElTable().setCurrentRow()
        } else {
          const currentSelectedRow = util.findFromTree(this.menuData, value, this.rowKeyName)
          this.selectedRowIndex = value
          this.selectedRow = currentSelectedRow
          this.getElTable().setCurrentRow(currentSelectedRow)
        }
      }
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
    /**
     * 删除菜单条目
     *
     * @param row
     */
    deleteMenuItem(row){
      this.lightAndSelectRow(row)
      if (row.children && row.children.length > 0){
        this.$msgAlert('该菜单下有子菜单， 请先删除其子菜单哦！', 'error')
        return
      }
      this.$myConfirm('删除之后不能恢复，是否继续删除？', () => {
        this._deleteMenuItem(row.id)
      })
    },
    /**
     * 编辑菜单条目
     * @param row
     */
    editMenuItem(row){
      this.lightAndSelectRow(row)
      this.edit = true
      this.handleRemove(true, false)
    },
    lightAndSelectRow(row){
      this.selectedRowIndex = row[this.rowKeyName]
      this.selectedRow = row
      this.getElTable().setCurrentRow(row)
    },
    async _deleteMenuItem(id){
      const response = await deleteMenuItem(id)
      if (response.errorMsg){
        this.$msgAlert(response.errorMsg, 'error')
      } else {
        this.$tips('数据删除成功！')
        this.reloadData(true)
      }
    }
  },
  created(){
    this.getMenuItemData()
    this.initData(filterInfo, tableTitle)
  }
}
</script>

<style lang="less">
  .menu-table-data-container{
    height: 100%;
  }
</style>
