<template>
  <div class="menu-table-data">
    <div class="table-option-area">
      <slot name="tableToolbar"></slot>
    </div>
    <div class="table-data-container" ref="tableDataContainer">
      <el-table border ref="elTable"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                tooltip-effect="light"
                :max-height="maxHeight"
                v-bind="$attrs"
                v-on="$listeners"
      >
        <el-table-column
            type="index"
            width="50" v-if="type === 'index'">
        </el-table-column>
        <el-table-column
            type="selection"
            width="50" v-if="type === 'selection'">
        </el-table-column>
        <el-table-column v-for="item in tableTitle" :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          show-overflow-tooltip
          :fixed="item.fixed"
          :sortable="item.sortable"
          :align="item.align"
          :class-name="item.className"
          :label-class-name="item.labelClassName">
          <template #default="scope" v-if="item.icon || item.slot">
            <i class="item.icon" v-if="item.icon"></i>
            <span style="margin-left: 5px" v-if="item.icon && !item.slot">{{ scope.row[item.prop] }}</span>
            <slot :name="item.prop" :row="scope.row" v-if="item.slot"></slot>
          </template>
        </el-table-column>
        <slot></slot>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CommonBorderTable',
  props: {
    tableTitle: {
      default: () => {
        return [ /* {
          label: '', // 标题名称
          prop: '', // 字段名称
          width: undefined, // 列宽
          icon: undefined, // 列的前缀图形类名，暂时只支持element-ui图标
          minWidth: undefined, // 列最小宽度
          fixed: undefined, // 是否固定
          sortable: false, // 是否可排序
          align: 'left', // 列类容位置
          className: undefined, // 列的 className
          labelClassName: undefined, // 当前列标题的自定义类名
          slot: false // 是否添加自定义内容 false, true, slot名称为prop
        } */]
      },
      type: Array
    },
    // 对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；
    // 如果设置了 expand 则显示为一个可展开的按钮
    type: {
      type: String,
      default: undefined
    }
  },
  data(){
    return {
      maxHeight: 200
    }
  },
  methods: {
    getTableHeight(){
      this.maxHeight = this.$refs.tableDataContainer.offsetHeight
    }
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
