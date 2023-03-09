<template>
  <el-container>
    <el-aside width="auto">
      <aside-container v-if="$store.state.reloadCurrentPage"></aside-container>
    </el-aside>
    <el-container>
      <el-header height="100px">
        <header-container></header-container>
      </el-header>
      <el-main>
        <main-container v-if="$store.state.reloadCurrentPage"></main-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import AsideContainer from '@/components/AsideContainer'
import HeaderContainer from '@/components/HeaderContainer'
import MainContainer from '@/components/MainContainer'

export default {
  name: 'Main',
  components: {AsideContainer, HeaderContainer, MainContainer},
  data(){
    return {}
  },
  methods: {
  }
}
</script>

<style lang="less">
  .el-container{
    .el-header {
      padding: 0;
    }
    .el-container{
      height: 100vh;
      max-height: 100vh;
      overflow-y: auto;
    }
  }
</style>
