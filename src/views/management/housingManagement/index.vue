<template>
  <div class="main">
    <el-main style="height: 100%;position: absolute;width: 100%;">
      <h1 class="house-title">房源列表</h1>
      <div class="house-list">
        <div class="search">
          <el-select v-model="auditStatus" placeholder="选择状态" @change="selectStatus">
            <el-option v-for="item in statusList" :key="item.label" :label="item.label" :value="item.value" />
          </el-select>
          <div>
            <el-button @click="downloadHouses">下载房源模板</el-button>
            <el-button type="primary" @click="openImport">导入房源</el-button>
          </div>
        </div>
        <house-operation ref="import" @update-house="updateHouse" />
        <el-table :data="tableData" :header-cell-style="{ background: '#fafafa' }" row-key="id" style="padding: 0 20px;">
          <el-table-column
            type="index"
            label="序号"
            width="50"
          />
          <el-table-column v-for="col in cols" :key="col.lable" :label="col.label" :prop="col.prop" :width="col.width">
            <template slot-scope="scope">
              <div v-if="col.prop === 'picture' && scope.row['pictureList']" class="image-box">
                <el-image
                  style="width: 80px;height: 60px;"
                  :src="scope.row['pictureList'][0]"
                  :preview-src-list="scope.row['pictureList']"
                />
                <span class="subscript">{{ scope.row['pictureList'].length }}</span>
              </div>
              <div v-else-if="col.prop === 'house'">%</div>
              <div v-else-if="col.prop === 'mustSeeHouses'">
                <el-switch v-model="scope.row[col.prop]" :active-value="1" :inactive-value="2" @change="mustChange($event, scope.row)" />
              </div>
              <div v-else-if="col.prop === 'auditStatus'">
                <el-tag v-if="scope.row[col.prop] === 1" type="warning">待审核</el-tag>
                <el-tag v-else-if="scope.row[col.prop] === 2" type="success">已通过</el-tag>
                <el-tag v-else-if="scope.row[col.prop] === 3" type="danger">未通过</el-tag>
                <template v-else>--</template>
              </div>
              <div v-else-if="col.prop === 'operation'">
                <template>
                  <el-button type="text" @click="sale(scope.row)">
                    {{ scope.row['rentalStatus'] === 2 ? '下架' : scope.row['rentalStatus'] === 3 ? '上架' : '' }}
                  </el-button>
                </template>
                <!-- <span v-if="scope.row['rentalStatus'] !== 1 || scope.row['auditStatus'] !== 1" class="line">|</span> -->
                <template>
                  <el-button type="text" @click="toExamine(scope.row)">
                    {{ scope.row['auditStatus'] !== 2 ? '去审核' : '' }}
                  </el-button>
                </template>
              </div>
              <div v-else-if="scope.row[col.prop]">{{ scope.row[col.prop] }}</div>
              <div v-else>--</div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :page-num="pageNum"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <goods-shelves v-if="showShelf" :id="id" :rental-status="rentalStatus" :show-shelf="showShelf" @close="close" @handle-success="handleSuccess" />
        <examine v-if="showExamine" :id="id" :show-examine="showExamine" property="house" @close="close" @handle-success="handleSuccess" />
      </div>
    </el-main>
  </div>
</template>

