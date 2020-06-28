<template>
  <div>
    <el-dialog :title="rentalStatus == 2 ? '下架房源' : '提示'" :visible.sync="showShelf" :show-close="false" :before-close="beforeClose" width="30%">
      <div v-if="rentalStatus == 2">
        <el-form ref="form" :model="form" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公司名称：" prop="tenantName">
                <el-input v-model="form.tenantName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="phone">
                <el-input v-model="form.phone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系人姓名：" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="月租金：" prop="monthRent">
                <el-input v-model="form.monthRent"><template slot="append">元</template></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="租期起止：" prop="date">
                <el-date-picker
                  v-model="form.date"
                  type="daterange"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 260px;"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="缴租期限（每月）：" prop="term">
                <el-input v-model="form.term">
                  <template slot="append">号前</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-else-if="rentalStatus == 3">
        <span>确认房源已空置, 将其上架改成待租？</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button v-if="rentalStatus == 2" type="primary" @click="dismount">租出下架</el-button>
        <el-button v-else-if="rentalStatus == 3" type="primary" @click="dismount">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateRentalState } from '@/api/resources'
export default {
  props: {
    showShelf: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: () => null
    },
    rentalStatus: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      form: {
        date: ''
      },
      rules: {
        tenantName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        monthRent: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        term: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    cancle() {
      this.$emit('close')
    },
    dismount() {
      this.form.id = this.id
      this.form.rentalStatus = this.rentalStatus
      if (this.rentalStatus === 2) {
        this.form.startTime = this.form.date[0]
        this.form.endTime = this.form.date[1]
        this.form.rentalStatus = 3
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.updateRentalState()
          }
        })
      } else if (this.rentalStatus === 3) {
        this.form.rentalStatus = 2
        this.updateRentalState()
      }
    },
    updateRentalState() {
      updateRentalState(this.form).then(res => {
        if (res.code === 20000) {
          this.$emit('handle-success')
        } else {
          this.$message({
            message: res.message,
            duration: 1000
          })
        }
      })
    },
    beforeClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
