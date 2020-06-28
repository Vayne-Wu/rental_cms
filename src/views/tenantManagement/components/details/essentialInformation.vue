<template>
  <div v-if="essentialData" style="background-color: #ffffff;">
    <el-form ref="form" :model="essentialData" :rules="rules" style="width: 50rem;margin: 0 auto;">
      <el-row :gutter="20" style="padding-top: 10px;">
        <el-col :span="12">
          <el-form-item label="租客名称（姓名/公司）：">
            <el-input v-model="essentialData.tenantName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业：">
            <el-select v-model="essentialData.industryId" style="width: 100%;">
              <el-option
                v-for="item in industryList"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系人姓名：">
            <el-input v-model="essentialData.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话：">
            <el-input v-model="essentialData.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="租期起止：" prop="date">
            <el-date-picker
              v-model="essentialData.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 250px;"
              @change="dateChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="缴租期限（每月）：">
            <el-input v-model="essentialData.term">
              <template slot="append">号前</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="月租金：">
            <el-input v-model="essentialData.monthRent">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">
            <el-input v-model="essentialData.remark" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: right;padding-bottom: 20px;">
          <el-button type="primary" @click="save">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog :visible.sync="resultVisible" width="25%" :show-close="false">
      <div class="title">
        <svg viewBox="64 64 896 896" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" style="color: #52c41a;font-size: 22px;">
          <path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z" />
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
        </svg>
        <div class="save-title">保存成功</div>
      </div>
      <div class="isReturn">是否返回？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resultVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateTenant } from '@/api/management/tenant'
export default {
  name: 'EssentialInformation',
  props: {
    essentialData: {
      type: Object,
      default: () => {}
    },
    industryList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      rules: {
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      resultVisible: false
    }
  },
  watch: {
    essentialData: {
      handler(value) {
        if (value) {
          this.$set(this.essentialData, 'date', [this.essentialData.startTime, this.essentialData.endTime])
        }
      },
      immediate: true
    }
  },
  methods: {
    save() {
      this.resultVisible = true
      this.$refs['form'].validate((valid) => {
        if (valid) {
          updateTenant(this.essentialData).then(res => {
            if (res.code !== 20000) {
              this.$message({
                message: res.message,
                duration: 1500
              })
            }
          })
        } else {
          this.$message({
            message: '请填写必选项',
            duration: 1500
          })
          return false
        }
      })
    },
    confirm() {
      this.$router.push({
        path: '/tenant'
      })
    },
    dateChange(e) {
      this.essentialData.startTime = e[0]
      this.essentialData.endTime = e[1]
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  .save-title {
    margin-left: 16px;
    font-size: 16px;
    font-weight: 700;
  }
}
.isReturn {
  margin: 8px 0 0 38px;
  font-size: 14px;
}
</style>
