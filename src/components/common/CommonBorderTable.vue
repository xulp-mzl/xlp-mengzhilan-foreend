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
        header-row-class-name="custom-table-header"
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
            <template #header v-if="typeof filterInto[item.prop] === 'object'">
              <slot :name="item.prop + 'Header'" v-if="filterInto[item.prop].slot === true"></slot>
              <!--下拉选择框-->
              <el-select v-if="filterInto[item.prop].propType === 'select' || filterInto[item.prop].propType === 'multSelect'"
                 v-model="filterData[item.prop]"
                 :placeholder="filterInto[item.prop].placeholder"
                 size="mini" collapse-tags clearable
                 :multiple="filterInto[item.prop].propType === 'multSelect'"
                 style="width: 100%;">
                <template v-if="typeof filterInto[item.prop].value === 'object'">
                  <el-option
                      v-for="option in filterInto[item.prop].value"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value" >
                  </el-option>
                </template>
              </el-select>

              <!--日期时间选择器-->
              <el-row :gutter="5" v-else-if="filterInto[item.prop].propType === 'datetime' || filterInto[item.prop].propType === 'date'">
                <el-col :span="11">
                  <el-date-picker size="mini" style="width: 100%;" v-model="filterData[item.prop + '_start']"
                                  :type="filterInto[item.prop].propType"
                                  placeholder="选择开始时间"
                                  :default-value="$isInstance(filterInto[item.prop].defaultValue, '[object Date]') ? filterInto[item.prop].defaultValue : undefined">
                  </el-date-picker>
                </el-col>
                <el-col :span="2" style="text-align: center;">
                  <span>--</span>
                </el-col>
                <el-col :span="11">
                  <el-date-picker size="mini" style="width: 100%;" v-model="filterData[item.prop + '_end']"
                                  :type="filterInto[item.prop].propType"
                                  placeholder="选择结束时间">
                  </el-date-picker>
                </el-col>
              </el-row>

              <!--时间选择器-->
              <el-row :gutter="5" v-else-if="filterInto[item.prop].propType === 'time'">
                <el-col :span="11">
                  <el-time-picker size="mini" style="width: 100%;" v-model="filterData[item.prop + '_start']"
                                  placeholder="选择开始时间"
                                  :default-value="$isInstance(filterInto[item.prop].defaultValue, '[object Date]') ? filterInto[item.prop].defaultValue : undefined">
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
              <el-input v-else :placeholder="filterInto[item.prop].placeholder" size="mini"
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

export default {
  name: 'CommonBorderTable',
  props: {
    tableTitle: {
      default: () => {
        return []
      },
      type: Array
    },
    filterInto: {
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
    }
  },
  data(){
    return {
      maxHeight: 200,
      filterData: null,
      rawFilterData: null
    }
  },
  methods: {
    getTableHeight(){
      this.maxHeight = this.$refs.outerContainer.offsetHeight - this.$refs.toolbar.offsetHeight
    },
    searchData(){
      this.$emit('search-data', {...this.filterData})
    },
    clearData(){
      this.filterData = {...this.rawFilterData}
      this.$emit('clear-data', {...this.filterData})
    },
    getFilterData(){
      return {...this.filterData}
    },
    initFilterData(){
      if (this.filterInto){
        const newFilterData = {}
        for (const key in this.filterInto){
          if (this.filterInto[key].propType === 'datetime' ||
            this.filterInto[key].propType === 'date' ||
            this.filterInto[key].propType === 'time'){
            newFilterData[key + '_start'] = this.$isInstance(this.filterInto[key].defaultValue, '[object Date]')
              ? this.filterInto[key].defaultValue : undefined
            newFilterData[key + '_end'] = undefined
          } else if (this.filterInto[key].propType === 'multSelect'){
            newFilterData[key] = this.$isInstance(this.filterInto[key].defaultValue, '[object Array]')
              ? this.filterInto[key].defaultValue : undefined
          } else {
            newFilterData[key] = this.filterInto[key].defaultValue === undefined
              ? '' : this.filterInto[key].defaultValue
            newFilterData[key + '_option'] = this.filterInto[key].optionType
          }
          newFilterData[key + '_type'] = this.filterInto[key].propType
        }
        this.filterData = {...newFilterData}
        this.rawFilterData = {...newFilterData}
      }
    }
  },
  created(){
    this.initFilterData()
  },
  mounted() {
    this.$nextTick(() => {
      this.getTableHeight()
    })
    window.addEventListener('resize', this.getTableHeight)
  },
  destroyed() {
    window.removeEventListener('resize', this.getTableHeight)
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
          padding: 5px 0;
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
      }
    }
  }
</style>
