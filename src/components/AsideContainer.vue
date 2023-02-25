<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
        class="aside-container"
        :default-active="defaultActive"
        :collapse="isCollapse"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        @select="selectedItem">
      <menu-item :item-data="items"></menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import MenuItem from '@/components/menu/MenuItem'
import bus from '@/js/eventBus'
import util from '@/js/util'
import {getMenuItemData} from '@/js/api/menuItem'

export default {
  name: 'AsideContainer',
  components: {
    MenuItem
  },
  data(){
    return {
      defaultActive: '',
      items: [],
      clickItemFlag: false
    }
  },
  created(){
    bus.$on('changeMenuItemByTab', (itemActive) => {
      this.clickItemFlag = true
      this.defaultActive = ''

      if (itemActive.flag === 'menuItem'){
        this.selectedItem(itemActive.path)
      }
      // 处理多级子菜单不能被实时切换时的bug
      this.$nextTick(() => {
        this.defaultActive = itemActive.path
        this.scrollToSelectedItem()
      })
    })

    this.getMenuItemData()
  },
  methods: {
    selectedItem(index){
      this.clickItemFlag = true
      const item = util.findFromTree(this.items, index, 'path')
      if (item){
        this.$store.commit('setCurrentSelectedTabName', item.title)
        const menuItemInfo = {
          name: item.title,
          path: index,
          flag: 'menuItem'
        }
        this.$store.commit('setMenuItemInfo', menuItemInfo)
        this.$router.push(index)
      }
    },
    // 滚动条滚动到选择菜单的位置
    scrollToSelectedItem(){
      this.$nextTick(() => {
        const asideContainer = this.$refs.asideContainer
        const selectorDoms = asideContainer?.querySelectorAll('.el-menu-item')
        let selectedItem
        // eslint-disable-next-line no-unused-expressions
        selectorDoms?.forEach((item) => {
          const classNames = util.findDomClassName(item)
          if (classNames.indexOf('is-active') >= 0) selectedItem = item
        })

        if (selectedItem){
          // 处理菜单收起或展开时，滚动位置不准确问题
          setTimeout(function() {
            selectedItem.scrollIntoView()
          }, 200)
        }
      })
    },
    async getMenuItemData(){
      this.loading = true
      const tableData = await getMenuItemData()
      if (tableData.errorMsg){
        this.$msgAlert(tableData.errorMsg, 'error')
      } else {
        this.items = tableData.data
      }
    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.tab.isCollapse
    }
  },
  watch: {
    '$route.fullPath': {
      handler(val, oldVal) {
        const tempFlag = this.clickItemFlag
        if (!tempFlag){
          const item = util.findFromTree(this.items, val, 'path')
          if (item){
            this.defaultActive = ''
            if (!item.children || item.children.length === 0){
              this.selectedItem(val)
            }
            this.$nextTick(() => {
              this.defaultActive = val
              this.scrollToSelectedItem()
            })
          } else {
            // 延迟处理数据
            this.defaultActive = val
            setTimeout(() => {
              this.selectedItem(val)
              this.$nextTick(() => {
                this.defaultActive = val
                this.scrollToSelectedItem()
              })
              this.clickItemFlag = false
            }, 1500)
          }
        }
        this.clickItemFlag = false
      },
      immediate: true
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
    min-height: 400px;
    height: 100vh;
    box-sizing: border-box;

  }
</style>
