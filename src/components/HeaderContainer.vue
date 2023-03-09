<template>
  <div id="header-container">
    <div id="header-info">
      <div class="header-left">
        <i :class="[!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold', 'icon-class']" @click="toggleSide"></i>
        <!-- 面包屑-->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="item + '-' + index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="header-right">
        <span>右侧</span>
      </div>
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
    </div>
  </div>
</template>

<script>

import bus from '@/js/eventBus'
import {mapMutations, mapGetters} from 'vuex'

export default {
  name: 'HeaderContainer',
  data(){
    return {
      editableTabsValue: '2',
      editableTabs: [{
        title: 'Tab 1',
        name: '1',
        content: 'Tab 1 content',
        path: ''
      }],
      tabIndex: 2,
      currentMenuInfo: this.$store.state.menuItemInfo
    }
  },
  methods: {
    ...mapMutations(['toggleSide']),
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
  computed: {
    ...mapGetters([
      'isCollapse',
      'breadcrumb'
    ]),
    menuItemInfo(){
      return this.$store.state.menuItemInfo
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
  }
}
</script>

<style lang="less">
  #header-container{
    height: 100%;
    #header-info {
      background-color: #545c64;
      display: flex;
      align-items: center;
      height: 60px;
      padding: 0 20px;
      border-left: 1px solid #777777;
      flex-shrink: 0;
      justify-content: space-between;

      .header-left{
        display: flex;
        align-items: center;
        .icon-class {
          color: white;
          font-size: 30px;
          cursor: pointer;
        }
        .el-breadcrumb{
          margin-left: 10px;
          .el-breadcrumb__item{
            .el-breadcrumb__inner{
              font-weight: 500;
              font-size: 12px;
              color: #cccccc;
            }
            &:last-child{
              .el-breadcrumb__inner {
                color: white;
              }
            }
          }
        }
      }
      .header-right{

      }
    }
    #tabs-info{
      height: 40px;
      background-color: #F5F7FA;
      position: relative;
      #tabs-lists{
        height: 100%;
        width: 100%;
        .el-tabs{
          border-bottom: 0;
          border-top: 0;
          .el-tabs__header{
            border-bottom: 0;
            border-top: 0;
            margin-bottom: 0;
            .el-tabs__item {
              height: 38px;
              &.is-active{
                background-color: white;
              }
            }
          }
          .el-tabs__content{
            position: relative;
            height: 0;
            display: none;
          }
        }
      }
    }
  }
</style>
