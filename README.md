# xlp-mengzhilan

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

###CommonBorderTable的部分属性说明

```
props: {
    tableTitle: { // table标题信息
      default: () => {
        return [ {
          label: '', // 标题名称
          prop: '', // 字段名称
          width: undefined, // 列宽
          icon: undefined, // 列的前缀图形类名，暂时只支持element-ui图标
          minWidth: undefined, // 列最小宽度
          fixed: undefined, // 是否固定
          sortable: false, // 是否可排序
          align: 'left', // 列类容位置
          className: undefined, // 列的 className
          labelClassName: undefined, // 当前列标题的自定义类名
          slot: false // 是否添加自定义内容 false, true, slot名称为prop
        }]
      },
      type: Array
    },
    filterInto: {
     default: () => {
         return {
           prop: { // 字段名称
             propType: undefined, // 字段类型，用来创建搜索框的类型
             placeholder: '', // 过滤框提示内容
             value: undefined, // 过滤框为下拉选择框时，输入值[label: 显示文本, value: 值]
             defaultValue: undefined, // 默认过滤值
             slot: false // 是否添加自定义内容 false, true, slot名称为prop
           }
         }
       },
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
    }
  }
```

###CommonBorderTable的部分函数说明
```
getFilterData()
该函数或过滤输入框中对应的类容
```

