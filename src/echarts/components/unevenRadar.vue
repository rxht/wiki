<template>
  <section class="container">
    asfasdf45
    <div ref="chart" class="charts"></div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const chart = ref();
onMounted(() => {
  console.log("🚀 ~ file: unevenRadar.vue:10 ~ chart:", chart);
  const myChart = echarts.init(chart.value);
  console.log("🚀 ~ file: unevenRadar.vue:15 ~ onMounted ~ myChart:", myChart)
  myChart.setOption({
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "Search Engine" },
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  });
});
</script>
<style>
.container {
  width: 800px;
  height: 600px;
}
.charts {
  width: 100%;
  height: 100%;
}
</style>
