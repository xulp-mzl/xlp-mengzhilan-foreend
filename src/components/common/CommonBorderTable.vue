<template>
  <div class="table-outer-container" ref="outerContainer">
    <div class="table-option-area" ref="toolbar">
      <slot name="tableToolbar"></slot>
    </div>
    <div class="table-data-container">
      <el-table border ref="elTable"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        tooltip-effect="light"
        :max-height="maxHeight"
        :header-row-class-name="setTableHeaderClass"
        v-bind="$attrs"
        v-on="$listeners"
        :default-expand-all="expandAll"
        :style="defaultStyle"
        :highlight-current-row="highlightCurrentRow">

        <el-table-column label="序号"
                         type="index"
                         :width="filterable ? 100 : 80" align="center" fixed v-if="type == 'index'"
                         :resizable="!filterable">
          <el-table-column label-class-name="custom-column" v-if="filterable" type="index"
                           width="100" align="center" fixed :resizable="false">
            <template #header>
              <el-button icon="el-icon-search" circle size="mini" type="primary" plain @click.native.stop="searchData"></el-button>
              <el-button type="info" icon="el-icon-delete" circle size="mini" plain @click.native.stop="clearData"></el-button>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column
            type="selection" align="center"
            :width="filterable ? 100 : 50" v-if="type === 'selection'" fixed="left"
            :resizable="!filterable">
          <el-table-column label-class-name="custom-column" v-if="filterable" fixed="left"
                           width="100" align="center" :resizable="false">
            <template #header>
              <el-button icon="el-icon-search" circle size="mini" type="primary" plain @click.native.stop="searchData"></el-button>
              <el-button type="info" icon="el-icon-delete" circle size="mini" plain @click.native.stop="clearData"></el-button>
            </template>
            <el-table-column label-class-name="custom-column custom-hidden-column" type="selection"
                             width="100" align="center">
            </el-table-column>
          </el-table-column>
        </el-table-column>

        <el-table-column v-for="item in tableTitle" :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : undefined"
          :min-width="item.minWidth ? item.minWidth : undefined"
          show-overflow-tooltip
          :fixed="item.fixed"
          :sortable="item.sortable ? item.sortable : undefined"
          :align="item.align ? item.align : undefined"
          :class-name="item.className"
          :label-class-name="item.labelClassName"
          :type="item.treeNode === true ? undefined : ''"
          :resizable="!filterable">

          <el-table-column v-if="filterable"
             :prop="item.prop"
             :width="item.width ? item.width : undefined"
             :min-width="item.minWidth ? item.minWidth : undefined"
             show-overflow-tooltip
             :fixed="item.fixed"
             :align="item.align ? item.align : undefined"
             label-class-name="custom-column"
             :type="item.treeNode === true ? undefined : ''"
             :resizable="false">
            <template #header v-if="typeof filterInfo[item.prop] === 'object'">
              <slot :name="item.prop + 'Header'" v-if="filterInfo[item.prop].slot === true"></slot>
              <!--下拉选择框-->
              <el-select v-if="filterInfo[item.prop].propType === 'select' || filterInfo[item.prop].propType === 'multSelect'"
                 v-model="filterData[item.prop]"
                 :placeholder="filterInfo[item.prop].placeholder"
                 size="mini" collapse-tags clearable
                 :multiple="filterInfo[item.prop].propType === 'multSelect'"
                 style="width: 100%;">
                <template v-if="typeof filterInfo[item.prop].value === 'object'">
                  <el-option
                      v-for="option in filterInfo[item.prop].value"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value" >
                  </el-option>
                </template>
              </el-select>

              <!--日期时间选择器-->
              <el-row :gutter="5" v-else-if="filterInfo[item.prop].propType === 'datetime' || filterInfo[item.prop].propType === 'date'">
                <el-col :span="11">
                  <el-date-picker size="mini" style="width: 100%;" v-model="filterData[item.prop + '_start']"
                                  :type="filterInfo[item.prop].propType"
                                  placeholder="选择开始时间"
                                  :default-value="$isInstance(filterInfo[item.prop].defaultValue, '[object Date]') ? filterInfo[item.prop].defaultValue : undefined">
                  </el-date-picker>
                </el-col>
                <el-col :span="2" style="text-align: center;">
                  <span>--</span>
                </el-col>
                <el-col :span="11">
                  <el-date-picker size="mini" style="width: 100%;" v-model="filterData[item.prop + '_end']"
                                  :type="filterInfo[item.prop].propType"
                                  placeholder="选择结束时间">
                  </el-date-picker>
                </el-col>
              </el-row>

              <!--时间选择器-->
              <el-row :gutter="5" v-else-if="filterInfo[item.prop].propType === 'time'">
                <el-col :span="11">
                  <el-time-picker size="mini" style="width: 100%;" v-model="filterData[item.prop + '_start']"
                                  placeholder="选择开始时间"
                                  :default-value="$isInstance(filterInfo[item.prop].defaultValue, '[object Date]') ? filterInfo[item.prop].defaultValue : undefined">
                  </el-time-picker>
                </el-col>
                <el-col :span="2" style="text-align: center;">
                  <span>--</span>
                </el-col>
                <el-col :span="11">
                  <el-time-picker size="mini" style="width: 100%;" v-model="filterData[item.prop + '_end']"
                                  placeholder="选择结束时间">
                  </el-time-picker>
                </el-col>
              </el-row>

              <!-- 普通输入框  -->
              <el-input v-else :placeholder="filterInfo[item.prop].placeholder" size="mini"
                        v-model="filterData[item.prop]">
              </el-input>
            </template>
            <template #default="scope" v-if="item.icon || item.slot">
              <i class="item.icon" v-if="item.icon"></i>
              <span style="margin-left: 5px" v-if="item.icon && !item.slot">{{ scope.row[item.prop] }}</span>
              <slot :name="item.prop" :row="scope.row" v-if="item.slot"></slot>
            </template>
          </el-table-column>

          <template #default="scope" v-if="(item.icon || item.slot) && !filterable">
            <i class="item.icon" v-if="item.icon"></i>
            <span style="margin-left: 5px" v-if="item.icon && !item.slot">{{ scope.row[item.prop] }}</span>
            <slot :name="item.prop" :row="scope.row" v-if="item.slot"></slot>
          </template>
        </el-table-column>

        <el-table-column :fixed="rowOptionFixed" label="操作" :width="rowOptionWidth" v-if="showRowOption" :resizable="!filterable">
          <el-table-column label-class-name="custom-column" v-if="filterable" :width="rowOptionWidth" :resizable="false">
            <template #header v-if="!type">
              <el-button icon="el-icon-search" circle size="mini" type="primary" plain @click.native.stop="searchData"></el-button>
              <el-button type="info" icon="el-icon-delete" circle size="mini" plain @click.native.stop="clearData"></el-button>
            </template>
            <template #default="scope">
              <slot name="rowOption" :row="scope.row"></slot>
            </template>
          </el-table-column>
          <template #default="scope" v-if="!filterable || type">
            <slot name="rowOption" :row="scope.row"></slot>
          </template>
        </el-table-column>
        <slot></slot>
      </el-table>
    </div>
  </div>
