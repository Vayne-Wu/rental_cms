<template>
  <div style="height: 100%;">
    <div v-for="taba in houseSection" :key="taba.pedestal">
      <div class="shapetitle">
        <span class="titspan">{{ taba.pedestal }}</span>面积合计
        <span>{{ taba.sumExtensive }}</span>m²,空置率
        <span>{{ taba.vacantNv ? taba.vacantNv : 0 }}</span>%,总月租金
        <span>{{ taba.sumMonthRent }}</span>万元
        <span class="addfang" @click="addHousing(taba.pedestal)">添加房源</span>
      </div>
      <div
        v-for="floordata in taba.floor"
        :key="floordata.floor"
        style="margin: 0 auto;width: 98%;overflow: auto;border-top: 1px solid rgba(17,17,17,.1);"
      >
        <div class="thdiv">
          <div class="index">{{ floordata.floor }}F</div>
          <div class="small-text">{{ floordata.sumExtensive }}m²</div>
          <div class="small-text">{{ floordata.sumCapacity }}</div>
        </div>
        <div class="divlie">
          <div v-for="(room, roomIdx) in floordata.roomNumber" :key="roomIdx" class="divkuai">
            <el-popover placement="top-start" width="200" trigger="hover">
              <div class="popover-content">
                <div>
                  <span style="font-weight: 600;">{{ room.roomNumber }}（独立空间）</span>
                  <!-- <span class="fenshu">{{ room.score }}90分</span> -->
                </div>
                <div>
                  <span>{{ room.monthRent }} 元/月 (￥{{ room.rent }}元/工位)</span>
                </div>
                <!-- <div>
                  <span>{{ room.roomNumber }}</span>
                </div> -->
                <div>
                  <span v-if="room.startTime" class="small-text">{{ room.startTime }} - {{ room.endTime }}</span>
                  <!-- <span v-else class="small-text">已空置{{ room.vacantDay ? room.vacantDay : 0 }}日</span> -->
                  <!-- <span class="el-icon-plus jiahao" /> -->
                </div>
              </div>
              <div slot="reference" class="kuaidiv" @click="rowClick(room)">
                <span class="max-row-1 flex-1">{{ room.roomNumber }}（独立空间）</span>
                <!-- <div class="small-text">{{ room.roomNumber }}</div> -->
                <div class="small-text max-row-1">{{ room.endTime }}</div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    houseSection: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    rowClick(row) {
      this.$emit('rowClick', row)
    },
    addHousing(pede) {
      this.$emit('addHousing', pede)
    }
  }
}
</script>

<style lang="scss" scoped>
.shapetitle {
  width: 98%;
  height: 50px;
  background-color: #f6f6f7;
  margin: 0 auto;
  line-height: 50px;
  color: rgba(0, 0, 0, 0.65);
}
.titspan {
  margin: 0px 30px;
  font-size: larger;
  font-weight: bolder;
}
.addfang {
  float: right;
  margin-right: 15px;
  color: #409eff;
  cursor: pointer;
}
.thdiv {
  width: 80px;
  height: 100%;
  text-align: center;
  padding-top: 23px;
  float: left;
  .index {
    width: 84px;
    text-align: center;
    font-size: 19px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.85);
  }
}
.small-text {
  font-size: 12px;
  font-weight: 400;
  color: rgba(17, 17, 17, 0.4);
  line-height: 18px;
  margin: 0;
}
.divlie {
  width: 90%;
  float: left;
}
.divkuai {
  height: 80px;
  background-color: #f6f6f7;
  margin: 10px 9px 10px 0px;
  color: rgba(0, 0, 0, 0.65);
  float: left;
  cursor: pointer;
  padding: 10px;
}
.kuaidiv {
  width: 100%;
  height: 100%;
  font-size: 12px;
  padding-top: 15px;
  .max-row-1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    width: 80px;
  }
  .flex-1 {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: hidden;
  }
}
.fenshu {
  padding: 4px;
  color: #52c41a;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 5px;
  font-size: 12px;
}
.popover-content div {
  margin-top: 5px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}
.jiahao {
  float: right;
  color: #52c41a;
}
</style>
