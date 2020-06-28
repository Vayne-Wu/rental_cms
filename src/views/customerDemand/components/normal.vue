<template>
  <div class="normal-list">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple" style="background-color: rgba(30,82,199,.12)">电话联系</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple" style="background-color: rgba(69,172,47,.12)">查看电话</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple" style="background-color: rgba(69,172,47,.12)">下载房源</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple" style="background-color: rgba(230,134,1,.12)">查看房源</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.normal-list{
    background: #F0F2F5;
    padding: 20px;
    >>>.grid-content {
        text-align: center;
        height: 40px;
        line-height: 40px;
    }
}
</style>
