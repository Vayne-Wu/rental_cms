<template>
  <div class="app-container">
    <!-- 查找 -->
    <!-- 内容过滤 -->
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input
        v-model="listQuery.accountId"
        size="medium"
        placeholder="请输入用户名"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        size="medium"
        clearable
        placeholder="是否启用"
        style="width: 130px"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-button
        size="medium"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        size="medium"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
    </div>
    <user-list ref="table" :table-data="tableData" @update-list="updateList" />
    <!-- 分页 -->
    <pagination
      :page-num="listQuery.pageNum"
      :page-size="listQuery.pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
// 导入封装的接口函数
import { getUserList } from '@/api/user'
import userList from './components/userList'
// 导入仓库数据
import { mapGetters } from 'vuex'
// import dayjs from 'dayjs']
import Pagination from '@/components/Pagination'

// 定义用户账号状态
const statusOptions = [
  { key: null, display_name: '选择状态' },
  { key: 1, display_name: '启用' },
  { key: 0, display_name: '禁用' }
]
export default {
  name: 'User',
  components: { userList, Pagination },
  data() {
    return {
      // 查询的数据
      listQuery: {
        pageNum: 1, // 页码，当前页
        pageSize: 10, // 页容量
        accountId: undefined,
        status: undefined
      },
      total: 1,
      statusOptions, // 筛选
      tableData: [], // 列表数据
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    this.getUserList(this.listQuery.pageNum, this.listQuery.pageSize)
  },
  methods: {
    // 查询用户列表数据
    async getUserList(pageNum, pageSize) {
      const res = await getUserList({ pageNum, pageSize })
      const { list, total } = res.data
      this.total = total
      // 判断是否启用
      this.tableData = list.map(v => {
        v.status ? (v.status = true) : (v.status = false)
        return v
      })
    },
    updateList() {
      this.getUserList(this.listQuery.pageNum, this.listQuery.pageSize)
    },
    // 筛选用户
    async handleFilter() {
      this.listQuery.pageSize = 10
      this.listQuery.pageNum = 1
      const res = await getUserList(this.listQuery)
      const { list, total } = res.data
      this.total = total
      // 判断是否启用
      list.forEach(v => {
        v.status ? (v.status = true) : (v.status = false)
      })

      this.tableData = list
    },
    // 添加用户
    async handleCreate() {
      this.$refs['table'].createUser()
    },
    // 页容量
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getUserList(this.listQuery.pageNum, this.listQuery.pageSize)
    },
    // 翻页
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getUserList(this.listQuery.pageNum, this.listQuery.pageSize)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: absolute;
  height: 100%;
  overflow: auto;
  width: 100%;
}
.edit {
  margin-bottom: 20px;
}
</style>
