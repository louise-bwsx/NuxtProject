<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const keybindStore = useKeybindStore()

onMounted(() => {
  keybindStore.registerGlobalShortcuts()
})

onUnmounted(() => {
  keybindStore.unregisterGlobalShortcuts()
})
</script>
