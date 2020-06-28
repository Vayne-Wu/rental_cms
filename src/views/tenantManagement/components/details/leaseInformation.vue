<template>
  <div v-if="tenantInfo" style="background-color: #ffffff;padding: 0 20px;">
    <div class="flex-between">
      <div style="padding-top: 20px;">
        <a @click="toHousingDetail">{{ tenantInfo.location }}</a>
        <p class="small-text">深圳-南山-科技园</p>
      </div>
      <b class="h4">m²</b>
    </div>
    <div class="divider-horizontal" />
    <div class="flex-between">
      <div>
        <p class="h4">{{ tenantInfo.startTime }} ~ {{ tenantInfo.endTime }}</p>
        <p>
          每月<a>{{ tenantInfo.term }}</a>号前缴租
        </p>
      </div>
      <el-select v-model="date">
        <el-option
          v-for="item in dateList"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-table :data="tenantInfo.tenantInfo">
      <el-table-column v-for="col in cols" :key="col.label" :label="col.label" :prop="col.prop">
        <template slot-scope="scope">
          <div v-if="col.prop === 'month'">{{ scope.row[col.prop] }}月</div>
          <div v-else-if="col.prop === 'rentPayment'">
            <el-tag v-if="scope.row[col.prop] === 1" type="success">正常</el-tag>
            <el-tag v-else type="danger">逾期</el-tag>
          </div>
          <div v-else-if="col.prop === 'mark'">
            <el-switch v-model="isPay" @change="payChange" />
          </div>
          <div v-else-if="scope.row[col.prop]">{{ scope.row[col.prop] }}</div>
          <div v-else>--</div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="payVisible" width="25%" :show-close="false">
      <div class="title">
        <svg viewBox="64 64 896 896" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" style="color: #faad14;font-size: 22px;">
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
          <path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z" />
        </svg>
        <div class="save-title">提示</div>
      </div>
      <div class="isReturn">确认改为已缴费吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateTenant } from '@/api/management/tenant'
import { getAllYears } from '@/utils'
export default {
  name: 'LeaseInformation',
  props: {
    tenantInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      date: 1,
      dateList: [],
      cols: [
        { label: '月份', prop: 'month' },
        { label: '租金', prop: 'monthRent' },
        { label: '状态', prop: 'rentPayment' },
        { label: '延期（天）', prop: 'day' },
        { label: '缴租标记', prop: 'mark' }
      ],
      isPay: false,
      payVisible: false
    }
  },
  watch: {
    tenantInfo: {
      handler() {
        if (this.tenantInfo) {
          this.dateList = getAllYears(this.tenantInfo.startTime, this.tenantInfo.endTime)
        }
      }
    }
  },
  methods: {
    payChange(e) {
      this.isPay = false
      this.rentPayment = e ? 1 : 2
      this.payVisible = true
    },
    confirm() {
      const id = this.tenantInfo.id
      const rentPayment = this.rentPayment
      updateTenant({ rentPayment, id }).then(res => {
        if (res.code === 20000) {
          this.payVisible = false
          this.$emit('update-info')
        } else {
          this.$message({
            message: res.message,
            duration: 1500
          })
        }
      })
    },
    toHousingDetail() {
      this.$router.push({
        path: '/housing',
        query: {
          id: this.tenantInfo.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    color: #1890ff;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
  }
  .small-text {
    font-size: 12px;
    font-weight: 400;
    color: rgba(17, 17, 17, 0.4);
    line-height: 18px;
    margin: 0;
  }
  .h4 {
    font-size: 18px;
    color: rgb(17, 17, 17);
  }
}
.divider-horizontal {
  display: block;
  clear: both;
  width: 100%;
  min-width: 100%;
  height: 1px;
  margin: 24px 0;
  background-color: #e8e8e8;
}
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
