---
prev:
  text: 'Three 案例'
  link: '../index'
---

# 居中四面体
> 通过鼠标左键或右键，可以控制图形旋平移，通过鼠标中键滚动控制图形缩放，具体要求如下：
> 1. 创建个 1 * 1 * 1 的box
> 2. 用鼠标实现旋转、平移、缩放
> 3. 满足条件： 无论平移到哪里，旋转页面时都以模型自身为旋转中心旋转， 缩放时以鼠标位置进行缩放。

<ClientOnly>
  <centeredCube />
</ClientOnly>

<script setup>
import centeredCube from '../components/centeredCube.vue'
</script>
