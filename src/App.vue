<template>
  <div id="app">
    <el-container>
      <el-aside :class="[collapsed ? 'side-content-extend' : 'side-content-unextend']" width="200px">
        <aside-container :collapsed="!collapsed" v-if="$store.state.reloadCurrentPage"></aside-container>
      </el-aside>
      <el-container>
        <el-header height="100px">
          <header-container :collapsed="collapsed" @toggleSide="toggleSide"></header-container>
        </el-header>
        <el-main>
          <main-container v-if="$store.state.reloadCurrentPage"></main-container>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AsideContainer from '@/components/AsideContainer'
import HeaderContainer from '@/components/HeaderContainer'
import MainContainer from '@/components/MainContainer'

export default {
  name: 'app',
  components: {AsideContainer, HeaderContainer, MainContainer},
  data(){
    return {
      collapsed: true
    }
  },
  methods: {
    toggleSide(val){
      this.collapsed = val
    }
  }
}
</script>

<style lang="less">
  html, body{
    height: 100%;
  }
  #app{
    height: 100%;
    position: relative;
    top: 0;
    left: 0;
    &>.el-container{
      height: 100%;
      &>.el-aside{
        /*高度占满全屏*/
        height: 100vh;
        background: #fbebca;
        overflow-y: auto;
        overflow-x: hidden;
      }
      &>.side-content-extend{
        transition: all 0.4s;
        width: 200px !important;
      }
      &>.side-content-unextend{
        transition: all 0.4s;
        width: 65px !important;
      }
      &>.el-container {
        height: 100%;
      }
    }

    .el-header{
      padding: 0;
    }

    .el-main{
      flex-shrink: 0;
      height: -moz-calc(100% - 100px);
      height: -webkit-calc(100% - 100px);
      height: -o-calc(100% - 100px);
      height: -ms-calc(100% - 100px);
      height: calc(100% - 100px);
      overflow-y: auto;
      padding-top: 0;
    }
  }
</style>
