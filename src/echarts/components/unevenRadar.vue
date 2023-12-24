<template>
  <section class="container">
    <div ref="chart" class="charts"></div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const chart = ref();
onMounted(() => {
  const myChart = echarts.init(chart.value);
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
  myChart.setOption({
    title: {
      left: 'center',
      text: `min: ${minValue}, max: ${maxValue}`
    },
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
  });
});
</script>
<style scoped>
.container {
  width: 800px;
  height: 600px;
}

.charts {
  width: 100%;
  height: 100%;
}
</style>
