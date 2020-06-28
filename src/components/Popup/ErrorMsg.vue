<template>
  <div>
    <el-dialog :visible.sync="errorForm" width="30%" append-to-body>
      <el-table :data="errorData" border>
        <el-table-column
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column v-for="col in cols" :key="col.prop" :label="col.label" :prop="col.prop" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ErrorMsg',
  props: {
    errorData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      errorForm: false,
      cols: [
        { label: '错误信息', prop: 'errorInfo' }
      ]
    }
  },
  methods: {
    openErrorForm() {
      this.errorForm = true
    }
  }
}
</script>
