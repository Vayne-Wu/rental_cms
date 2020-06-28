<template>
  <div class="resdiv">
    <el-container>
      <house-sider style="margin-top: 50px;" :sites="sites" @click-menu-item="clickMenuItem" @edit-resou="editResou" @update-list="updateList" />
      <el-main style="background-color: #f4f4f5;">
        <div class="divtop">
          <el-button type="primary" @click="addHousing('')">添 加</el-button>
          <el-radio-group v-model="shape">
            <el-radio-button label="1">剖面</el-radio-button>
            <el-radio-button label="2">列表</el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <div>
            <el-row class="echardiv">
              <el-col :lg="11" :sm="24">
                <div class="information">
                  <div>
                    <span style="color: rgba(91,91,95,0.42)">空置数量</span><br>
                    <span style="font-size: 27px">{{ housesMsg.vacantNum ? housesMsg.vacantNum : 0 }}</span>
                  </div>
                  <div>
                    <span style="color: rgba(91,91,95,0.42)">空置率</span><br>
                    <span style="font-size: 27px">{{ housesMsg.vacantNv ? housesMsg.vacantNv : 0 }}</span><span>%</span>
                  </div>
                  <div>
                    <span style="color:  rgba(91,91,95,0.42)">空置</span><br>
                    <span style="font-size: 27px">{{ housesMsg.vacant ? housesMsg.vacant : 0 }}</span><span>m²</span>
                  </div>
                  <div>
                    <span style="color:  rgba(91,91,95,0.42)">实收月租金</span><br>
                    <span style="font-size: 27px">{{ housesMsg.monthRent ? housesMsg.monthRent : 0 }}</span><span>元</span>
                  </div>
                </div>
              </el-col>
              <el-col :lg="1" :sm="0">
                <div class="divider divider-vertical" style="height: 100%;" />
              </el-col>
              <el-col :lg="12" :sm="24">
                <echarts :id="Number(floorid)" />
              </el-col>
            </el-row>
          </div>
          <div class="listdiv">
            <div class="listtop">
              <el-checkbox-group v-model="checkList" @change="changeList">
                <el-checkbox v-for="item in checkOptions" :key="item.label" :label="item.label">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
              <div>
                <el-button plain @click="editResou(floorid)">编 辑</el-button>
                <el-button plain @click="exportList(floorid)">导 出</el-button>
              </div>
            </div>
            <!-- 剖面 -->
            <profile v-show="shape == 1" :house-section="houseSection" @rowClick="rowClick" @addHousing="addHousing" />
            <!-- 列表 -->
            <listing v-show="shape == 2" :table-data="tableData" @rowClick="rowClick" />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { selectBuildingList, selectHousesList, selectHost, getHousesExcel } from '@/api/resources'
