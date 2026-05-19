<template>
  <!-- 為了在筆記列表儲存時 Toast水平置中 加上flex justify-center   -->
  <div class="absolute z-[100] top-[20px] w-screen flex flex-col items-center gap-2 pointer-events-none">
    <!-- 進入時	從上方 20px 淡入下滑 -->
    <!-- 離開時	向上淡出 -->
    <!-- 持續時間	進入 300ms / 離開 200ms -->
    <!-- 緩動曲線	ease-out (進入) / ease-in (離開) -->
    <!-- Tailwind內建的 -->
    <TransitionGroup
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-for="toast in toastStore.toasts" :key="toast.id" class="w-fit flex justify-center"
        :class="toastClass(toast.toastType)">
        <svg v-if="toast.toastType === 'info'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          class="h-6 w-6 shrink-0 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="toast.toastType === 'success'" xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="toast.toastType === 'error'" xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="toast.toastType === 'warning'" xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from '~/stores/toast'

const toastStore = useToastStore()

const toastClass = (type) => {
  const map = {
    info: 'alert alert-info bg-[#44BAFE]',
    success: 'alert alert-success bg-[#42D390]',
    error: 'alert alert-error bg-[#F5637E]',
    warning: 'alert alert-warning bg-[#F8B700]',
  }
  return map[type] ?? map.info
}
</script>
