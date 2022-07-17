export const tableTitle = [
  {
    label: '字段属性id', // 标题名称
    prop: 'attrId', // 字段名称
    width: 250 // 列宽
  },
  {
    label: '模型属性名称', // 标题名称
    prop: 'attrName' // 字段名称
  },
  {
    label: '对应表列名',
    prop: 'columnName'
  },
  {
    label: '排序号',
    prop: 'orderNo',
    width: 100,
    align: 'center',
    sortable: true
  },
  {
    label: '属性类型',
    prop: 'attributeType',
    slot: true
  }
]

export const filterInfo = {
  attrName: {
  },
  attrId: {
  },
  columnName: {
  },
  attributeType: {
    propType: 'select', // 字段类型，用来创建搜索框的类型
    // 过滤框为下拉选择框时，输入值[label: 显示文本, value: 值]
    value: [
      {
        label: '扩展属性',
        value: 'EXTEND_ATTR'
      },
      {
        label: '硬属性',
        value: 'HARD_ATTR'
      }
    ]
  }
}
