<template>
  <div>
    <el-dialog title="是否隐藏" :visible.sync="isHidden" :show-close="false" :before-close="beforeClose" width="20%">
      <div style="text-align: center;">
        <el-select v-model="hiddenState">
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
import { postBuildingHiddenState } from '@/api/management/property'
export default {
  name: 'Examine',
  props: {
    isHidden: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      hiddenState: '',
      statusList: [
        { label: '隐藏', value: 1 },
        { label: '不隐藏', value: 2 }
      ]
    }
  },
  methods: {
    cancle() {
      this.$emit('close')
    },
    confirm() {
      postBuildingHiddenState({ id: this.id, hiddenState: this.hiddenState }).then(res => {
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
