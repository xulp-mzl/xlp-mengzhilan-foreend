<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
        class="aside-container"
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        mode="vertical"
        @select="selectedItem">
      <menu-item :item-data="items"></menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import MenuItem from '@/components/menu/MenuItem'
import {getMenuItemData} from '@/js/api/menuItem'
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'AsideContainer',
  components: {
    MenuItem
  },
  data(){
    return {
      items: []
    }
  },
  created(){
    this.getMenuItemData()
  },
  methods: {
    ...mapMutations(['setMenus', 'setRoute']),

    selectedItem(index){
      if (this.$route.path !== index){
        this.$router.push(index)
      }
    },
    async getMenuItemData(){
      const tableData = await getMenuItemData()
      if (tableData.errorMsg){
        this.$msgAlert(tableData.errorMsg, 'error')
      } else {
        this.items = tableData.data
        this.setMenus(this.items)
        this.setRoute(this.$route)
      }
    }
  },
  computed: {
    ...mapGetters([
      'isCollapse',
      'activeMenu'
    ])
  },
  watch: {
    $route(val) {
      this.setRoute(val)
    }
  }
}
</script>

<style lang="less">
  .aside-container{
    &.el-menu{
      border: none;
    }
    &.el-menu--collapse{
      width: 54px;
      .el-submenu{
        text-align: center;
        .el-submenu__title{
          padding: 0 0 !important;
          .el-submenu__icon-arrow{
            display: none;
          }
          span{
            display: none;
          }
        }
      }
    }
    width: 200px;
    height: 100vh;
    box-sizing: border-box;
  }
</style>
