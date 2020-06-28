<template>
  <div class="module">
    <h3 class="module-title">写字楼基础信息</h3>
    <div class="flex">
      <div class="traffic-info flex-1">
        <div class="building-small-title">{{ officeBuilding.location }}</div>
        <div class="hr" />
        <!-- <p class="gray">
          <span>深圳-南山-科技园</span>
          <span>深圳市高新南区白石路与沙河西路交汇处</span>
        </p> -->
        <div v-if="officeBuilding.officeBuildingResp" class="flex-between">
          <div>
            <p class="building-prop-item">
              <span class="gray building-item-label">落成年份</span>
              <span>2020</span>
            </p>
            <p class="building-prop-item">
              <span class="gray building-item-label">使用率</span>
              <span v-if="officeBuilding.utilizationRate">{{ officeBuilding.utilizationRate }}%</span>
            </p>
            <p class="building-prop-item">
              <span class="gray building-item-label">管理费</span>
              <span>{{ officeBuilding.officeBuildingResp.managementFee }}</span>
            </p>
            <p class="building-prop-item">
              <span class="gray building-item-label">停车费</span>
              <span>2016</span>
            </p>
          </div>
          <div>
            <p class="building-prop-item">
              <span class="gray building-item-label">物业等级</span>
              <span>{{ officeBuilding.officeBuildingResp.propertyClass }}</span>
            </p>
            <p class="building-prop-item">
              <span class="gray building-item-label">净层高</span>
              <span>{{ officeBuilding.floorHeight }}</span>
            </p>
            <p class="building-prop-item">
              <span class="gray building-item-label">清洁保洁</span>
              <span>{{ officeBuilding.cleaning }}</span>
            </p>
            <p class="building-prop-item">
              <span class="gray building-item-label">宽带</span>
              <span>{{ officeBuilding.networkBroadband }}</span>
            </p>
          </div>
          <div>
            <p class="building-prop-item">
              <span class="gray building-item-label">建筑面积</span>
              <span>{{ officeBuilding.officeBuildingResp.extensive }}</span>
            </p>
            <p class="building-prop-item">
              <span class="gray building-item-label">物业管理</span>
              <span>{{ officeBuilding.officeBuildingResp.estateManagement }}</span>
            </p>
            <p class="building-prop-item">
              <span class="gray building-item-label">车位数</span>
              <span>{{ officeBuilding.officeBuildingResp.parkingSpacesNumber }}</span>
            </p>
            <p class="building-prop-item">
              <span class="gray building-item-label">空调费</span>
              <span>{{ officeBuilding.airconditionerBilling }}</span>
            </p>
          </div>
        </div>
      </div>
      <div v-if="officeBuilding.officeBuildingResp" class="el-image building-img">
        <el-image
          style="width: 100%; height: 100%;"
          :src="officeBuilding.pictureList[0]"
          :preview-src-list="officeBuilding.pictureList"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OfficeInfo',
  props: {
    officeDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      officeBuilding: {}
    }
  },
  watch: {
    officeDetail: {
      handler(val) {
        this.officeBuilding = val
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.module-title {
  font-size: 24px;
  margin-bottom: 15px;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  .flex-1 {
    flex: 1;
    .hr {
      height: 1px;
      background: rgba(17,17,17,.1);
      margin: 30px 0;
    }
    .building-small-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
    }
  }
}
.gray {
  font-size: 14px;
  color: rgba(17,17,17,.6);
}
.flex-between {
  justify-content: space-between;
  display: flex;
  flex-wrap: wrap;
  .building-prop-item {
    margin-bottom: 10px;
    .building-item-label {
      width: 56px;
      text-align: right;
      margin-right: 15px;
      display: inline-block;
    }
  }
}
.building-img {
  width: 289px;
  height: 216px;
  background-size: cover;
  border-radius: 8px;
  margin-left: 15px;
  background: rgba(245,245,245,1);
  text-align: center;
  line-height: 216px;
  color: rgba(0,0,0,0.5);
}
</style>
