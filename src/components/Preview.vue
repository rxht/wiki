<template>
  <div class="preview">
    <section>
      <slot>组件不存在</slot>
    </section>
    <div v-show="codeVisible" class="source-code">
      <pre
        class="language-html"
      >
      <code class="language-html">asdfsadfasd</code>
    </pre>
    </div>
    <button class="preview-bottom" @click="codeVisible = !codeVisible">查看代码</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, defineProps, withDefaults, ref } from 'vue'
interface Props{
    name: string
}
const props = withDefaults(defineProps<Props>(), {
  name: 'preview',
})

onMounted(() => {
  console.log("onMounted", props)
});

const codeVisible = ref(false);


</script>

<style>

</style>
