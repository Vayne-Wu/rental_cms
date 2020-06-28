<template>
  <div class="history-list">
    <el-table :data="list" border style="width: 100%;">
      <template v-for="(item, index) in cols">
        <el-table-column :key="index" :label="item.label" :prop="item.prop" />
      </template>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[20, 50, 100]"
      :page-size="pageSize"
      layout="total, prev, pager, next, sizes"
      background
      :total="currentTotal"
    />
  </div>
</template>

<script>
export default {
  name: 'History',
  data() {
    return {
      cols: [
        { label: '电话号码', prop: 'phoneNum' },
        { label: '搜索条件', prop: 'phoneNum' },
        { label: '符合条件', prop: 'phoneNum' },
        { label: '匹配度', prop: 'phoneNum' },
        { label: '标签', prop: 'phoneNum' },
        { label: '更新时间', prop: 'phoneNum' },
        { label: '状态', prop: 'phoneNum' }
      ],
      list: [],
      currentPage: 1,
      pageSize: 30,
      currentTotal: 1
    }
  }
}
</script>

<style lang="scss" scoped>
>>>.el-pagination {
    text-align: right;
    margin-top: 20px;
}
</style>
