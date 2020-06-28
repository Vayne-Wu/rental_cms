<template>
  <div>
    <div class="tenant-list">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item in customerFunction" :key="item.label" :label="item.label" :name="item.name">
          <el-container style="background-color: #f4f4f5;height: 800px;">
            <el-main>
              <template v-if="item.name === 'essentialInformation'">
                <essentialInformation :essential-data="essentialData" :industry-list="industryList" />
              </template>
              <template v-else>
                <leaseInformation :tenant-info="tenantInfo" @update-info="updateInfo" />
              </template>
            </el-main>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import essentialInformation from '@/views/tenantManagement/components/details/essentialInformation'
import leaseInformation from '@/views/tenantManagement/components/details/leaseInformation'
import { getTenantInfo, getIndustryList } from '@/api/management/tenant'
import { formatDate } from '@/utils'
export default {
  name: 'TenantDetail',
  components: {
    essentialInformation,
    leaseInformation
  },
  data() {
    return {
      activeName: 'essentialInformation',
      customerFunction: [
        { label: '基本信息', name: 'essentialInformation' },
        { label: '租赁信息', name: 'leaseInformation' }
      ],
      essentialData: null,
      industryList: null,
      tenantInfo: null
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      const id = this.$route.query.id
      const industryRes = await getIndustryList()
      this.industryList = industryRes.data
      let tenant = await getTenantInfo({ id })
      const industryId = this.industryList.filter(item => {
        return item.id === Number(tenant.data.industryId)
      })
      tenant = tenant.data
      if (industryId.length > 0) {
        tenant.industryId = industryId[0].id
      }
      if (tenant.tenantInfo) {
        tenant.tenantInfo.startTime = formatDate(tenant.tenantInfo.startTime, '/')
        tenant.tenantInfo.endTime = formatDate(tenant.tenantInfo.endTime, '/')
      }
      this.essentialData = tenant
      this.tenantInfo = tenant.tenantInfo
    },
    updateInfo() {
      this.activeName = 'essentialInformation'
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.tenant-list{
  >>>.el-tabs__item{
    width: 100px;
    text-align: center;
    font-size: 16px;
    margin-top: 30px;
  }
  >>>.el-tabs__active-bar{
    width: 100px;
  }
  >>>.el-tabs__nav-wrap{
    margin: 0 20px;
  }
}
</style>
