<template>
  <div class="w-screen h-dvh bg-[#F8F8F8]">
    <Header />
    <!-- 這是TestApp/index.vue -->
    <slot />

    <Dock />
  </div>
</template>

<script setup>
// 不能在這邊使用 會影響其他layout
// import '~/assets/css/testApp.css'
import Header from '~/components/testApp/Header.vue';
import Dock from '~/components/testApp/Dock.vue';
</script>
