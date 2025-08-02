<template>
  <!-- 很重要 限制高度寬度 這樣兩個childComponent都用full時才會對半分 -->
  <div class="flex h-screen w-screen relative">
    <!-- <div class="bg-black text-white px-4 py-2 rounded shadow">
      測試
    </div> -->

    <!-- TODO: 目前沒辦法在這邊使用Toast 無法顯示 但是上面的測試卻可以 -->
    <!-- 跟什麼Hydration有關 改用v-show也沒用 -->
    <!-- <ClientOnly>
      <Toast />
    </ClientOnly> -->
    <NuxtRouteAnnouncer />
    <!-- 為了顯示pages的index.vue內建的功能 -->
    <NuxtPage />

  </div>
</template>

<script>
import { NuxtPage } from "#components";
// import Toast from "~/components/common/Toast.vue";
</script>
