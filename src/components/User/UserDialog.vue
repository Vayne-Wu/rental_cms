<template>
  <div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-dialog
        :visible.sync="dialogVisible"
        width="10%"
        append-to-body
        style="text-align: center;"
      >
        <img style="width: 104px;height: 104px;" :src="dialogImageUrl">
      </el-dialog>
      <el-form
        ref="dataForm"
        :model="form"
        label-width="100px"
        style="width: 400px; margin: 0 auto;"
        :rules="rules"
      >
        <el-form-item label="头像：">
          <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :on-success="handleSuccess"
            :show-file-list="false"
          >
            <div v-if="imageUrl" class="img">
              <img :src="imageUrl" class="avatar">
              <span class="el-upload-action">
                <i class="el-icon-search" @click.stop="handlePictureCardPreview" />
                <i class="el-icon-delete" @click.stop="handleRemove" />
              </span>
            </div>
            <i v-else class="el-icon-plus" stop />
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名：" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="电话：" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item v-if="passwordtrue" label="密码：" prop="passWord">
          <el-input v-model="form.passWord" type="password" placeholder="请输入用户密码" />
        </el-form-item>
        <el-form-item label="对外头衔：" prop="externalTitle">
          <el-input v-model="form.externalTitle" placeholder="请输入对外头衔" />
        </el-form-item>
        <el-form-item label="微信号：" prop="wxNumber">
          <el-input v-model="form.wxNumber" placeholder="请输入微信号" />
        </el-form-item>
        <!-- 选择角色 -->
        <el-form-item v-if="showModify" label="选择角色：" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择" @change="elchange">
            <el-option
              v-for="item in userroles"
              :key="item.roleKey"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateUser, rolelistAll, addUser, deleteUser, getInfo } from '@/api/user'
export default {
  name: 'UserDialog',
  props: {
    userId: {
      type: Number,
      default: () => null
    },
    showModify: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatepassWord = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码至少6位数'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      passwordtrue: true,
      dialogVisible: false,
      isModify: false,
      dialogStatus: '',
      dialogImageUrl: '',
      imageUrl: '',
      userroles: [],
      textMap: {
        update: '编辑',
        create: '添加'
      },
      form: {
        nickName: '',
        passWord: '',
        phone: '',
        status: '1',
        roleId: '',
        externalTitle: '',
        wxNumber: '',
        headPortrait: ''
      },
      // 表单输入提示
      rules: {
        nickName: [
          { required: true, trigger: 'blur', message: '请输入名称' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validatePhone }
        ],
        passWord: [
          { required: true, trigger: 'blur', validator: validatepassWord }
        ],
        newPassWord: [
          { required: true, trigger: 'blur', validator: validatepassWord }
        ],
        roleId: [
          { required: true, trigger: 'blur', message: '请选择用户角色' }
        ]
      }
    }
  },
  computed: {
    uploadUrl() {
      return process.env.VUE_APP_BASE_API + '/picture/pictureUpload'
    }
  },
  methods: {
    handleClose() {
      this.isModify = false
    },
    elchange() {
      this.userroles = this.userroles.slice(0)
    },
    // 创建用户
    async createUser() {
      const role = await rolelistAll()
      this.userroles = role.data
      this.passwordtrue = true
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.imageUrl = ''
      this.resetForm()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 清空表单
    resetForm() {
      this.form = {
        nickName: '',
        passWord: '',
        phone: '',
        status: '1',
        roleId: '',
        externalTitle: '',
        wxNumber: '',
        headPortrait: ''
      }
    },
    // 编辑用户
    async handleEdit() {
      const role = await rolelistAll()
      this.userroles = role.data
      this.passwordtrue = false
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      const res = await getInfo(this.userId)
      if (res.code === 20000) {
        const { data } = res
        this.imageUrl = data.headPortrait
        data.status = data.status.toString()
        this.form = data
        this.form.status = this.form.status.toString()
        this.form.roleId = this.form.roles[0].roleId
      }
    },
    // 删除用户
    handleDelete() {
      this.$confirm('是否确定删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await deleteUser(this.userId)
          if (res.code === 20000) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 重新获取数据
            this.$emit('update-list')
          } else {
            this.$message({
              type: 'error',
              message: '没有权限'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    createData() {
      this.$refs['dataForm'].validate(async valid => {
        if (this.form.userId !== undefined) {
          this.updateData(this.form.userId)
        } else {
          if (valid) {
            const res = await addUser(this.form)
            if (res.code === 20000) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '用户创建成功',
                type: 'success',
                duration: 2000
              })
              // 重新请求数据
              this.$emit('update-list')
            } else {
              this.$message({
                message: res.message,
                duration: 1500
              })
            }
          }
        }
      })
    },
    // 更新用户信息
    async updateData(id) {
      this.form.userId = id
      const res = await updateUser(this.form)
      if (res.code === 20000) {
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '数据修改成功!'
        })
        // 重新获取数据
        this.$emit('update-list')
      } else {
        this.$message({
          message: res.message,
          duration: 1500
        })
      }
    },
    handlePictureCardPreview() {
      this.dialogImageUrl = this.imageUrl
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      this.form.headPortrait = ''
      this.imageUrl = ''
    },
    handleSuccess(response) {
      this.form.headPortrait = this.imageUrl = response.data
    }
  }
}
</script>

<style lang="scss" scoped>
>>>.el-upload--picture-card {
  width: 104px;
  height: 104px;
  line-height: 114px;
}
>>>.el-upload-list--picture-card .el-upload-list__item {
  width: 104px;
  height: 104px;
}
>>>.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 104px;
  height: 104px;
}
.img {
  display: flex;
  align-items: center;
  position: relative;
  .avatar {
    width: 104px;
    height: 104px;
  }
  .el-upload-action {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #ffffff;
    background-color: #000000;
    opacity: 0;
    &:hover {
      opacity: .5;
    }
  }
}
</style>
