<template>
  <!-- 很重要 限制高度寬度 這樣兩個childComponent都用full時才會對半分 -->
  <div class="flex flex-col h-screen w-screen relative">
    <div class="px-4 py-2 shadow w-full h-[48px] flex justify-between items-center">
      <GoogleLoginButton />
    </div>

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

<script setup>
import GoogleLoginButton from './components/common/GoogleLoginButton.vue';
// import Toast from "~/components/common/Toast.vue";
</script>
