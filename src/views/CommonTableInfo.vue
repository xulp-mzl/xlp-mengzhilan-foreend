<template>
  <div id="data-info" ref="dataInfo">
    <div class="top" ref="top">345</div>

    <div class="table-data-container" ref="tableDataContainer">
    <el-table :data="tableData" border :max-height="maxHeight" ref="tableDataContainer">
      <el-table-column label="日期" >
        <el-table-column prop="date" label="日期1" width="400" label-class-name="custom-column">
          <template #header>
           <el-row :gutter="5">
              <el-col :span="11">
               <el-time-picker
                    size="mini" style="width: 100%" v-model="filterData.startDate"
                    placeholder="任意时间点">
                </el-time-picker>
                <!--<el-date-picker size="mini" style="width: 100%" v-model="filterData.startDate"
                    type="datetime"
                    placeholder="选择开始日期时间">
                </el-date-picker>-->
              </el-col>
              <el-col :span="2" style="text-align: center;">
                <span>&#45;&#45;</span>
              </el-col>
              <el-col :span="11">
                <el-date-picker size="mini" style="width: 100%" v-model="filterData.endDate"
                    type="datetime"
                    placeholder="选择结束日期时间">
                </el-date-picker>
              </el-col>
            </el-row>
            <!--<el-date-picker style="width: 100%"
                v-model="filterData.startDate"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels>
            </el-date-picker>-->
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="姓名">
        <el-table-column prop="name" width="120" label-class-name="custom-column">
          <template #header>
            <el-input placeholder="请输入内容"  size="mini" v-model="filterData.name"></el-input>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="地址" sortable >
        <el-table-column prop="address" label-class-name="custom-column">
          <template #header>
            <el-select v-model="filterData.descptor"  placeholder="请选择" size="mini" collapse-tags clearable
                       style="width: 100%; overflow: hidden;  white-space: nowrap;" multiple>
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="操作" fixed="right">
        <el-table-column label-class-name="custom-column" fixed="right">
          <template #header>
            <el-button type="primary" icon="el-icon-search" size="mini" plain @click.native.stop="searchData">搜索</el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" plain @click.native.stop="clearData">清空</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    </div>

    <div class="pagination-container" ref="footer">
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>
    </div>
  </div>

</template>

<script>

import request from '@/js/request'
import dayjs from 'dayjs'

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
      pageSizes: [3, 5, 10, 15],
      filterData: undefined,
      maxHeight: 200,
      name: '',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }]
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
    },
    searchData(){
      console.log(this.filterData)
    },
    clearData(){
      for (const i in this.filterData){
        console.log(i)
        this.filterData[i] = null
      }
    },
    getTableHeight(){
      console.log(this.maxHeight)
      this.maxHeight = this.$refs.dataInfo.offsetHeight - this.$refs.top.offsetHeight -
        this.$refs.footer.offsetHeight - 8
      console.log(this.maxHeight)
    }
  },
  created(){
    this.getTablePageData(this.currentPage, this.pageSize)

    this.getData()

    this.filterData = {
      startDate: null,
      endDate: null,
      name: null,
      description: null
    }
    console.log(Object.prototype.toString.call(null))
    console.log(dayjs('2022-06-06 23:15:45'))
    console.log(dayjs('23:15:45'))
    console.log(Number(1).toString())
    console.log(Object.prototype.toString.call(2))
    console.log(Object.prototype.toString.call(2.7))
    const params = new URLSearchParams({kk: 'dd'})
    params.append('param1', '&value1')
    params.append('param2', 'value2')
    console.log(params)
    console.log(params.toString())
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.maxHeight)
      this.maxHeight = this.$refs.dataInfo.offsetHeight - this.$refs.top.offsetHeight -
        this.$refs.footer.offsetHeight - 10
      console.log(this.maxHeight)
    })
    window.addEventListener('resize', this.getTableHeight)
  },
  destroyed() {
    window.removeEventListener('resize', this.getTableHeight)
  }
}
</script>

<style lang="less">
  #data-info{
    height: 100%;
    overflow-y: hidden;
    /*overflow-y: auto;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;*/
    .top{
      height: 40px;
      line-height: 40px;
      background-color: red;
    }

    .table-data-container{
      /*flex: 1;
      flex-shrink: 0;*/
    }

    .pagination-container{
      margin-top: 15px;
      background-color: white;
      padding: 10px;
    }
    .custom-column{
      background-color: white!important;
    }
    /*.el-table th.is-hidden > *, .el-table  td.is-hidden>*{
      visibility: visible;
    }*/
  }
</style>
