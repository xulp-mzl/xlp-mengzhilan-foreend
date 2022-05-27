<template>
  <el-dialog v-bind="$attrs"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             v-on="$listeners">
    <template #title>
      <slot name="title"></slot>
    </template>

    <slot name="body"></slot>

    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'CommonDialog'
}
</script>

<style lang="less">
  .el-dialog__wrapper{
    height: 100%;
    overflow: hidden !important;
    .el-dialog{
      .calcMaxHeight(40px);
      overflow-y: auto;
      margin-bottom: 10px !important;
      margin-top: 30px !important;
      position: relative;
      .el-dialog__header{
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        background-color: white;
        z-index: 99;
      }
      .el-dialog__footer {
        padding-bottom: 10px;
        position: -webkit-sticky;
        position: sticky;
        bottom: 0;
        z-index: 100;
        background-color: white;
      }
    }
  }
</style>
