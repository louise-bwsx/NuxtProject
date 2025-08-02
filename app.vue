<template>
  <!-- 很重要 限制高度寬度 這樣兩個childComponent都用full時才會對半分 -->
  <div class="flex h-screen w-screen">
    <NuxtRouteAnnouncer />
    <!-- 為了顯示pages的index.vue內建的功能 -->
    <NuxtPage />
  </div>
</template>

<script>
import { NuxtPage } from "#components";
</script>
