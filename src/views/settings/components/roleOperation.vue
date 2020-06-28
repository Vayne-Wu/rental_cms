<template>
  <div>
    <!-- 添加role -->
    <el-dialog title="添加角色" :visible.sync="roleForm">
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        style="width: 400px; margin: 0 auto;"
        :rules="rules"
      >
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限说明：" prop="remark">
          <el-input
            v-model="form.remark"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="账号说明"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleForm = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限分配 -->
    <el-dialog title="分配角色权限" :visible.sync="permiDialog">
      <el-form
        ref="dataForm"
        :model="form"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
        :rules="rules"
      >
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入用角色标识" disabled="" />
        </el-form-item>
        <el-form-item label="分配权限：" prop="">
          <el-tree
            ref="tree"
            :data="menus"
            :props="defaultProps"
            node-key="menuId"
            :default-checked-keys="checkMenu"
            default-expand-all
            show-checkbox
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button type="primary" @click="assignPermi">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, updateRole, getRoleDetail, assignRole } from '@/api/role'
import { getMenus } from '@/api/menu'
export default {
  name: 'RoleOperation',
  props: {
    roleId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    const validateuserName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入角色姓名'))
      } else {
        callback()
      }
    }
    return {
      roleForm: false,
      permiDialog: false,
      menus: [], // 所有权限
      // 角色相关
      checkMenu: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      form: {
        roleName: '',
        status: 1,
        remark: ''
      },
      rules: {
        roleName: [
          { required: true, trigger: 'blur', validator: validateuserName }
        ]
      }
    }
  },
  methods: {
    // 获取菜单信息
    async getMenus() {
      const res = await getMenus()
      this.menus = res.data
    },
    openRoleForm() {
      this.roleForm = true
      this.$nextTick(async() => {
        if (this.roleId) {
          const res = await getRoleDetail(this.roleId)
          if (res.code === 20000) {
            this.form = res.data
          }
          this.form.status = !!this.form.status
        } else {
          this.form = {
            roleName: '',
            status: 1,
            remark: ''
          }
        }
      })
    },
    // 创建角色
    confirm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          if (!this.roleId) {
            delete this.form.status
          } else {
            this.form.status = this.form.status ? 1 : 0
          }
          const fn = this.roleId ? updateRole : addRole
          const message = this.roleId ? '成功修改角色信息!' : '用户创建成功'
          const res = await fn(this.form)
          if (res.code === 20000) {
            this.$notify({
              title: '成功',
              message,
              type: 'success',
              duration: 2000
            })
            // 重新请求数据
            this.$emit('update-role-list')
            this.roleForm = false
          } else {
            this.$message({
              message: res.message,
              duration: 1500
            })
          }
        }
      })
    },
    // 角色授权
    async assignPermi() {
      const checkIds = this.$refs.tree.getCheckedKeys()
      const halfCheckIds = this.$refs.tree.getHalfCheckedKeys()
      halfCheckIds.forEach(v => checkIds.push(v))
      const res = await assignRole({
        roleId: this.form.roleId,
        menuIds: checkIds
      })
      if (res.code === 20000) {
        this.$message({
          type: 'success',
          message: '成功给该角色分配权限!',
          duration: 1500
        })
        this.checkIds = []
        this.checkMenu = []
        // 重新获取数据
        this.$emit('update-role-list')
        this.permiDialog = false
      } else {
        this.$message({
          message: res.message,
          duration: 1500
        })
      }
    },
    openPermissionForm() {
      this.permiDialog = true
      this.$nextTick(async() => {
        this.checkMenu = []
        this.getMenus()
        const res = await getRoleDetail(this.roleId)
        if (res.code === 20000) {
          this.checkMenu = res.data.menuIds
          this.form = res.data
        }
      })
    },
    handleCancle() {
      this.permiDialog = false
      this.checkMenu = []
    }
  }
}
</script>
