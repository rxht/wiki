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

const baseData: Array<{
    weight: number;
    name: string;
    value: number;
    angle?: number;
    lineAngle?: number;
  }> = [
      {
        weight: 10,
        name: "name01",
        value: 1.58
      },
      {
        weight: 10,
        name: "name02",
        value: 2
      },
      {
        weight: 10,
        name: "name03",
        value: 2.2
      },
      {
        weight: 30,
        name: "name04",
        value: 3
      }
    ]
    
const values = baseData.map(i => i.value)
const maxValue = Math.max(...values) + 1 // 此处特意加1
const minValue = Math.min(...values) - 1 // 此处特意减1

let totalWeight = 0
for (const item of baseData) {
  totalWeight += item.weight
}
const angle = 360 / totalWeight
for (let index = 0; index < baseData.length; index++) {
  const item = baseData[index];
  item.angle = angle * item.weight
  if (index === 0) {
    item.lineAngle = item.angle / 2
    continue
  }
  const prev = baseData[index - 1]
  const _angle = ((prev.angle ?? 0) + item.angle) / 2
  item.lineAngle = (prev.lineAngle ?? 0) + _angle
}

const leftChartDom = ref();
const leftCart = shallowRef<echarts.ECharts>()
const leftCartRender = () => {
  leftCart.value = echarts.init(leftChartDom.value);
  const options = {
    radar: {
      indicator: baseData,
      shape: 'circle',
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: baseData.map(i => i.value),
          }
        ]
      }
    ]
  };
  leftCart.value.setOption(options)
}


const rightChartDom = ref();
const rightChart = shallowRef<echarts.ECharts>()
const rightCartRender = () => {
  rightChart.value = echarts.init(rightChartDom.value);
  const options = {
    angleAxis: {  // 极坐标系的角度轴。
      type: 'value',
      silent: true,
      startAngle: 90,
      min: 0,
      max: 360,
      clockwise: true,
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    radiusAxis: { // 极坐标系的径向轴。
      z: 1,
      dataMin: minValue,
      dataMax: maxValue,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        lineStyle: {
          width: 1
        }
      }
    },
    polar: {  // 极坐标系，可以用于散点图和折线图。
      radius: '70%'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        startAngle: 90,
        clockwise: true,
        z: 1,
        itemStyle: {
          color: 'rgba(255,255,255,0)',
          borderWidth: 1,
          borderColor: 'rgba(33,33,33,0.5)',
        },
        animation: false,
        silent: true,
        data: baseData.map((i) => {
          return {
            value: i.weight,
            name: i.name
          }
        })
      },
      {
        coordinateSystem: 'polar',
        type: 'line',
        showSymbol: false,
        z: 2,
        areaStyle: {
          opacity: 0,
          origin: 'start'
        },
        lineStyle: {
          opacity: 0.5
        },
        data: [...baseData, {...baseData[0], name: 'firstName'}].map(i => {
          return [i.value, i.lineAngle]
        })
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
