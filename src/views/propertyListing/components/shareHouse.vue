<template>
  <div>
    <el-dialog :visible.sync="showShareForm" title="分享房源" width="60%">
      <share-record ref="record" />
      <div class="flex-center-y">
        <div class="text">
          <p style="color: rgba(17,17,17,.4);">增删需要房源，生成专属的房源页面。</p>
          <el-button type="text" @click="lookShareRecord">查看分享记录</el-button>
        </div>
        <el-select v-model="selectRole" value-key="nickName" placeholder="请选择招商人员">
          <el-option v-for="role in roles" :key="role.accountId" :label="role.nickName" :value="role.nickName" />
        </el-select>
        <el-button type="primary" style="margin-left: 10px;" @click="createPlan">一键生成房源方案</el-button>
      </div>
      <el-table :data="shareData" :header-cell-style="{ background: '#fafafa' }" style="padding-top: 16px;">
        <el-table-column prop="test" width="80" align="center">
          <template slot-scope="scope">
            <span
              :class="scope.row['isAdd'] ? 'el-icon-plus' : 'el-icon-minus'"
              style="cursor: pointer;color: rgb(82, 196, 26);"
              :style="scope.row['isAdd'] ? 'color: rgb(82, 196, 26);' : 'color: rgb(235, 47, 150);'"
              @click.stop="changeShare(scope.row, scope.$index)"
            />
          </template>
        </el-table-column>
        <el-table-column v-for="col in cols" :key="col.prop" :label="col.label" :prop="col.prop">
          <template slot-scope="scope">
            <div v-if="col.prop === 'monthRent'" class="month-rent">月租金：￥{{ scope.row[col.prop] }}</div>
            <div v-else-if="col.prop === 'extensive'">
              <template v-if="scope.row['type'] === 1">{{ scope.row[col.prop] }}m²</template>
              <template v-else>{{ scope.row['cubicle'] }}人（独立空间）</template>
            </div>
            <div v-else-if="col.prop === 'rent'">{{ scope.row[col.prop] }}元/工位</div>
            <div v-else-if="col.prop === 'address'">-</div>
            <div v-else-if="scope.row[col.prop]">{{ scope.row[col.prop] }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { selectAttractuser } from '@/api/business/office'
import { postInsertShareRecords } from '@/api/resources'
import shareRecord from './shareRecord'
import { getNickName } from '@/utils/auth'
export default {
  name: 'ShareHouse',
  components: {
    shareRecord
  },
  props: {
    shareData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showShareForm: false,
      showRecord: true,
      selectRole: null,
      roles: [],
      cols: [
        { label: '所属写字楼', prop: 'location' },
        { label: '楼层', prop: 'floor' },
        { label: '房间号', prop: 'roomNumber' },
        { label: '面积', prop: 'extensive' },
        { label: '单价', prop: 'rent' },
        { label: '月租金', prop: 'monthRent' },
        { label: '得房率', prop: 'address' },
        { label: '隔间', prop: 'cubicle' }
      ]
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    changeShare(row, index) {
      row.isAdd = !row.isAdd
      if (row.isAdd) {
        const removeIdx = this.shareData.findIndex(item => item.id === row.id)
        this.shareData.splice(removeIdx, 1)
      }
    },
    shareForm() {
      this.showShareForm = true
    },
    async getUserList() {
      const res = await selectAttractuser()
      this.roles = res.data
    },
    // 一键生成
    createPlan() {
      if (this.shareData.length > 0) {
        const idList = this.shareData.map(item => item.id)
        const businessPeople = this.selectRole
        const mharedby = getNickName()
        const houseSize = this.shareData.length
        if (!businessPeople) {
          this.$message({
            message: '请选择招商人员',
            duration: 1500
          })
        } else {
          postInsertShareRecords({ houseSize, businessPeople, mharedby }).then(res => {
            if (res.code === 20000) {
              this.shareData.forEach(item => {
                item.isAdd = true
              })
              this.shareData.splice(0)
              this.selectRole = ''
              this.showShareForm = false
              const routeData = this.$router.resolve({ path: '/houseInfoList', query: { businessPeople, mharedby, idList: JSON.stringify(idList) }})
              window.open(routeData.href, '_blank')
            } else {
              this.$message({
                message: res.message,
                duration: 1500
              })
            }
          })
        }
      }
    },
    lookShareRecord() {
      this.$refs['record'].openRecordForm()
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-center-y {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 16px;
  .text {
    display: flex;
    align-items: center;
    margin-right: 20px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
  }
}
</style>
