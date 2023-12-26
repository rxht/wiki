<template>
  <section class="container">
    <div v-if="props.isDefault" ref="leftChartDom" class="charts"></div>
    <div v-if="props.isSelf" ref="rightChartDom" class="charts"></div>
  </section>
</template>

<script lang="ts" setup>

import { ref, onMounted, onUnmounted, shallowRef } from "vue";
import * as echarts from "echarts";

interface Props {
  isDefault: boolean
  isSelf: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDefault: false,
  isSelf: false
})

onMounted(() => {
  props.isDefault && leftCartRender()
  props.isSelf && rightCartRender()
})

const baseData = [
  {
    name: '不及格',
    color: 'red',
    data: [60]
  },
  {
    name: '及格',
    color: '#fac858',
    data: [10]
  },
  {
    name: '良好',
    color: '#5470c6',
    data: [10]
  },
  {
    name: '优秀',
    color: 'green',
    data: [20]
  }
]
const data = {
  name: 'name00',
  estimateName: '预估值',
  estimate: 85,
  valueName: "实际值",
  value: 75
}

const leftChartDom = ref();
const leftCart = shallowRef<echarts.ECharts>()
const leftCartRender = () => {
  leftCart.value = echarts.init(leftChartDom.value);
  const options = {};
  leftCart.value.setOption(options)
}

const rightChartDom = ref();
const rightChart = shallowRef<echarts.ECharts>()
const rightCartRender = () => {
  rightChart.value = echarts.init(rightChartDom.value);
  const options = {
    title: {
      text: "子弹图示例"
    },
    tooltip: {},
    legend: {
      data: [...baseData.map(i => i.name), {
        name: data.estimateName,
        icon: 'path://M0 0M443.733333 0 h145.066667 v1024 H443.733333z'
      }, data.valueName],
      selectedMode: false
    },
    grid: {
      containLabel: true,
      width: "99%",
      left: 0,
    },
    xAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    yAxis: [
      {
        type: 'category',
        data: [data.name],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      {
        type: 'category',
        data: [''],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      }
    ],
    series: [
      ...baseData.map(i => {
        return {
          type: 'bar',
          yAxisIndex: 0,
          stack: "range",
          silent: true,
          barWidth: 40,
          ...i
        }
      }),
      {
        name: data.estimateName,
        type: "scatter",
        symbol: "rect",
        symbolSize: [2, 50],
        color: "#000000",
        hoverAnimation: false,
        data: [data.estimate],
      },
      { // 子弹图第一种形式
        name: data.valueName,
        type: "scatter",
        symbol: "circle",
        symbolSize: [20, 20],
        yAxisIndex: 1,
        color: "#71c1df",
        data: [data.value + 10],
      },
      { // 子弹图第二种形式
        name: data.valueName,
        type: 'bar',
        yAxisIndex: 1,
        barWidth: 20,
        color: "#71c1df",
        data: [{
          value: data.value,
          itemStyle: {
            borderRadius: [0, 10, 10, 0]
          }
        }],
      }
    ]
  };
  rightChart.value.setOption(options)
}

onUnmounted(() => {
  if (leftCart.value) {
    leftCart.value.clear()
    leftCart.value.dispose()
  }
  if (rightChart.value) {
    rightChart.value.clear()
    rightChart.value.dispose()
  }
})
</script>

<style scoped>
.container {
  width: 100%;
}

.charts {
  width: 600px;
  height: 400px;
}
</style>
