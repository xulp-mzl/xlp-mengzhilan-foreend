<template>
  <common-dialog :title="edit ? '编辑菜单' : '新建菜单'" :visible.sync="visible"
        :before-close="handleBeforeClose">

    <template #body>
      <el-form :model="itemInfo" label-width="100px" ref="form" size="medium">
        <el-form-item label="菜单名称："
                      prop="title"
                      :rules="[
                { required: true, message: '菜单名称不能为空'},
              ]"
        >
          <el-input v-model="itemInfo.title" autocomplete="off" placeholder="请输菜单名称" class="custom-input"></el-input>
        </el-form-item>

        <el-form-item label="路由地址："
            prop="path">
          <el-input v-model="itemInfo.path" autocomplete="off" placeholder="请输入路由地址" class="custom-input"></el-input>
        </el-form-item>

        <el-form-item label="图标类型：" prop="iconType">
          <el-select v-model="itemInfo.iconType" placeholder="请选择图标类型">
            <el-option label="" value=""></el-option>
            <el-option label="element-ui" value="element-ui"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图标描述：" prop="icon">
          <el-input v-model="itemInfo.icon" autocomplete="off" placeholder="图标描述" class="custom-input"></el-input>
        </el-form-item>

        <el-form-item
            label="排序号："
            prop="weight"
            :rules="[{ type: 'number', message: '排序号必须为数字值'}]"
        >
          <el-input v-model.number="itemInfo.weight" autocomplete="off" class="custom-input" ></el-input>
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <div class="dialog-footer" style="padding-right: 20%;">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="saveAndEdit" :disabled="disabled">保存</el-button>
        <el-button type="info" @click="resetForm($refs.form)">重置</el-button>
      </div>
    </template>
  </common-dialog>
</template>

<script>

import CommonDialog from '@/components/common/CommonDialog'
import {saveMenuItemData} from '@/js/api/menuItem'
import FormMixins from '@/components/mixins/form/FormMixins'

export default {
  name: 'EditMenuItemForm',
  components: {
    CommonDialog
  },
  mixins: [FormMixins],
  props: {
    edit: {
      default: false,
      type: Boolean
    },
    itemInfo: {
      default: () => {
        return {
          id: null,
          path: '',
          iconType: '',
          icon: '',
          weight: 0,
          parentId: null,
          title: ''
        }
      },
      type: Object
    },
    parentId: {
      default: null,
      type: [Number, String]
    }
  },
  data(){
    return {
      disabled: false
    }
  },
  methods: {
    saveAndEdit(){
      const canSave = this.validateForm(this.$refs.form)
      if (canSave){
        this.itemInfo.parentId = this.parentId
        this.disabled = true;
        (async function(_this){
          const data = await saveMenuItemData(_this.itemInfo, _this.edit ? 'put' : 'post')
          _this.disabled = false
          if (data.errorMsg){
            _this.$msgAlert(data.errorMsg, 'error')
            return
          }
          _this.$emit('reload-parent-table', true)
          _this.closeDialog()
          _this.$tips('数据保存成功！')
        }(this))
      } else {
        this.$msgAlert('请按要求填好表格数据后，再提交！', 'error')
      }
    }
  }
}
</script>

<style lang="less">
  .el-dialog__body{
    .el-form{
      .custom-input{
        .el-input__inner{
          width: 60%;
        }
      }
      .el-select--medium{
        width: 60%;
      }
    }
  }
</style>
