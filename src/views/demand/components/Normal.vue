<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content filter-search">
          <el-radio v-model="listQuery.startTime" :label="1" @change="handleClick">今天</el-radio>
          <el-radio v-model="listQuery.startTime" :label="2" @change="handleClick">本周</el-radio>
          <el-radio v-model="listQuery.startTime" :label="3" @change="handleClick">本月</el-radio>
          <el-radio v-model="otherDate" :label="true" @change="handleDate">其它日期</el-radio>
          <el-date-picker
            v-show="otherDate"
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            @change="handleSelect"
          /></div></el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :span="6"><div class="cell-header cell-4">电话联系</div></el-col>
      <el-col :span="6"><div class="cell-header cell-4">查看电话</div></el-col>
      <el-col :span="6"><div class="cell-header cell-4">下载房源</div></el-col>
      <el-col :span="6">
        <div class="cell-header cell-4">查看房源</div>
        <div v-if="selectHousesList.length">
          <div v-for="item in list.selectHousesList" :key="item.userId" class="cell" @click="getDemandInfo(item.userId)">
            <p style="margin-bottom: 12px;">客户联系方式：<b>{{ item.mobilePhone }}</b></p>
            <p class="small-text">{{ item.createTime }} 查看房源</p>
            <el-divider />
            <div class="flex-between">
              <div> {{ item.location }}<br> {{ item.pedestal }} / {{ item.roomNumber }} </div>
              <div style="text-align: right;">
                <p class="small-text">房源需求匹配度</p> {{ item.matchingDegree }}% </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 详情 -->
    <el-dialog v-if="infoVisible" :title="mobilePhone" :visible.sync="infoVisible">
      <h4>搜索条件</h4>
      <el-table
        :data="searchRespList"
        style="width: 100%"
      >
        <el-table-column
          prop="area_label"
          label="区域"
          min-width="80"
        />
        <el-table-column
          prop="area"
          label="面积"
          min-width="80"
        />
        <el-table-column
          prop="price"
          label="价格"
          min-width="80"
        />
        <el-table-column
          prop="renovation"
          label="装修"
          min-width="80"
        />
        <el-table-column
          prop="cubicle"
          label="隔间"
          min-width="80"
        />
        <el-table-column
          prop="orientation"
          label="朝向"
          min-width="80"
        />
        <el-table-column
          prop="entryTime"
          label="入驻时间"
          min-width="80"
        >
          <template slot-scope="{row}">
            <span>{{ row.entryTime? row.entryTime: '未知' }}</span>
          </template>
        </el-table-column>

      </el-table>
      <h4>曝光房源</h4>
      <el-table
        :data="exposureHousesList"
        style="width: 100%"
      >

        <el-table-column
          prop="exposureContent"
          label="写字楼"
          min-width="480"
        >
          <template slot-scope="{row}">
            <span>{{ row.exposureContent }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="matchingDegree"
          label="匹配度"
          width="180"
        >
          <template slot-scope="{row}">
            <span>{{ row.matchingDegree }}%</span>
          </template>
        </el-table-column>

      </el-table>

      <h4>操作日志</h4>
      <el-table
        :data="customeLogRespList"
        style="width: 100%"
      >

        <el-table-column
          prop="operation"
          label="操作"
          min-width="480"
        >
          <template slot-scope="{row}">
            <span>{{ row.operation }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="更新时间"
          width="180"
        >
          <template slot-scope="{row}">
            <span>{{ row.operationTime }}%</span>
          </template>
        </el-table-column>

      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="infoVisible = false">取 消</el-button>
        <el-button type="danger" @click="infoVisible = false">作 废</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { getDemandList, getDemandInfo } from '@/api/customerDemand/demand'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'CN'
    }
  },
  data() {
    return {
      otherDate: false,
      value1: [],
      radio: false,
      list: null,
      listQuery: {
        startTime: 1,
        endTime: null
      },
      loading: false,
      selectHousesList: [],
      infoVisible: false,
      infoData: null,
      mobilePhone: null,
      searchRespList: [],
      exposureHousesList: [],
      customeLogRespList: []
    }
  },
  computed: {
    // selectHousesList() {
    //   return this.list.selectHousesList.length && this.list.selectHousesList
    // }
  },
  created() {
    this.getList()
  },
  methods: {
    async getDemandInfo(id) {
      this.infoVisible = true
      const res = await getDemandInfo(id)
      this.infoData = res.data
      this.mobilePhone = res.data.mobilePhone
      this.searchRespList = res.data.searchRespList
      this.exposureHousesList = res.data.exposureHousesList
      this.customeLogRespList = res.data.customeLogRespList
    },
    handleClick() {
      this.otherDate = false
      this.getList()
    },
    handleDate() {
      this.listQuery.startTime = ''
    },
    handleSelect() {
      this.listQuery.startTime = this.value1[0]
      this.listQuery.endTime = this.value1[1]
      this.getList()
    },
    getList() {
      this.loading = true
      // this.$emit('create') // for test
      getDemandList(this.listQuery).then(response => {
        this.list = response.data
        this.selectHousesList = response.data.selectHousesList

        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  // .bg-purple-dark {
  //   border: 1px solid #cccccc;
  // }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .filter-search {
    .el-radio {
      line-height: 30px;
    }
  }

  .cell-header {
    text-align: center;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
  }
  .cell-4 {
    background: rgba(255, 92, 92, 0.301);
  }
  .cell {
    margin-top: 10px;
    background: #f6f6f7;
    border: 1px solid rgba(17,17,17,.1);
    padding: 12px;
    cursor: pointer;

    .small-text {
      font-size: 12px;
    font-weight: 400;
    color: rgba(17,17,17,.4);
    line-height: 18px;
    margin: 0;
    }

    .flex-between {

    display: flex;

    justify-content: space-between;
    align-items: center;
    }
  }
</style>
