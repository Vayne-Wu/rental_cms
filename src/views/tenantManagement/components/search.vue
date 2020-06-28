<template>
  <div>
    <div class="search-bar">
      <div>
        <el-select v-model="status" style="width: 150px;margin-right: 20px;" @change="rentChange">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="industry" style="width: 150px;margin-right: 20px;" @change="industryChange">
          <el-option
            v-for="item in industryList"
            :key="item.id"
            :label="item.typeName"
            :value="item.id"
          />
        </el-select>
        <el-radio-group v-model="radio" style="margin-right: 20px;" @change="tenantChange">
          <el-radio-button label="1">在租租客</el-radio-button>
          <el-radio-button label="2">历史所有租客</el-radio-button>
        </el-radio-group>
        <el-button type="primary" @click="exportList">导出租客列表</el-button>
      </div>
      <div>
        <el-input v-model="keyword" placeholder="请输入租客关键词搜索" select-when-unmatched style="width: 250px;" @keyup.enter.native="submitForm">
          <el-button slot="append" icon="el-icon-search" @click="search" />
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { getIndustryList, getExportTenant } from '@/api/management/tenant'
export default {
  name: 'Search',
  data() {
    return {
      status: null,
      statusList: [
        { value: null, label: '缴租状态（全部）' },
        { value: '1', label: '正常' },
        { value: '2', label: '逾期' }
      ],
      industry: '',
      industryList: [],
      radio: '1',
      keyword: ''
    }
  },
  created() {
    this.getIndustryList()
  },
  methods: {
    getIndustryList() {
      getIndustryList().then(res => {
        this.industryList = res.data
      })
    },
    rentChange(e) {
      this.$emit('rent-change', e)
    },
    industryChange(e) {
      this.$emit('industry-change', e)
    },
    tenantChange(e) {
      this.$emit('tenant-change', e)
    },
    search() {
      this.$emit('key-change', this.keyword)
    },
    submitForm() {
      this.$emit('key-change', this.keyword)
    },
    exportList() {
      getExportTenant().then(res => {
        if (res.type === 'application/vnd.ms-excel') {
          const blob = new Blob([res], { type: 'application/vnd.ms-excel;chartset=utf-8' })
          const downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(blob)
          downloadElement.href = href
          downloadElement.download = '租客列表.xlsx'
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
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}
>>>.el-select .el-input__inner {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
