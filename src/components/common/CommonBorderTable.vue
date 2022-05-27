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
        <slot></slot>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CommonBorderTable',
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
