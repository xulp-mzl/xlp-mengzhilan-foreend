<template>
  <div class="menu-table-data">
    <div class="table-option-area">
      <el-button type="primary" icon="el-icon-plus" plain size="small" @click="createMenuItem">新建</el-button>
    </div>
    <div class="table-data-container" ref="tableDataContainer">
      <el-table ref="tableData"
          :data="menuData" border
          :default-expand-all="true"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width: 100%"
          :tree-props="{children: 'children'}"
          :row-key="rowKeyName"
          highlight-current-row
          header-row-class-name="custom-table-header"
          tooltip-effect="light"
          :max-height="maxHeight"
          @row-click="handleRowClick"
      >
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
      </el-table>
    </div>

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

export default {
  name: 'MenuTableData',
  components: {
    EditMenuItemForm
  },
  data(){
    return {
      menuData: [],
      loading: false,
      selectedRowIndex: '',
      selectedRow: undefined,
      maxHeight: 200,
      rowKeyName: 'id',
      showCreateForm: false,
      isRemoved: false,
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
        this.menuData = tableData.data
      }
      this.loading = false
    },
    getTableHeight(){
      this.maxHeight = this.$refs.tableDataContainer.offsetHeight
    },
    // 处理选中行的数据
    handleRowClick(row){
      console.log(1234)
      // eslint-disable-next-line eqeqeq
      if (this.selectedRowIndex == row[this.rowKeyName]){
        this.selectedRowIndex = ''
        this.selectedRow = undefined
        this.$refs.tableData.setCurrentRow()
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
          this.$refs.tableData.setCurrentRow()
        } else {
          const currentSelectedRow = util.findFromTree(this.menuData, value, this.rowKeyName)
          this.selectedRowIndex = value
          this.selectedRow = currentSelectedRow
          this.$refs.tableData.setCurrentRow(currentSelectedRow)
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
      this.$refs.tableData.setCurrentRow(row)
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
  },
  mounted() {
    this.$nextTick(() => {
      this.maxHeight = this.$refs.tableDataContainer.offsetHeight
    })
    window.addEventListener('resize', this.getTableHeight)
  },
  destroyed() {
    window.removeEventListener('resize', this.getTableHeight)
  }
}
</script>

<style lang="less">
  .menu-table-data{
    height: 100%;
    .table-option-area{
      height: 50px;
      line-height: 50px;
      width: 100%;
      overflow: hidden;
    }
    .table-data-container{
      .calcHeight(50px);
      .el-table{
        .custom-table-header/*, .odd-row-class-name*/{
          .el-table__cell{
            background-color: #e7e7e7;
          }
        }
        .el-table__cell{
          .cell{
            overflow: hidden;/*超出部分隐藏*/
            white-space: nowrap;/*不换行*/
          }
        }
      }
    }
  }
</style>
