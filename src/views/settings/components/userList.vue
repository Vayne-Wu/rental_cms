<template>
  <div>
    <!-- 用户列表 -->
    <el-table fit :data="tableData" style="width: 100%" border stripe :default-sort="{prop: 'createDate'}">
      <el-table-column align="center" prop="nickName" label="姓名" min-width="180" />
      <el-table-column align="center" prop="phone" label="手机号" min-width="180">
        <template slot-scope="{ row }">
          <span>{{ row.phone ? row.phone: "——" }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="roleName" label="用户角色" min-width="180" />
      <el-table-column align="center" prop="lastLoginTime" label="最后登录" min-width="180" sortable />

      <el-table-column align="center" label="状态" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.status">启用</span>
          <span v-else>禁用</span>
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="(val) => {handleChange(val, scope.row.userId, scope.row.roleId)}"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row.userId)">编辑</el-button>
          <el-button size="mini" @click="handleReset(scope.row.accountId)">重置密码</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="showModifyForm" title="重置密码" width="20%">
      <el-form ref="modify" :model="form" :rules="rules" label-width="80px" style="width: 300px;">
        <el-form-item label="密码：" prop="newPassWord">
          <el-input v-model="form.newPassWord" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showModifyForm = false">取  消</el-button>
        <el-button type="primary" @click="confirm">确  定</el-button>
      </div>
    </el-dialog>
    <!-- 新增账号 -->
    <user-dialog ref="user" :user-id="userId" :show-modify="showModify" @update-list="updateList" />
  </div>
</template>

<script>
import { updateUser, postUpdatePwd } from '@/api/user'
import UserDialog from '@/components/User/UserDialog'
export default {
  name: 'TableList',
  components: {
    UserDialog
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      userId: null,
      showModify: true,
      showModifyForm: false,
      form: {
        newPassWord: '',
        accountId: ''
      },
      rules: {
        newPassWord: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 创建用户
    async createUser() {
      this.$refs['user'].createUser()
    },
    // 修改用户状态
    async handleChange(val, id, roledd) {
      val = val ? 1 : 0
      const res = await updateUser({ userId: id, status: val, roleId: roledd })
      if (res.code === 20000) {
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '成功修改用户状态',
          type: 'success',
          duration: 2000
        })
        // 重新请求数据
        this.$emit('update-list')
      }
    },
    // 编辑用户
    async handleEdit(userId) {
      this.showModify = true
      this.userId = Number(userId)
      this.$refs['user'].handleEdit()
    },
    // 删除用户
    handleDelete(userId) {
      this.showModify = true
      this.userId = Number(userId)
      this.$refs['user'].handleDelete()
    },
    // 重置密码
    handleReset(accountId) {
      this.showModifyForm = true
      this.form = {
        newPassWord: '',
        accountId
      }
    },
    confirm() {
      this.$refs['modify'].validate(valid => {
        if (valid) {
          postUpdatePwd(this.form).then(res => {
            if (res.code === 20000) {
              this.showModifyForm = false
            } else {
              this.$message({
                message: res.message,
                duration: 1500
              })
            }
          })
        } else {
          return false
        }
      })
    },
    updateList() {
      this.$emit('update-list')
    }
  }
}
</script>
