<template>
  <div class="map">
    <div id="all-map" />
    <div id="r-result" />
  </div>
</template>

<script>
import { MP } from '@/utils/map'
export default {
  name: 'Map',
  props: {
    officeDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ak: '0RMIdGRhNWqbZ8nE2djH6Gd5r6H6wkhw',
      officeBuilding: {}
    }
  },
  watch: {
    officeDetail: {
      handler(val) {
        if (val) {
          this.officeBuilding = val
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      MP(this.ak).then(BMap => {
        const map = new BMap.Map('all-map')
        if (this.officeBuilding) {
          const point = new BMap.Point(this.officeBuilding.officeBuildingResp.lng, this.officeBuilding.officeBuildingResp.lat)
          map.centerAndZoom(point, 15)
          const circle = new BMap.Circle(point, 800, { fillColor: 'blue', strokeWeight: 1, fillOpacity: 0.3, strokeOpacity: 0.3 })
          const keys = ['地铁', '公交']
          map.addOverlay(circle)
          const local = new BMap.LocalSearch(map, { renderOptions: { map: map, autoViewpoit: true, panel: 'r-result' }})
          local.searchNearby(keys, point, 1000)
          map.enableScrollWheelZoom()//  启用滚轮放大缩小，默认禁用
          map.enableContinuousZoom()// 启用地图惯性拖拽，默认禁用
        }
      })
    })
  },
  methods: {
    addClickHandler(content, marker, map) {
      marker.addEventListener('click', e => {
        this.openInfo(content, e, map)
      })
    },
    openInfo(content, e, map) {
      const p = e.target
      const opts = {
        width: 250,
        height: 80,
        title: '信息窗口',
        enableMessage: true
      }
      const point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
      const infoWindow = new BMap.InfoWindow(content, opts)
      map.openInfoWindow(infoWindow, point)
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  position: relative;
  #all-map {
    width: 100%;
    height: 500px;
  }
  #r-result {
    position: absolute;
    height: 350px;
    width: 30%;
    overflow: auto;
    top: 5px;
    left: 10px;
  }
}
</style>
