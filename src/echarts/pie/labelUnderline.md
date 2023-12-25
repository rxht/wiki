---
prev:
  text: 'Ecahrts 案例'
  link: '../index'
---

# 标签下划线
## 介绍说明
官方案例中的饼图如下图所示，其标签为默认状态，没有特殊进行美化。

<ClientOnly>
  <labelUnderline isDefault />
</ClientOnly>

实现思路：
1. 由于需要美化标签，所以我们需要对`label.formatter`进行配置。
2. 使用`rich`属性来配置下划线样式。[饼图 rich 配置文档](https://echarts.apache.org/zh/option.html#series-pie.label.rich)


## 最终输出：
<ClientOnly>
  <labelUnderline isSelf />
</ClientOnly>

配置如下：
```typescript
const data = [
  { name: 'name00', value: 70 },
  { name: 'name01', value: 71 },
  { name: 'name02', value: 70.5 },
  { name: 'name03', value: 71.1 },
  { name: 'name04', value: 70.8 },
  { name: 'name05', value: 71.2 }
]
const myChart = echarts.init(rightChart.value);
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
myChart.setOption(options)
```

<script setup>
import labelUnderline from '../components/labelUnderline.vue'
</script>

## 参考资料
* [Echarts 富文本配置教程](https://echarts.apache.org/zh/tutorial.html#%E5%AF%8C%E6%96%87%E6%9C%AC%E6%A0%87%E7%AD%BE)
