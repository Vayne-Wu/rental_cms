<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      @row-click="rowClick"
    >
      <el-table-column prop="test" width="80" align="center">
        <template slot-scope="scope">
          <span
            :class="scope.row['isAdd'] ? 'el-icon-plus' : 'el-icon-minus'"
            style="cursor: pointer;color: rgb(82, 196, 26);"
            :style="scope.row['isAdd'] ? 'color: rgb(82, 196, 26);' : 'color: rgb(235, 47, 150);'"
            @click.stop="changeShare(scope.row, scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column v-for="item in cols" :key="item.label" :sortable="item.sortable" :label="item.label" :prop="item.prop">
        <template slot-scope="scope">
          <div v-if="item.prop === 'monthRent'" class="month-rent">月租金：￥{{ scope.row[item.prop] }}</div>
          <div v-else-if="item.prop === 'rentalStatus'">
            <el-tag v-if="scope.row[item.prop] === 2" type="info" effect="plain">空置</el-tag>
            <el-tag v-else-if="scope.row[item.prop] === 3" type="success" effect="plain">已租</el-tag>
          </div>
          <div v-else-if="item.prop === 'extensive'">
            <template v-if="scope.row['type'] === 1">{{ scope.row[item.prop] }}m²</template>
            <template v-else>{{ scope.row['cubicle'] }}人（独立空间）</template>
          </div>
          <div v-else-if="item.prop === 'rent'">{{ scope.row[item.prop] }}元/工位</div>
          <div v-else-if="item.prop === 'picture' && scope.row['pictureList']" class="image-box">
            <el-image
              style="width: 80px;height: 60px;"
              :src="scope.row['pictureList'][0]"
              :preview-src-list="scope.row['pictureList']"
            />
            <span class="subscript">{{ scope.row['pictureList'].length }}</span>
          </div>
          <div v-else-if="item.prop === 'address'">-</div>
          <div v-else-if="scope.row[item.prop]">{{ scope.row[item.prop] }}</div>
          <div v-else>--</div>
        </template>
      </el-table-column>
    </el-table>
    <el-badge :hidden="shareData.length === 0" :value="shareData.length" class="fixed-box">
      <div class="fixed-icon" @click="openShareForm">
        <i class="el-icon-share" />
      </div>
    </el-badge>
    <share-house ref="share" :share-data="shareData" />
  </div>
</template>

<script>
import shareHouse from './shareHouse'
export default {
  components: {
    shareHouse
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0,
      shareData: [],
      cols: [
        { label: '租客信息', prop: 'monthRent' },
        { label: '楼层', prop: 'floor', sortable: true },
        { label: '房号', prop: 'roomNumber', sortable: true },
        { label: '照片', prop: 'picture' },
        { label: '面积', prop: 'extensive' },
        { label: '单价', prop: 'rent' },
        { label: '得房率', prop: 'address' },
        { label: '隔间', prop: 'cubicle' },
        { label: '状态', prop: 'rentalStatus' },
        { label: '得分', prop: 'score' }
      ]
    }
  },
  methods: {
    rowClick(row, column) {
      if (column.property !== 'picture') {
        this.$emit('rowClick', row)
      }
    },
    changeShare(row, index) {
      row.isAdd = !row.isAdd
      if (!row.isAdd) {
        this.shareData.splice(index, 1, row)
      } else {
        const removeIdx = this.shareData.findIndex(item => item.id === row.id)
        this.shareData.splice(removeIdx, 1)
      }
    },
    openShareForm() {
      this.$refs['share'].shareForm()
    }
  }
}
</script>

<style lang="scss" scoped>
.month-rent {
  font-size: 12px;
  font-weight: 400;
  color: rgba(17,17,17,.4);
}
.image-box {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  .el-image__inner {
    width: 100%;
    height: 100%;
  }
  .subscript {
    position: absolute;
    color: #ffffff;
    bottom: 0;
    right: 2px;
  }
}
.fixed-box {
  position: fixed;
  bottom: 100px;
  right: 50px;
  z-index: 9999;
  .fixed-icon {
    width: 64px;
    height: 64px;
    background: #1e52c7;
    box-shadow: 0 3px 9px 0 rgba(0,0,0,.1);
    text-align: center;
    line-height: 64px;
    cursor: pointer;
    border-radius: 50%;
    color: #fff;
    font-size: 36px;
  }
}
>>>.el-badge__content.is-fixed {
  top: 8px;
  right: 18px;
}
</style>