import { screenHouseList } from './fomatter'
import listing from './components/listing'
import profile from './components/profile'
import echarts from './components/echarts'
import HouseSider from '@/components/HouseSider'
import { formatDate } from '@/utils'
export default {
  name: 'Resources',
  components: {
    listing,
    profile,
    HouseSider,
    echarts
  },
  data() {
    return {
      sites: [],
      dialogaddhousing: false,
      tableData: [],
      housesMsg: {},
      floorid: '',
      officeBuildingName: '',
      auditStatus: null,
      rentalStatus: null,
      rentPayment: null,
      locat: '',
      shape: '1',
      houseSection: [],
      checkList: [],
      checkOptions: [
        { label: 'reviewed', name: '待审核' },
        { label: 'vacant', name: '空置' },
        { label: 'lease', name: '已租' },
        { label: 'expire', name: '90天内到期' },
        { label: 'payRent', name: '缴租逾期' }
      ]
    }
  },
  created() {
    this.getresouList()
  },
  methods: {
    editResou(id) {
      this.$router.push({
        path: '/office',
        query: {
          id: id
        }
      })
    },
    // 房源列表导出
    exportList(id) {
      getHousesExcel({ buildingId: id }).then(res => {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' })
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = '房源.xls'
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href)
      })
    },
    updateList() {
      this.getresouList()
    },
    // 查看写字楼列表
    async getresouList() {
      const res = await selectBuildingList()
      this.sites = res.data ? res.data : []
      if (res.code === 20000 && this.sites.length > 0) {
        this.floorid = this.sites[0].id
        this.locat = this.sites[0].location
        this.officeBuildingName = this.sites[0].officeBuildingName
        this.listdata(this.sites[0].id)
        this.selecthost(this.sites[0].id)
      }
    },
    addHousing(pede) {
      this.$router.push({
        path: '/housing',
        query: {
          buildingId: this.floorid,
          pedestal: pede,
          officeBuildingName: this.officeBuildingName
        }
      })
    },
    async listdata(id) {
      const res = await selectHousesList({ buildingId: id, auditStatus: this.auditStatus, rentalStatus: this.rentalStatus, rentPayment: this.rentPayment })
      res.data.pageInfo = res.data.pageInfo.map(item => {
        return { ...item, isAdd: true }
      })
      this.tableData = res.data.pageInfo
      this.housesMsg = res.data.housesMsg
    },
    rowClick(row, event, column) {
      this.$router.push({
        path: '/housing',
        query: {
          id: row.id
        }
      })
    },
    clickMenuItem(site) {
      this.floorid = site.id
      this.locat = site.name
      this.listdata(site.id)
      this.selecthost(site.id)
    },
    async selecthost(id) {
      const res = await selectHost({ buildingId: id, auditStatus: this.auditStatus, rentalStatus: this.rentalStatus, rentPayment: this.rentPayment })
      if (res.code === 20000) {
        this.houseSection = res.data.pedestal
        this.houseSection.forEach(item => {
          item.floor.forEach(floor => {
            floor.roomNumber.forEach(room => {
              if (room.startTime) {
                room.startTime = formatDate(room.startTime, '/')
                room.endTime = formatDate(room.endTime, '/')
              }
            })
          })
        })
      }
    },
    changeList(e) {
      const { auditStatus, rentalStatus, rentPayment } = screenHouseList(e)
      const id = this.floorid
      this.auditStatus = auditStatus
      this.rentalStatus = rentalStatus
      this.rentPayment = rentPayment
      this.selecthost(id)
      this.listdata(id)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-main{
  padding: 0px;
}
.el-radio-button__inner{
  border-left:1px solid #DCDFE6;
  margin-top: 5px;
  margin-right: 5px;
  border-radius: 5px!important;
}
.el-radio-group {
  border: 0px;
}
.resdiv {
  position: absolute;
  top: 0px;
  bottom: 40px;
  left: 0px;
  right: 0px;
}
.el-container {
  height: 100%;
}
.el-menu-item {
  padding: 0;
}
.el-icon-plus{
  color: #409eff;
  cursor: pointer;
}
.divtop{
  background-color: #ffffff;
  width: 100%;
  height: 50px;
}
.divtop button{
  float: right;
  margin-top: 5px;
  margin-right: 10px;
}
.divtop .el-radio-group{
  float: right;
  margin-right: 20px;
  margin-top: 5px;
}
.divtop .el-radio-button__inner{
  margin-right: 0px;
  padding: 8px 10px;
}
.echardiv{
  width: 99%;
  margin: 0 auto;
  background-color: #ffffff;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  overflow: hidden;
}
.information{
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.information div{
  text-align: center;
  line-height: 50px;
}
.listdiv{
  width: 99%;
  background-color: #ffffff;
  margin: 0 auto 10px;
  overflow: inherit;
}
.listtop{
  width: 100%;
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  .el-button{
    margin-top: 5px;
  }
}
.divider {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0,0,0,.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
}
.divider-vertical {
  background: #e8e8e8;
  position: relative;
  top: -.06em;
  display: inline-block;
  width: 1px;
  height: .9em;
  margin: 0 8px;
  vertical-align: middle;
}
>>>.el-col-sm-0 {
  display: block;
}
</style>
