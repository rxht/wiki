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
    series: [
      {
        type: 'pie',
        data
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
    series: [
      {
        label: {
          formatter: ({ name }: { name: string}) => `{v|${name}}\n{hr|}`,
          rich: {
            // 文本样式
            v: { color: '#000000' },
            // 下划线样式
            hr: {
              height: 1,   // 下划线大小
              lineHeight: 10, // 下划线距离文字的间距
              width: '105%', // 下划线的长度
              backgroundColor: 'red', // 下划线颜色
            },
          },
        },
        type: 'pie',
        data,
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
