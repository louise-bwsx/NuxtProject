<template>
  <!-- 20251012 避免Dock被網址覆蓋 -->
  <div class="relative flex flex-col justify-between w-screen h-dvh">
    <div class="px-4 py-2 shadow w-full h-[48px] flex justify-between items-center aaa">
      <NuxtLink to="/">
        <img src="~/assets/images/logoLight.png" alt="logo" class="w-[64px]">
      </NuxtLink>
      <GoogleLoginButton />
    </div>

    <NuxtRouteAnnouncer />

    <!-- 為了顯示pages的index.vue內建的功能 -->
    <div class="overflow-y-auto flex-1">
      <NuxtPage />
    </div>

    <Dock />

    <!-- 20250911 為了讓mask覆蓋整個螢幕 將MobileInput從expenditureReport移到這裡 -->
    <MobileInput />
    <Toast />
    <!-- <DevSize /> -->
  </div>
</template>

<script setup>
import GoogleLoginButton from './components/common/GoogleLoginButton.vue';
import MobileInput from './components/expenditure/MobileInput.vue';
import Toast from "~/components/common/Toast.vue";
import Dock from '~/components/common/Dock.vue';
import DevSize from '~/components/common/DevSize.vue';

const keybindStore = useKeybindStore()

onMounted(() => {
  keybindStore.registerGlobalShortcuts()
})

onUnmounted(() => {
  keybindStore.unregisterGlobalShortcuts()
})
</script>
