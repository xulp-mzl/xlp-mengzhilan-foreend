<template>
  <div class="menu-table-data-container">
    <common-border-table ref="tableData"
       :data="menuData"
       v-loading="loading"
       :row-key="rowKeyName"
       @row-click="handleRowClick"
      :table-title="tableTitle"
      :filterable="true"
      :filter-into="filterInto">
      <template #tableToolbar>
        <el-button type="primary" icon="el-icon-plus" plain size="small" @click="createMenuItem">新建</el-button>
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
      edit: false,
      tableTitle: [
        {
          label: '名称', // 标题名称
          prop: 'title', // 字段名称
          width: 200, // 列宽
          minWidth: 30, // 列最小宽度
          slot: true, // 是否添加自定义内容 false, true, slot名称为prop
          treeNode: true // 树节点
        },
        {
          label: '路由', // 标题名称
          prop: 'path' // 字段名称
        },
        {
          label: '图标类型', // 标题名称
          prop: 'iconType' // 字段名称
        },
        {
          label: '图标', // 标题名称
          prop: 'icon', // 字段名称
          width: 60, // 列宽
          align: 'center',
          slot: true // 是否添加自定义内容 false, true, slot名称为prop
        },
        {
          label: '排序号', // 标题名称
          prop: 'weight', // 字段名称
          sortable: true // 是否可排序
        },
        {
          label: '创建时间', // 标题名称
          prop: 'createTime', // 字段名称
          width: 200 // 列宽
        }
      ],
      filterInto: {
        createTime: { // 字段名称
          propType: 'datetime', // 字段类型，用来创建搜索框的类型
          value: undefined, // 过滤框为下拉选择框时，输入值[label: 显示文本, value: 值]
          defaultValue: undefined, // 默认过滤值
          slot: false // 是否添加自定义内容 false, true, slot名称为prop
        },
        iconType: {
          propType: 'multSelect', // 字段类型，用来创建搜索框的类型
          value: [{label: 'element-ui', value: 'element-ui'}], // 过滤框为下拉选择框时，输入值[label: 显示文本, value: 值]
          defaultValue: 'element-ui'
        },
        path: {
          defaultValue: 'element-ui'
        },
        title: {
          defaultValue: ['element-ui']
        }
      }
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
