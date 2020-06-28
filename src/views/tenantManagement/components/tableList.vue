<template>
  <div>
    <el-table :data="tableData" sortable :header-cell-style="{ background: '#fafafa' }" @cell-click="cellClick">
      <template v-for="(item, index) in cols">
        <el-table-column :key="index" :label="item.label" :prop="item.prop">
          <template slot-scope="scope">
            <div v-if="item.prop === 'extensive'">
              <template v-if="scope.row['type'] == 1">{{ scope.row[item.prop] }}m²</template>
              <template v-else>{{ scope.row['cubicle'] }}人（独立空间）</template>
            </div>
            <div v-else-if="item.prop === 'rentalSurplus'">{{ scope.row[item.prop] }}天</div>
            <div v-else-if="item.prop === 'rentPayment'">
              <el-tag v-if="scope.row[item.prop] === 1" type="success">正常</el-tag>
              <el-tag v-else type="danger">逾期</el-tag>
            </div>
            <div v-else-if="item.prop === 'date'" style="width: 80px;">
              <div>{{ scope.row['startTime'] }}</div>
              <div style="text-align: center;">至</div>
              <div>{{ scope.row['endTime'] }}</div>
            </div>
            <div v-else-if="item.prop === 'operation'">
              <el-button type="text">详情</el-button>
            </div>
            <div v-else-if="scope.row[item.prop]">{{ scope.row[item.prop] }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <pagination
      :page-num="listQuery.pageNum"
      :page-size="listQuery.pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { postTenantList } from '@/api/management/tenant'
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'TableList',
  components: {
    Pagination
  },
  props: {
    id: {
      type: [Number, String],
      default: () => null
    },
    rentPayment: {
      type: String,
      default: () => null
    },
    industryId: {
      type: Number,
      default: () => null
    },
    tenant: {
      type: String,
      default: '1'
    },
    name: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      total: 1,
      tableData: [],
      listQuery: {
        pageNum: 1, // 页码，当前页
        pageSize: 20 // 页容量
      },
      cols: [
        { label: '租赁项目', prop: 'officeBuildingName' },
        { label: '公司名称', prop: 'tenantName' },
        { label: '房号', prop: 'roomNumber' },
        { label: '面积', prop: 'extensive' },
        { label: '月租金', prop: 'monthRent' },
        { label: '租期起止', prop: 'date' },
        { label: '租期剩余', prop: 'rentalSurplus' },
        { label: '缴租情况', prop: 'rentPayment' },
        { label: '操作', prop: 'operation' }
      ],
      currentPage: 1,
      pageSize: 30,
      currentTotal: 1
    }
  },
  watch: {
    id: {
      handler() {
        this.postTenantList(this.listQuery.pageNum, this.listQuery.pageSize)
      }
    },
    rentPayment: {
      handler() {
        this.postTenantList(this.listQuery.pageNum, this.listQuery.pageSize)
      }
    },
    industryId: {
      handler() {
        this.postTenantList(this.listQuery.pageNum, this.listQuery.pageSize)
      }
    },
    tenant: {
      handler() {
        this.postTenantList(this.listQuery.pageNum, this.listQuery.pageSize)
      }
    },
    name: {
      handler() {
        this.postTenantList(this.listQuery.pageNum, this.listQuery.pageSize)
      }
    }
  },
  methods: {
    postTenantList(currentPage, pageSize) {
      const form = {
        buildingId: this.id,
        rentPayment: this.rentPayment,
        industryId: this.industryId,
        tenant: this.tenant ? this.tenant : 1,
        name: this.name,
        currentPage,
        pageSize
      }
      postTenantList(form).then(res => {
        res.data.list.forEach(item => {
          item.startTime = formatDate(item.startTime, '-')
          item.endTime = formatDate(item.endTime, '-')
        })
        this.total = res.data.total
        this.tableData = res.data.list
      })
    },
    cellClick(row, column, cell, event) {
      if (column.label === '操作') {
        this.$router.push({
          path: '/tenantDetail',
          query: {
            id: row.id
          }
        })
      }
    },
    // 页容量
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.postTenantList(this.listQuery.pageNum, val)
    },
    // 翻页
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.postTenantList(val, this.listQuery.pageSize)
    }
  }
}
</script>
