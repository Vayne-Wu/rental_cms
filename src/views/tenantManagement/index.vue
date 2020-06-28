<template>
  <div class="resdiv">
    <el-container>
      <house-sider :sites="sites" @click-menu-item="clickMenuItem" @edit-resou="editResou" />
      <el-main style="background-color: #f4f4f5;">
        <div class="body">
          <search @rent-change="rentChange" @industry-change="industryChange" @tenant-change="tenantChange" @key-change="keyChange" />
          <table-list :id="floorid" :rent-payment="rentPayment" :industry-id="industryId" :tenant="tenant" :name="name" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { selectBuildingList } from '@/api/resources'
import search from './components/search'
import tableList from './components/tableList'
import HouseSider from '@/components/HouseSider'
export default {
  name: 'TenantManagement',
  components: {
    search,
    tableList,
    HouseSider
  },
  data() {
    return {
      sites: [],
      floorid: null,
      locat: null,
      rentPayment: null,
      industryId: null,
      tenant: null,
      name: null
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
    func() {
      this.$router.push({
        path: '/office'
      })
    },
    // 查看写字楼列表
    async getresouList() {
      const res = await selectBuildingList()
      this.sites = res.data ? res.data : []
      if (res.code === 20000) {
        this.floorid = this.sites[0].id
        this.locat = this.sites[0].location
      } else {
        this.$message({
          message: res.message,
          duration: 1500
        })
      }
    },
    clickMenuItem(site) {
      this.floorid = site.id
      this.locat = site.name
    },
    // 缴租状态
    rentChange(value) {
      this.rentPayment = value
    },
    // 行业类型
    industryChange(value) {
      this.industryId = value
    },
    // 租客
    tenantChange(value) {
      this.tenant = value
    },
    // 关键字
    keyChange(value) {
      this.name = value
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
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
  min-height: 400px;
  overflow: auto;
}
/*滚动条样式*/
.el-menu-vertical-demo::-webkit-scrollbar {/*滚动条整体样式*/
  width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.el-menu-vertical-demo::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #409eff;
}
.el-menu-vertical-demo::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 0;
  background: rgba(0,0,0,0.1);
}
.el-radio-group {
  border: 0px;
}
.el-menu-item-dome {
  height: 80px;
}
.el-menu-vertical-demo {
  height: 100%;
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
.el-menu--collapse {
  width: 110px;
}
.body {
  margin: 24px;
  background-color: #ffffff;
  height: calc(100vh - 150px);
}
</style>
