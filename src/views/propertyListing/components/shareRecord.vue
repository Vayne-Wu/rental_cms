<template>
  <div>
    <el-dialog :visible.sync="showRecord" append-to-body title="分享记录">
      <el-table :data="shareData" border="">
        <el-table-column v-for="col in cols" :key="col.prop" :label="col.label" :prop="col.prop" />
      </el-table>
      <!-- 分页 -->
      <pagination
        background
        :page-num="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-dialog>
  </div>
</template>

<script>
import { postShareRecords } from '@/api/resources'
import Pagination from '@/components/Pagination'
export default {
  name: 'ShareRecord',
  components: {
    Pagination
  },
  data() {
    return {
      showRecord: false,
      total: 1,
      shareData: [],
      listQuery: {
        currentPage: 1, // 页码，当前页
        pageSize: 20 // 页容量
      },
      cols: [
        { label: '时间', prop: 'createTime' },
        { label: '分享人', prop: 'mharedby' },
        { label: '招商', prop: 'merchants' },
        { label: '房源数', prop: 'housesNum' }
      ]
    }
  },
  methods: {
    openRecordForm() {
      this.showRecord = true
      this.postShareRecords(this.listQuery.currentPage, this.listQuery.pageSize)
    },
    postShareRecords(currentPage, pageSize) {
      postShareRecords({ currentPage, pageSize }).then(res => {
        this.shareData = res.data.list
        this.total = res.data.total
      })
    },
    // 页容量
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.postShareRecords(this.listQuery.currentPage, val)
    },
    // 翻页
    handleCurrentChange(val) {
      this.listQuery.currentPage = val
      this.postShareRecords(val, this.listQuery.pageSize)
    }
  }
}
</script>