<script>
import { postHouseStateList, postMustSeeHouses, postDownloadHouses } from '@/api/management/house'
import goodsShelves from '@/components/Popup/GoodsShelves'
import Examine from '@/components/Examine/Examine'
import Pagination from '@/components/Pagination'
import houseOperation from './components/houseOperation'
import { formatDate } from '@/utils'
export default {
  name: 'HousingManagement',
  components: {
    goodsShelves,
    Examine,
    Pagination,
    houseOperation
  },
  data() {
    return {
      auditStatus: null,
      pageNum: 1,
      pageSize: 10,
      total: 1,
      statusList: [
        { label: '选择状态', value: null },
        { label: '待审核', value: 1 },
        { label: '审核通过', value: 2 },
        { label: '审核未通过', value: 3 }
      ],
      keyword: null,
      tableData: [],
      showShelf: false,
      showExamine: false,
      id: null,
      rentalStatus: null,
      cols: [
        { label: '所属写字楼', prop: 'officeBuildingName' },
        { label: '楼层', prop: 'floor', width: 80 },
        { label: '房间号', prop: 'roomNumber', width: 80 },
        { label: '照片', prop: 'picture', width: 150 },
        { label: '面积（m²）', prop: 'extensive', width: 100 },
        { label: '单价（元·m²/月）', prop: 'rent', width: 150 },
        { label: '得房率', prop: 'house', width: 80 },
        { label: '隔间', prop: 'cubicle', width: 80 },
        { label: '曝光量', prop: 'sun', width: 80 },
        { label: '更新时间', prop: 'updateTime', width: 100 },
        { label: '得分', prop: 'score', width: 80 },
        { label: '必看好房', prop: 'mustSeeHouses', width: 80 },
        { label: '审核状态', prop: 'auditStatus', width: 80 },
        { label: '操作', prop: 'operation' }
      ]
    }
  },
  created() {
    this.postHouseStateList(this.pageNum, this.pageSize)
  },
  methods: {
    postHouseStateList(pageNum, pageSize) {
      postHouseStateList({ auditStatus: this.auditStatus, pageNum, pageSize }).then(res => {
        if (res.code === 20000) {
          res.data.list.forEach(item => {
            if (item.updateTime) {
              item.updateTime = formatDate(item.updateTime, '-')
            }
          })
          this.total = res.data.total
          this.tableData = res.data.list
        } else {
          this.$message({
            message: res.message,
            duration: 1500
          })
        }
      })
    },
    // 选择状态
    selectStatus(val) {
      this.auditStatus = val
      this.postHouseStateList(this.pageNum, this.pageSize)
    },
    // 下载房源模板
    downloadHouses() {
      postDownloadHouses().then(res => {
        if (res.type === 'application/vnd.ms-excel') {
          const blob = new Blob([res], { type: 'application/vnd.ms-excel;chartset=utf-8' })
          const downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(blob)
          downloadElement.href = href
          downloadElement.download = '房源.xlsx'
          document.body.appendChild(downloadElement)
          downloadElement.click()
          document.body.removeChild(downloadElement)
          window.URL.revokeObjectURL(href)
        } else {
          this.$message({
            message: '您没有该功能的权限，请联系管理员！',
            duration: 1500
          })
        }
      })
    },
    // 导入房源模板
    openImport() {
      this.$refs['import'].openDialog()
    },
    // 上下架
    sale(row) {
      this.id = row.id
      this.rentalStatus = row.rentalStatus
      this.showShelf = true
    },
    close() {
      this.showShelf = this.showExamine = false
    },
    handleSuccess() {
      this.showShelf = this.showExamine = false
      this.postHouseStateList(this.pageNum, this.pageSize)
    },
    // 审核
    toExamine(row) {
      this.showExamine = true
      this.id = row.id
    },
    updateHouse() {
      this.postHouseStateList(this.pageNum, this.pageSize)
    },
    // 必看好房
    mustChange(e, row) {
      postMustSeeHouses({ id: row.id, mustSeeHouses: e }).then(res => {
        if (res.code === 20000) {
          this.postHouseStateList(this.pageNum, this.pageSize)
        } else {
          this.$message({
            message: res.message,
            duration: 1500
          })
        }
      })
    },
    // 页容量
    handleSizeChange(val) {
      this.pageSize = val
      this.postHouseStateList(this.pageNum, val)
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val
      this.postHouseStateList(val, this.pageSize)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  background-color: rgb(244, 244, 245);
  .house-title {
    padding-bottom: 20px;
  }
  .house-list {
    background-color: #ffffff;
    .search {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .image-box {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 60px;
      border-radius: 4px;
      overflow: hidden;
      .el-image__inner {
        width: 100%;
        height: 100%;
      }
      .subscript {
        position: absolute;
        color: #ffffff;
        bottom: 0;
        right: 2px;
      }
    }
    .line {
      color: rgb(197, 197, 208);
      display: inline-block;
    }
  }
}
</style>
