<template>
  <!-- 手機sm ~ 320px -->
  <!-- Sony手機411 832 -->
  <div class="fixed flex space-x-4 aaa">
    <div class="hidden 2xl:flex">2xl</div>
    <div class="hidden xl:flex">xl</div>
    <div class="hidden lg:flex">lg</div>
    <div class="hidden md:flex">md</div>
    <div class="hidden sm:flex">sm</div>
    <div>{{ width }} x {{ height }}</div>
  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core';

const windowSize = useWindowSize()
const width = ref(0)
const height = ref(0)

onMounted(() => {
  // 避免Hyrdation Mismatch
  width.value = windowSize.width
  height.value = windowSize.height

})
</script>
