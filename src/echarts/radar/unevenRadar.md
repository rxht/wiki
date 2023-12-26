---
prev:
  text: 'Ecahrts 案例'
  link: '../index'
---

# 不均等雷达图
## 介绍说明
官方案例中的雷达图均为等分雷达图，即雷达图中的每一项所占比角度均为一致。

<ClientOnly>
  <unevenRadar isDefault/>
</ClientOnly>

本案例提供了一种自定义占比角度的雷达图实现方案。

实现思路：
1. 由于需要实现不等分的情况，所以可以使用饼图来作为雷达图的不均等分的效果
2. 雷达图的数据则可采用echarts中的折线图[采用极坐标的方案](https://echarts.apache.org/examples/zh/editor.html?c=line-polar)进行实现


## 最终输出：
<ClientOnly>
  <unevenRadar isSelf/>
</ClientOnly>

<script setup>
import unevenRadar from '../components/unevenRadar.vue'
</script>

源码：
```typescript
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

// 计算weight所占的角度值
let totalWeight = 0
for (const item of baseData) {
  totalWeight += item.weight
}
const angle = 360 / totalWeight

// 计算得到最终的折线的点所在的角度
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
```



