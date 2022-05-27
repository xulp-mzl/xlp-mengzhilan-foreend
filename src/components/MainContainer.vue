<template>
  <div id="main-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'MainContainer'
}
</script>

<style scoped lang="less">
  #main-container{
    position: relative;
    left: 0;
    top: 0;
    height: 100%;
  }
</style>
