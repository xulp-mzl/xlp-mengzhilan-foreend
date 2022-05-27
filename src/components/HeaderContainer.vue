<template>
  <div id="header-container">
    <div id="header-info">
      <i :class="[collapsed ? 'el-icon-s-fold' : 'el-icon-s-unfold', 'icon-class']" @click="toggleSide"></i>
    </div>
    <div id="tabs-info">
      <div id="tabs-lists">
        <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab" @tab-click="selectTab">
          <el-tab-pane  v-for="item in editableTabs"
                       :key="item.name"
                       :label="item.title"
                       :name="item.name"
                       :closable="item.closable"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
      <div id="tab-option"></div>
    </div>
  </div>
</template>

<script>

import bus from '@/js/eventBus'

export default {
  name: 'HeaderContainer',
  props: ['collapsed'],
  data(){
    return {
      editableTabsValue: '2',
      editableTabs: [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content',
        path: ''
      }, {
        title: 'Tab 2',
        name: '2',
        content: 'Tab 2 content',
        path: ''
      }],
      tabIndex: 2,
      currentMenuInfo: this.$store.state.menuItemInfo
    }
  },
  methods: {
    toggleSide(){
      // 子向父传值，自定义事件 ，第一个值事件名称，第二个值事件参数
      this.$emit('toggleSide', !this.collapsed)
    },
    addTabFromMenuItem(menuItemInfo){
      const newTabName = menuItemInfo.name
      // eslint-disable-next-line no-unused-vars
      const item = this.editableTabs.find(item => {
        return item.name === newTabName
      })
      if (!item){
        this.editableTabs.push({
          title: newTabName,
          name: newTabName,
          content: '',
          path: menuItemInfo.path,
          flag: menuItemInfo.flag,
          closable: true
        })
      }
      this.editableTabsValue = newTabName
    },
    removeTab(targetName) {
      const tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      this.changeTab(activeName)
    },
    selectTab(tab){
      if (this.$store.state.currentSelectedTabName !== tab.label){
        this.changeTab(tab.label)
      }
    },
    changeTab(name){
      const item = this.editableTabs.find(item => {
        return item.name === name
      })
      if (item){
        this.$store.commit('setCurrentSelectedTabName', name)
        bus.$emit('changeMenuItemByTab', item)
      }
    }
  },
  watch: {
    menuItemInfo: {
      handler(newVal, oldVal){
        if (newVal && newVal.name){
          this.addTabFromMenuItem(newVal)
        }
      },
      immediate: true,
      // 监听对象属性变化
      deep: true
    }
  },
  computed: {
    menuItemInfo(){
      return this.$store.state.menuItemInfo
    }
  }
}
</script>

<style lang="less">
  #header-container{
    height: 100%;
    #header-info {
      background-color: aqua;
      display: flex;
      align-items: center;
      height: 60px;
      .icon-class {
        color: black;
        font-size: 30px;
        cursor: pointer;
      }
      padding: 0 20px;
    }
    #tabs-info{
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      background-color: #F5F7FA;
      position: relative;
      #tabs-lists{
        .calcWidth(150px);
        .el-tabs{
          border-bottom: 0;
          border-top: 0;
          .el-tabs__header{
            border-bottom: 0;
            border-top: 0;
            margin-bottom: 0;
          }
        }
        .el-tabs__item {
          height: 38px;
        }

        .el-tabs__item.is-active{
          background-color: white;
        }
        .el-tabs__content{
          position: relative;
          height: 0;
          display: none;
        }
      }
      #tab-option{
        width: 150px;
        height: 100%;
        background-color: aquamarine;
        position: absolute;
        right: 20px;
        top: 0;
      }
    }
  }
</style>
