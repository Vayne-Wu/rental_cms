<template>
  <div>
    <el-pagination
      background
      :current-page="pageNum"
      :page-sizes="[10, 15, 20, 25]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pageNum: {
      type: Number,
      default: () => 1
    },
    pageSize: {
      type: Number,
      default: () => 10
    },
    total: {
      type: Number,
      default: () => undefined
    }
  },
  methods: {
    // 页容量
    handleSizeChange(val) {
      this.$emit('size-change', val)
    },
    // 翻页
    handleCurrentChange(val) {
      this.$emit('current-change', val)
    }
  }
}
</script>

<style lang="scss" scoped>
>>>.el-pagination {
  text-align: right;
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
