<template>
  <div class="tab-container">
    <!-- <el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" /> -->
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <!-- <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes" />
          <normal v-else :type="item.key" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane> -->
      <el-tab-pane label="正常" name="normal">
        <normal />
      </el-tab-pane>
      <el-tab-pane label="历史" name="history">
        <tab-pane />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabPane from './components/TabPane'
import normal from './components/Normal'

export default {
  name: 'Tab',
  components: { tabPane, normal },
  data() {
    return {
      tabMapOptions: [
        { label: '正常', key: 'normal' },
        { label: '历史', key: 'history' }

      ],
      activeName: 'normal'
      // createdTimes: 0
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default  selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
