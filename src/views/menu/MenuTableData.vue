<template>
  <div class="menu-table-data-container">
    <common-border-table ref="tableData"
                         :data="menuData"
                         :default-expand-all="true"
                         v-loading="loading"
                         style="width: 100%"
                         :tree-props="{children: 'children'}"
                         :row-key="rowKeyName"
                         highlight-current-row
                         header-row-class-name="custom-table-header"
                         @row-click="handleRowClick">
      <template #tableToolbar>
        <el-button type="primary" icon="el-icon-plus" plain size="small" @click="createMenuItem">新建</el-button>
      </template>
      <el-table-column prop="title" label="名称" width="200" min-width="30" show-overflow-tooltip>
        <template #default="scope">
          <el-radio v-model="selectedRowIndex" :label="scope.row[rowKeyName]" name="id"
                    @click.native.stop="selectRow">{{ scope.row.title }}</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由">
      </el-table-column>
      <el-table-column prop="iconType" label="图标类型" >
      </el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="60">
        <template #default="scope">
          <i :class="scope.row.icon" v-if="scope.row.iconType === 'element-ui' && scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="排序号">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button @click.native.stop="deleteMenuItem(scope.row)" type="text" size="small" style="color: red;">删除</el-button>
          <el-button type="text" size="small" @click.native.stop="editMenuItem(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
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

export default {
  name: 'MenuTableData',
  components: {
    EditMenuItemForm,
    CommonBorderTable
  },
  data(){
    return {
      menuData: [],
      loading: false,
      selectedRowIndex: '',
      selectedRow: undefined,
      rowKeyName: 'id',
      showCreateForm: false,
      isRemoved: false,
      edit: false
    }
  },
  methods: {
    getElTable(){
      return this.$refs.tableData.$refs.elTable
    },
    async getMenuItemData(){
      this.loading = true
      const tableData = await getMenuItemData()
      if (tableData.errorMsg){
        this.$msgAlert(tableData.errorMsg, 'error')
      } else {
        this.menuData = tableData.data
      }
      this.loading = false
    },
    // 处理选中行的数据
    handleRowClick(row){
      console.log(1234)
      // eslint-disable-next-line eqeqeq
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
      if (Object.prototype.toString.call(target) === '[object HTMLInputElement]'){
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
  }
}
</script>

<style lang="less">
  .menu-table-data-container{
    height: 100%;
  }
</style>
