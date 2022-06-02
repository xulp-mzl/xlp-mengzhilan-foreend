export const tableTitle = [
  {
    label: '名称', // 标题名称
    prop: 'title', // 字段名称
    width: 200, // 列宽
    minWidth: 30, // 列最小宽度
    slot: true, // 是否添加自定义内容 false, true, slot名称为prop
    treeNode: true // 树节点
  },
  {
    label: '路由', // 标题名称
    prop: 'path' // 字段名称
  },
  {
    label: '图标类型', // 标题名称
    prop: 'iconType' // 字段名称
  },
  {
    label: '图标', // 标题名称
    prop: 'icon', // 字段名称
    width: 60, // 列宽
    align: 'center',
    slot: true // 是否添加自定义内容 false, true, slot名称为prop
  },
  {
    label: '排序号', // 标题名称
    prop: 'weight', // 字段名称
    sortable: true // 是否可排序
  },
  {
    label: '创建时间', // 标题名称
    prop: 'createTime', // 字段名称
    width: 200 // 列宽
  }
]

export const filterInto = {
  iconType: {
    propType: 'multSelect', // 字段类型，用来创建搜索框的类型
    value: [{label: 'element-ui', value: 'element-ui'}] // 过滤框为下拉选择框时，输入值[label: 显示文本, value: 值]
  },
  path: {
  },
  title: {
  }
}
