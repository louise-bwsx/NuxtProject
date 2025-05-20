<template>
  <div class="absolute z-10">
    <!-- 進入時	從上方 20px 淡入下滑 -->
    <!-- 離開時	向上淡出 -->
    <!-- 持續時間	進入 300ms / 離開 200ms -->
    <!-- 緩動曲線	ease-out (進入) / ease-in (離開) -->
    <!-- Tailwind內建的 -->
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
      <div v-if="toastStore.toastType == 'info'" class="alert alert-info bg-[#00BAFE] flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {{ toastStore.message }}
      </div>
      <div v-else-if="toastStore.toastType == 'success'" class="alert alert-success bg-[#00D290] flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ toastStore.message }}
      </div>
      <div v-else-if="toastStore.toastType == 'error'" class="alert alert-error bg-[#00D290] flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ toastStore.message }}
      </div>
      <div v-else-if="toastStore.toastType == 'warning'" class="alert alert-warning bg-[#00D290] flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {{ toastStore.message }}
      </div>
    </Transition>
  </div>

  <!-- 進階技巧：多 Toast 堆疊
  如果需要支援多個 Toast 同時顯示，可以改為：

  <template>
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div v-for="(toast, index) in activeToasts" :key="toast.id">
          每個 Toast 內容
        </div>
      </TransitionGroup>
    </div>
  </template>
  需在 store 改用陣列管理多個 Toast，但這屬於進階用法，需要可再補充說明。 -->
</template>

<script setup>
import { useToastStore } from '~/stores/toast';

const toastStore = useToastStore()
</script>