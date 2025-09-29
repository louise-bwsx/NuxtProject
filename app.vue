<template>
  <!-- 很重要 限制高度寬度 這樣兩個childComponent都用full時才會對半分 -->
  <div class="flex flex-col h-dvh w-screen relative">
    <div class="px-4 py-2 shadow w-full h-[48px] flex justify-between items-center aaa">
      <div></div>
      <GoogleLoginButton />
    </div>

    <NuxtRouteAnnouncer />
    <!-- 為了顯示pages的index.vue內建的功能 -->
    <NuxtPage/>
    <Dock />

    <!-- 20250911 為了讓mask覆蓋整個螢幕 將MobileInput從expenditureReport移到這裡 -->
    <MobileInput />
    <Toast />
  </div>
</template>

<script setup>
import GoogleLoginButton from './components/common/GoogleLoginButton.vue';
import MobileInput from './components/expenditure/MobileInput.vue';
import Toast from "~/components/common/Toast.vue";
import Dock from './components/common/Dock.vue';

const keybindStore = useKeybindStore()

onMounted(() => {
  keybindStore.registerGlobalShortcuts()
})

onUnmounted(() => {
  keybindStore.unregisterGlobalShortcuts()
})
</script>
