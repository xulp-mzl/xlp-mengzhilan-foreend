import routerName from '@/router/routerName'
import Main from '@/views/Main'
import MenuTableData from '@/views/menu/MenuTableData'
import ModelTableData from '@/views/model/ModelTableData'
import CommonTableInfo from '@/views/CommonTableInfo'

const routerPath = [
  {
    path: '/',
    component: Main,
    redirect: '/menu/setting',
    name: routerName.main,
    children: [
      {path: 'menu/setting', component: MenuTableData},
      {path: 'model/setting', component: ModelTableData},
      {path: 'tableInfo2', component: CommonTableInfo},
      {path: 'tableInfo3', component: CommonTableInfo},
      {path: 'tableInfo4', component: CommonTableInfo}
    ]
  }
]

export default routerPath
