<template>
  <div class="main">
    <el-main style="height: 100%;position: absolute;width: 100%;">
      <h1 class="house-title">盘源列表</h1>
      <div class="house-list">
        <div class="search">
          <el-select v-model="auditStatus" placeholder="选择状态" @change="selectStatus">
            <el-option v-for="item in statusList" :key="item.label" :label="item.label" :value="item.value" />
          </el-select>
          <div style="display: flex;">
            <el-button style="margin-right: 10px;" @click="exportBuilding">下载盘源模板</el-button>
            <el-upload
              :action="importUrl"
              accept=".xlsx, .xls"
              :on-success="handleImportSuccess"
              :show-file-list="false"
              :headers="headers"
            >
              <el-button type="primary">导入盘源</el-button>
            </el-upload>
          </div>
        </div>
        <error-msg ref="error" :error-data="errorData" />
        <el-table :data="tableData" :header-cell-style="{ background: '#fafafa' }" style="padding: 0 20px;">
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
              <div v-else-if="col.prop === 'auditStatus'">
                <el-tag v-if="scope.row[col.prop] === 1" type="warning">待审核</el-tag>
                <el-tag v-else-if="scope.row[col.prop] === 2" type="success">已通过</el-tag>
                <el-tag v-else-if="scope.row[col.prop] === 3" type="danger">未通过</el-tag>
                <template v-else>--</template>
              </div>
              <div v-else-if="col.prop === 'hiddenState'">
                <el-tag v-if="scope.row[col.prop] === 1" type="success">已隐藏</el-tag>
                <el-tag v-else-if="scope.row[col.prop] === 2">未隐藏</el-tag>
                <template v-else>--</template>
              </div>
              <div v-else-if="col.prop === 'operation'">
                <template>
                  <el-button type="text" @click="toExamine(scope.row)">
                    {{ scope.row['auditStatus'] !== 2 ? '去审核' : '' }}
                  </el-button>
                </template>
                <!-- <span v-if="scope.row['rentalStatus'] !== 1 || scope.row['auditStatus'] !== 1" class="line">|</span> -->
                <template>
                  <el-button type="text" @click="hide(scope.row)">隐藏</el-button>
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
        <examine v-if="showExamine" :id="id" :show-examine="showExamine" @close="close" @handle-success="handleSuccess" />
        <hidden v-if="isHidden" :id="id" :is-hidden="isHidden" @close="close" @handle-success="handleSuccess" />
      </div>
    </el-main>
  </div>
</template>

<script>
import { postBuildingStateList, postDownloadBuilding } from '@/api/management/property'
import Examine from '@/components/Examine/Examine'
import ErrorMsg from '@/components/Popup/ErrorMsg'
import hidden from '@/views/management/propertyManagement/components/hidden'
import Pagination from '@/components/Pagination'
import { formatDate } from '@/utils'
import { getToken } from '@/utils/auth'
export default {
  name: 'PropertyManagement',
  components: {
    Examine,
    hidden,
    Pagination,
    ErrorMsg
  },
  data() {
    return {
      auditStatus: null,
      pageNum: 1,
      pageSize: 10,
      total: 1,
      errorData: [],
      statusList: [
        { label: '选择状态', value: null },
        { label: '待审核', value: 1 },
        { label: '审核通过', value: 2 },
        { label: '审核未通过', value: 3 }
      ],
      keyword: null,
      tableData: [],
      showExamine: false,
      isHidden: false,
      id: null,
      cols: [
        { label: '商圈名称', prop: 'location' },
        { label: '写字楼名称', prop: 'officeBuildingName' },
        { label: '照片', prop: 'picture' },
        { label: '房源', prop: 'housesCount' },
        { label: '业主', prop: 'ownerCount' },
        { label: '标签', prop: 'label' },
        { label: '更新时间', prop: 'updateTime' },
        { label: '审核状态', prop: 'auditStatus' },
        { label: '隐藏状态', prop: 'hiddenState' },
        { label: '操作', prop: 'operation' }
      ]
    }
  },
  computed: {
    importUrl() {
      return process.env.VUE_APP_BASE_API + '/excel/uploadOfficeBilding'
    },
    headers() {
      return {
        'X-Token': getToken()
      }
    }
  },
  created() {
    this.postBuildingStateList(this.pageNum, this.pageSize)
  },
  methods: {
    postBuildingStateList(pageNum, pageSize) {
      postBuildingStateList({ auditStatus: this.auditStatus, pageNum, pageSize }).then(res => {
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
    selectStatus(val) {
      this.auditStatus = val
      this.postBuildingStateList(this.pageNum, this.pageSize)
    },
    close() {
      this.showExamine = this.isHidden = false
    },
    handleSuccess() {
      this.showExamine = this.isHidden = false
      this.postBuildingStateList(this.pageNum, this.pageSize)
    },
    // 审核
    toExamine(row) {
      this.showExamine = true
      this.id = row.id
    },
    hide(row) {
      this.isHidden = true
      this.id = row.id
    },
    // 页容量
    handleSizeChange(val) {
      this.pageSize = val
      this.postBuildingStateList(this.pageNum, val)
    },
    // 翻页
    handleCurrentChange(val) {
      this.pageNum = val
      this.postBuildingStateList(val, this.pageSize)
    },
    // 导入盘源
    handleImportSuccess(response) {
      if (response.code === 20000) {
        if (response.data.state === 'success') {
          this.$message({
            message: '上传成功！',
            duration: 1500,
            showClose: true
          })
          this.postBuildingStateList(this.pageNum, this.pageSize)
        } else {
          this.$refs['error'].openErrorForm()
          this.errorData = response.data.errorMsg
        }
      } else {
        this.$message({
          message: response.message,
          duration: 1500
        })
      }
    },
    // 导出盘源
    exportBuilding() {
      postDownloadBuilding().then(res => {
        if (res.type === 'application/vnd.ms-excel') {
          const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' })
          const downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(blob)
          downloadElement.href = href
          downloadElement.download = '写字楼.xlsx'
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
  }
}
</style>
