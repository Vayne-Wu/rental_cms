<template>
  <div>
    <el-dialog title="修改密码" width="30%" :visible.sync="showPasswordForm">
      <el-form
        ref="form"
        label-width="100px"
        style="width: 400px; margin: 0 auto;"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="原密码：" prop="passWord">
          <el-input v-model="form.passWord" type="password" />
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassWord">
          <el-input v-model="form.newPassWord" type="password" />
        </el-form-item>
        <el-form-item label="确认密码：" prop="aginNewPassword">
          <el-input v-model="form.aginNewPassword" type="password" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showPasswordForm = false">取消</el-button>
        <el-button @click="modify">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { modifyPassword } from '@/api/user'
import { getAccountId } from '@/utils/auth'
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.form.aginNewPassword !== '') {
          this.$refs.form.validateField('aginNewPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.form.newPassWord) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      showPasswordForm: false,
      form: {
        accountId: '',
        passWord: '',
        newPassWord: '',
        aginNewPassword: ''
      },
      rules: {
        passWord: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassWord: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        aginNewPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    editPassword() {
      this.showPasswordForm = true
    },
    modify() {
      this.form.accountId = getAccountId()
      this.$refs['form'].validate(valid => {
        if (valid) {
          modifyPassword(this.form).then(res => {
            if (res.code === 20000) {
              this.showPasswordForm = false
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
    }
  }
}
</script>
