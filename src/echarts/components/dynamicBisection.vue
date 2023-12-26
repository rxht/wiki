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

const data = [
  { name: 'name00', value: 70 },
  { name: 'name01', value: 71 },
  { name: 'name02', value: 70.5 },
  { name: 'name03', value: 71.1 },
  { name: 'name04', value: 70.8 },
  { name: 'name05', value: 71.2 }
]
const leftChartDom = ref();
const leftCart = shallowRef<echarts.ECharts>()
const leftCartRender = () => {
  leftCart.value = echarts.init(leftChartDom.value);
  const options = {
    xAxis: {
      type: 'category',
      data: data.map(i => i.name)
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => {
          return value.toFixed(2) + '%';
        },
        splitLine: {
          show: true
        },
      },
    },
    series: [
      {
        type: 'line',
        data: data.map(i => i.value)
      }
    ]
  };
  leftCart.value.setOption(options)
}

const rightChartDom = ref();
const rightChart = shallowRef<echarts.ECharts>()
const rightCartRender = () => { 
  rightChart.value = echarts.init(rightChartDom.value);
  // 准备数值数据
  const dataList = data.map(i => i.value)
  const intervalNum = 5 // 切割份数
  // 计算数据最大值和最小值
  const maxValue = Math.max(...dataList);
  const minValue = Math.min(...dataList)
  // 计算间隔，返回y轴最大值，y轴最小值 ，间隔
  const getLeftData = function (min: number, max: number) {
    const diff = max - min
    const _max = max + diff
    const _min = min - diff
  
    return {
      max: _max,
      min: _min,
      interval: (_max - _min) / intervalNum,
    };
  }
  const interObj = getLeftData(minValue, maxValue)

  const options = {
    xAxis: {
      type: 'category',
      data: data.map(i => i.name),
    },
    yAxis: {
      type: 'value',
      interval: interObj.interval,
      min: interObj.min,
      max: interObj.max,
      axisLabel: {
        interval: 'auto',
        formatter: function (value: number) {
          return value.toFixed(2) + '%';
        }
      },
      splitLine: {
        show: true
      },
    },
    series: [{
      data: dataList,
      type: 'line',
    }]
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
