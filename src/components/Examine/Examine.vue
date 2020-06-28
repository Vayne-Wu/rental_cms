<template>
  <div>
    <el-dialog title="修改状态" :visible.sync="showExamine" :show-close="false" :before-close="beforeClose" width="20%">
      <div style="text-align: center;">
        <el-select v-model="auditStatus">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { postHouseState } from '@/api/management/house'
import { postBuildingAuditState } from '@/api/management/property'
export default {
  name: 'Examine',
  props: {
    showExamine: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: () => null
    },
    property: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      auditStatus: '',
      statusList: [
        { label: '通过', value: 2 },
        { label: '未通过', value: 3 }
      ]
    }
  },
  methods: {
    cancle() {
      this.$emit('close')
    },
    confirm() {
      const fn = this.property === 'house' ? postHouseState : postBuildingAuditState
      fn({ id: this.id, auditStatus: this.auditStatus }).then(res => {
        if (res.code === 20000) {
          this.$emit('handle-success')
        } else {
          this.$message({
            message: res.message,
            duration: 1500
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
