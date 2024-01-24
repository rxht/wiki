
# 自定义标签
<ClientOnly>
  <customLabel />
</ClientOnly>

## 默认标签
类似于官网，当遇到模型遮挡后无法正常的隐藏标签。
[官网动态标签](https://threejs.org/examples/?q=css2d#css2d_label)

<ClientOnly>
  <customLabel isLabel />
</ClientOnly>

## 动态隐藏标签

<ClientOnly>
  <customLabel isLabel isDynamicHide />
</ClientOnly>

<script setup>
import customLabel from '../components/customLabel.vue'
</script>

