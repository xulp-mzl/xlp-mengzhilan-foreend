<template>
  <div id="aside-container" ref="asideContainer">
    <el-menu :default-active="defaultActive" :collapse="collapsed" unique-opened @select="selectedItem">
      <menu-item :item-data="items"></menu-item>
    </el-menu>
  </div>
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
  props: ['collapsed'],
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
  watch: {
    '$route.fullPath': {
      handler(val) {
        const tempFlag = this.clickItemFlag
        if (!tempFlag){
          const item = util.findFromTree(this.items, val, 'path')
          if (item){
            this.defaultActive = ''
            if (!item.children){
              this.selectedItem(val)
            }
            this.$nextTick(() => {
              this.defaultActive = val
              this.scrollToSelectedItem()
            })
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
  #aside-container{
    width: 100%;
    position: relative;
    .el-menu--collapse .el-submenu>.el-submenu__title .el-submenu__icon-arrow{
      display: none;
    }
    .el-menu--collapse .el-menu-item span, .el-menu--collapse .el-submenu>.el-submenu__title span {
      height: 0;
      width: 0;
      overflow: hidden;
      visibility: hidden;
      display: inline-block;
    }
  }
</style>
