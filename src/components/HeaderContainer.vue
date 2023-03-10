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
          <el-tab-pane  v-for="item in tabList"
                        :key="item.id"
                        :label="item.title"
                        :name="item.path"
                        :closable="true"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>

import {mapMutations, mapGetters} from 'vuex'

export default {
  name: 'HeaderContainer',
  data(){
    return {
      editableTabsValue: ''
    }
  },
  methods: {
    ...mapMutations(['toggleSide', 'removeTabInStore']),

    // 移除tab
    removeTab(targetName) {
      this.removeTabInStore(targetName)
      if (targetName === this.editableTabsValue){
        this.$router.push(this.currentTab.path)
      }
    },

    // 切换Tab页，进行路由跳转
    selectTab(tab){
      const oldEditableTabsValue = this.currentTab.path
      if (tab.name !== oldEditableTabsValue){
        this.$router.push(tab.name)
      }
    }
  },
  computed: {
    ...mapGetters([
      'isCollapse',
      'breadcrumb',
      'tabList',
      'currentTab'
    ])
  },
  watch: {
    currentTab: {
      handler(newVal){
        this.editableTabsValue = newVal.path
      },
      immediate: true
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
                border-bottom: 0;
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
