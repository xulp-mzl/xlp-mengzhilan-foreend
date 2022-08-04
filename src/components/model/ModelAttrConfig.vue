<template>
  <common-dialog :dialog-title="'【' + modelInfo.beanId + '】模型属性信息'"
                 :visible.sync="visible"
                 width="85%"
                 :before-close="handleBeforeClose"
                 :class="[loading ? 'overflow-hidden' : '', 'base-config-dialog']">
    <template #body>
      <common-border-table-with-page ref="tableData"
             :data="tableData"
             :table-title="tableTitle"
             :filterable="true"
             :filter-info="filterInfo"
             type="selection"
             :row-option-width="200"
             :current-page.sync="currentPage"
             :total="total"
             :table-height-fixed="false"
             :page-size="pageSize"
             @search-data="filterData"
             @clear-data="resetData"
             @size-change="handleSizeChange"
             @current-page-change="handleCurrentPageChange"
             @selection-change="handleSelectionChange"
             @row-click="handleRowClick"
             :default-style="{width: '100%', height: 'auto'}">

        <template #tableToolbar>
          <div class="table-toolbar">
            <el-button type="primary" icon="el-icon-plus" plain size="small"
                   @click="addExtField" v-if="canAddExtAttr">添加扩展字段</el-button>
            <el-button type="primary" icon="el-icon-setting" plain size="small"
                       @click="batchSetting">批量配置模型属性</el-button>
            <el-button type="primary" icon="el-icon-delete" plain size="small"
                       @click="batchDelete" v-if="canAddExtAttr">批量删除</el-button>
            <el-button type="primary" icon="el-icon-edit-outline" plain size="small"
                       @click="batchDeletePublish" v-if="canAddExtAttr">批量发布</el-button>
          </div>
        </template>

        <template #attributeType="scope">
          <div v-if="scope && scope.row && scope.row.attributeType === 'HARD_ATTR'">硬属性</div>
          <div v-if="scope && scope.row && scope.row.attributeType === 'EXTEND_ATTR'" style="color: chartreuse;">扩展属性</div>
        </template>

        <template #rowOption="scope">
          <el-button type="text" size="small" @click.native.stop="editModelAttr(scope.row)">编辑</el-button>
          <div v-if="scope.row && (scope.row.canDelete === true || scope.row.canDelete === 'true')"
               style="display: inline-block; margin-left: 10px;">
            <el-button type="text" size="small" @click.native.stop="deleteModelAttr(scope.row.attrId)" style="color: red;">删除</el-button>
            <el-button type="text" size="small" @click.native.stop="deleteModelAttr(scope.row)" style="color: lightgreen;">发布</el-button>
          </div>
        </template>
      </common-border-table-with-page>

      <model-attr-config-form
          :visible="showCreateForm"
          :model-id="modelInfo.beanId"
          :attr-id="attrId"
          :attr-name="attrName"
          :form-field-type="formFieldType"
          :is-add="isAdd"
          @removed="openAndCloseDialog"
          @reload-parent-table="reloadData"
          v-if="!isRemoved">
      </model-attr-config-form>
    </template>
  </common-dialog>
</template>

<script>

import FormMixins from '@/components/mixins/form/FormMixins'
import CommonBorderTableWithPage from '@/components/common/CommonBorderTableWithPage'
import PaginationTableDataMixins from '@/components/mixins/table/PaginationTableDataMixins'
import CommonDialog from '@/components/common/CommonDialog'
import {tableTitle, filterInfo} from '@/js/model/modelField'
import {getModelAttrs, batchSetting, deleteAttrs} from '@/js/api/modelAttr'
import ModelAttrConfigForm from '@/components/model/ModelAttrConfigForm'

export default {
  name: 'ModelAttrConfig',
  mixins: [FormMixins, PaginationTableDataMixins],
  components: {
    CommonDialog,
    CommonBorderTableWithPage,
    ModelAttrConfigForm
  },
  props: {
    /**
     * 模型信息
     */
    modelInfo: {
      default: () => {},
      type: Object
    }
  },
  data(){
    return {
      canAddExtAttr: false,
      pageSize: 50,
      attrId: '',
      attrName: '',
      isAdd: false,
      formFieldType: ''
    }
  },
  methods: {
    addExtField(){
      this.isAdd = true
      this.attrId = undefined
      this.attrName = undefined
      this.formFieldType = undefined
      this.openAndCloseDialog(true, false)
    },
    async getAllAttrs(){
      this.loading = true
      const appLoading = this.$appLoading(null, '.base-config-dialog .el-dialog')
      const response = await getModelAttrs(this.modelInfo.beanId)
      if (response.errorMsg){
        this.$msgAlert(response.errorMsg, 'error')
      } else {
        this.initTableData(response.data)
      }
      this.loading = false
      appLoading.close()
    },
    editModelAttr(row){
      this.isAdd = false
      this.handleRowClick(row)
      this.attrId = row.attrId
      this.attrName = row.attrName
      this.formFieldType = row.formFieldType
      this.openAndCloseDialog(true, false)
    },
    /**
     * 批量设置模型属性配置信息
     */
    async batchSetting(){
      if (!this.validateSelected()) return
      // eslint-disable-next-line no-unused-vars
      const appLoading = this.$appLoading()
      let attrIds = []
      this.selections.forEach((item) => {
        attrIds.push(item.attrId)
      })
      attrIds = attrIds.join(',')
      batchSetting(this.modelInfo.beanId, attrIds)
        .then((data) => {
          if (data.code !== 200 && data.errorMsg){
            this.$msgAlert(data.errorMsg, 'error')
            return
          }
          this.$tips('批量设置成功！')
          // 清除已有的选择
          // eslint-disable-next-line no-unused-expressions
          this.getElTable()?.clearSelection()
          appLoading.close()
        }).catch(() => {
          this.$msgAlert('批量设置模型属性信息失败！', 'error')
          appLoading.close()
        })
    },
    async reloadData(isRefreshed){
      if (isRefreshed === true){
        await this.getAllAttrs()
        this.refreshPage()
      }
    },
    /**
     * 删除属性
     */
    deleteModelAttr(attrIds){
      this.$myConfirm('确定删除该属性？', async() => {
        const $appLoading = this.$appLoading('正在删除中，请稍后。。。')
        const response = await deleteAttrs(this.modelInfo.beanId, attrIds)
        if (response.errorMsg){
          this.$msgAlert(response.errorMsg, 'error')
        } else {
          this.$tips('数据删除成功！')
          this.reloadData(true)
        }
        $appLoading.close()
      })
    },
    /**
     * 批量删除属性
     */
    batchDelete(){
      if (!this.validateSelected()) return
      if (this.selections.some((item) => !item.canDelete)){
        this.$msgAlert('不能选择不能删除的属性进行删除，请重新选择数据！', 'error')
        return
      }
      const attrIds = []
      this.selections.forEach((item) => attrIds.push(item.attrId))
      this.deleteModelAttr(attrIds.join(','))
    },
    /**
     * 批量发布属性
     */
    batchDeletePublish(){
      if (!this.validateSelected()) return
      if (this.selections.some((item) => !item.canDelete)){
        this.$msgAlert('只能选择能删除的属性进行发布，请重新选择数据！', 'error')
        return
      }
      const attrIds = []
      this.selections.forEach((item) => attrIds.push(item.attrId))
    }
  },
  created(){
    this.canAddExtAttr = this.modelInfo.canExtend
    this.initData(filterInfo, tableTitle)
  },
  mounted(){
    this.getAllAttrs()
  }
}
</script>

<style>
  .el-dialog__body{
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