</template>

<script>

import {getFieldFilterInfo} from '@/js/tableFilterUtils'

export default {
  name: 'CommonBorderTable',
  props: {
    tableTitle: {
      default: () => [],
      type: Array
    },
    filterInfo: {
      default: () => {},
      type: Object
    },
    // 对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；
    // 如果设置了 expand 则显示为一个可展开的按钮
    type: {
      type: String,
      default: undefined
    },
    rowOptionFixed: { // 值与el-table-column的fixed一样
      default: 'right',
      type: [Boolean, String]
    },
    rowOptionWidth: { // 值与el-table-column的width一样
      default: 100,
      type: [Number, String]
    },
    filterable: {// 是否可过滤
      default: false,
      type: Boolean
    },
    showRowOption: {// 是否显示操作列
      default: true,
      type: Boolean
    },
    expandAll: {// 是否展开所有行
      default: true,
      type: Boolean
    },
    defaultStyle: {// table默认样式
      default: 'width: 100%',
      type: [String, Object]
    },
    highlightCurrentRow: {// 高亮选中行
      default: true,
      type: Boolean
    },
    tableHeightFixed: { // 是否现在表格高度, 默认固定
      default: true,
      type: Boolean
    }
  },
  data(){
    return {
      maxHeight: undefined,
      filterData: null,
      rawFilterData: null
    }
  },
  methods: {
    /**
     * 设置table表头class
     */
    setTableHeaderClass(row){
      return row.rowIndex === 2 ? 'hidden-custom-table-header' : 'custom-table-header'
    },
    getTableHeight(){
      this.maxHeight = this.$refs.outerContainer.offsetHeight - this.$refs.toolbar.offsetHeight
    },
    searchData(){
      this.$emit('search-data', {...this.filterData})
    },
    clearData(){
      const tempFilterData = this.filterData
      this.filterData = {...this.rawFilterData}
      this.$emit('clear-data', tempFilterData)
    },
    getFilterData(){
      return {...this.filterData}
    },
    initFilterData(){
      if (this.filterInfo){
        const newFilterData = getFieldFilterInfo(this.filterInfo) || {}
        this.filterData = {...newFilterData}
        this.rawFilterData = {...newFilterData}
      }
    }
  },
  created(){
    if (this.tableHeightFixed){
      this.maxHeight = 200
    }
    this.initFilterData()
  },
  mounted() {
    if (this.tableHeightFixed) {
      this.$nextTick(() => {
        this.getTableHeight()
      })
      window.addEventListener('resize', this.getTableHeight)
    }
  },
  destroyed() {
    if (this.tableHeightFixed) {
      window.removeEventListener('resize', this.getTableHeight)
    }
  }
}
</script>

<style lang="less">
  .table-outer-container{
    height: 100%;
    overflow-y: hidden;
    .table-data-container{
      .el-table{
        .custom-table-header{
          .el-table__cell{
            background-color: #e7e7e7;
          }
        }
        .el-table__cell{
          .cell{
            overflow: hidden;/*超出部分隐藏*/
            white-space: nowrap;/*不换行*/
          }
        }
        .el-table__fixed-right-patch{
          background-color: #e7e7e7;
        }

        .custom-column{
          background-color: white!important;
        }

        th.is-hidden > *, td.is-hidden > *{
          visibility: visible;
        }

        .custom-hidden-column{
          display: none !important;
        }

        .el-table__header{

        }
      }
    }
  }
</style>
