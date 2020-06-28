<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px;">
      <el-input
        v-model="listQuery.roleName"
        size="medium"
        placeholder="请输入角色名"
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
        @click="handleEdit()"
      >添加</el-button>
    </div>
    <!-- 角色列表 -->
    <el-table :data="rolesData" style="width: 100%" border stripe>
      <el-table-column align="center" prop="roleName" label="角色名称" width="80" />
      <el-table-column align="center" prop="remark" label="备注" min-width="120" />
      <el-table-column align="center" prop="updateDate" label="更新时间" min-width="180" />
      <el-table-column align="center" label="状态" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.status">启用</span>
          <span v-else>禁用</span>
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="(val) => {handleChange(val, scope.row.userId, scope.row)}"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="240">
        <template slot-scope="scope">
          <el-button plain type="primary" size="mini" @click="handleEdit(scope.row.roleId)">编辑</el-button>
          <el-button plain type="warning" size="mini" @click="handlePermission(scope.row.roleId)">权限分配</el-button>
          <el-button plain size="mini" type="danger" @click="handleDelete(scope.row.roleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      :page-num="listQuery.pageNum"
      :page-size="listQuery.pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <roleOperation ref="form" :role-id="roleId" @update-role-list="updateRoleList" />
  </div>
</template>

<script>
import { updateRole, deleteRole, getRoleList } from '@/api/role'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import roleOperation from './components/roleOperation'
export default {
  name: 'Role',
  components: {
    Pagination,
    roleOperation
  },
  data() {
    return {
      total: 1,
      roleId: null,
      // 查询的数据
      listQuery: {
        pageNum: 1, // 页码，当前页
        pageSize: 10, // 页容量
        roleName: '',
        status: null
      },
      rolesData: [],
      statusOptions: [
        { key: null, display_name: '选择状态' },
        { key: 1, display_name: '启用' },
        { key: 0, display_name: '禁用' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'userId'
    ])
  },
  created() {
    this.getRoleList(this.listQuery.pageNum, this.listQuery.pageSize)
  },
  methods: {
    updateRoleList() {
      this.getRoleList(this.listQuery.pageNum, this.listQuery.pageSize)
    },
    // 筛选用户
    async handleFilter() {
      this.listQuery.pageSize = 10
      this.listQuery.pageNum = 1
      const res = await getRoleList(this.listQuery)
      const { list, total } = res.data
      this.total = total
      // 判断是否启用
      list.forEach(v => {
        v.status ? (v.status = true) : (v.status = false)
      })

      this.rolesData = list
    },
    // 获取角色列表
    async getRoleList(pageNum, pageSize) {
      const res = await getRoleList({ pageNum, pageSize })
      const { list, total } = res.data
      this.total = total
      // 判断是否启用
      list.forEach(v => {
        v.status === 1 ? (v.status = true) : (v.status = false)
      })
      this.rolesData = list
    },
    // 修改角色状态
    async handleChange(val, id, roledd) {
      const res = await updateRole({
        roleId: roledd.roleId,
        roleName: roledd.roleName,
        remark: roledd.remark,
        status: val ? 1 : 0
      })
      if (res.code === 20000) {
        this.$message({
          type: 'success',
          message: '成功修改角色状态!'
        })
        // 重新获取数据
        this.getRoleList(this.listQuery.pageNum, this.listQuery.pageSize)
      }
    },
    // 编辑角色信息
    async handleEdit(roleId) {
      this.roleId = roleId
      this.$refs['form'].openRoleForm()
    },
    // 菜单分配
    async handlePermission(roleId) {
      this.roleId = roleId
      this.$refs['form'].openPermissionForm()
    },
    // 删除角色
    handleDelete(roleId) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteRole(roleId)
        if (res.code === 20000) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 重新获取角色列表
          this.getRoleList(this.listQuery.pageNum, this.listQuery.pageSize)
        } else {
          this.$message({
            type: 'error',
            message: '没有权限'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 页容量
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.listQuery.pageSize = val
      this.getRoleList(this.listQuery.pageNum, this.listQuery.pageSize)
    },
    // 翻页
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getRoleList(this.listQuery.pageNum, this.listQuery.pageSize)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
