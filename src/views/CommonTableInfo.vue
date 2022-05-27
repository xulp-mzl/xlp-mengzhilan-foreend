<template>
  <div id="data-info">
    <el-table :data="tableData" border>
      <el-table-column prop="date" label="日期" width="140">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  </div>

</template>

<script>

import request from '@/js/request'

export default {
  name: 'CommonTableInfo',
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      tableDataSource: Array(8).fill(item),
      tableData: [],
      currentPage: 1,
      total: 8,
      pageSize: 3,
      pageSizes: [3, 5, 10, 15]
    }
  },
  methods: {
    handleSizeChange(val){
      this.pageSize = val
      this.getTablePageData(this.currentPage, val)
    },
    handleCurrentChange(val){
      this.getTablePageData(val, this.pageSize)
    },
    getTablePageData(currentPage, pageSize){
      currentPage = currentPage && currentPage > 0 ? currentPage : 1
      pageSize = pageSize && pageSize > 0 ? pageSize : 0
      const index = (currentPage - 1) * pageSize
      const endIndex = index + pageSize
      this.tableData = []
      for (let i = index; i < this.tableDataSource.length && i < endIndex; i++){
        this.tableData.push(this.tableDataSource[i])
      }
    },
    async getData(){
      const data = await request.get('/test?id=8')
      console.log(data)
    }
  },
  created(){
    this.getTablePageData(this.currentPage, this.pageSize)

    this.getData()
  }
}
</script>

<style scoped lang="less">
  #data-info{
    .pagination-container{
      margin-top: 15px;
      background-color: white;
      padding: 10px;
    }
  }
</style>
