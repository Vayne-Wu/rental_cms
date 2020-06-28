<template>
  <div class="echarts">
    <div id="echart" style="width: 100%;height: 100%" />
  </div>
</template>

<script>
import { selectTenantTime } from '@/api/resources'
export default {
  name: 'Echarts',
  props: {
    id: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {}
  },
  watch: {
    id: {
      handler(val) {
        this.ecahrtsdata(val)
      }
    }
  },
  methods: {
    async ecahrtsdata(id) {
      const res = await selectTenantTime({ id: id })
      if (res.code === 20000) {
        this.drawLine(res.data)
      }
    },
    drawLine(obj) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('echart'))
      // 绘制图表
      myChart.setOption({
        color: ['#3398DB'],
        title: {
          text: '未来12个月到期情况',
          textStyle: {
            color: 'rgba(91, 91, 95, 0.42)',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: 'left',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            data: obj.data.monthList
          }
        ],
        yAxis: [
          {
            type: 'value',
            show: false
          }
        ],
        series: [
          {
            name: '房源到期',
            type: 'bar',
            barWidth: '20',
            data: obj.data.numList,
            itemStyle: {
              color: param => {
                if (param.value >= 4) {
                  return '#F59A23'
                } else {
                  return '#40A9FF'
                }
              }
            }
          }
        ]
      })
      window.onresize = function() {
        myChart.resize()
      }
    }
  }
}
</script>
