<template>
  <div class="customer-list">
    <h2 style="padding-left: 15px;">客户列表</h2>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in customerFunction" :key="item.label" :label="item.label" :name="item.name">
        <template v-if="item.name === 'normal'">
          <normal />
        </template>
        <template v-else>
          <history />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import history from './components/history'
import normal from './components/normal'
export default {
  name: 'CustomerDemand',
  components: {
    history,
    normal
  },
  data() {
    return {
      activeName: 'normal',
      customerFunction: [
        { label: '正常', name: 'normal' },
        { label: '历史', name: 'history' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-list{
  >>>.el-tabs__item{
    width: 80px;
    text-align: center;
    font-size: 16px;
  }
  >>>.el-tabs__active-bar{
    width: 80px;
  }
  >>>.el-tabs__header{
    padding-left: 15px;
  }
}
</style>
