<template>
  <div>
    <button @click="emit('delete')"
      class="fixed bottom-20 left-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="~/assets/icons/delete_24_24_white.svg" class="w-[24px] h-[24px]">
    </button>

    <button @click="emit('toggle')"
      class="fixed bottom-20 right-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img v-if="mode == 'edit'" src="~/assets/icons/edit_24_24_white.svg" class="w-[24px] h-[24px]">
      <img v-else src="~/assets/icons/visibility_24_24_white.svg" class="w-[24px] h-[24px]">
    </button>

    <button @click="emit('split')"
      class="fixed bottom-35 right-5 bg-[rgba(0,0,0,0.75)] w-[40px] h-[40px] flex justify-center items-center rounded-full">
      <img src="~/assets/icons/splitVertical_24_24_white.svg" class="hidden lg:flex w-[24px] h-[24px]">
      <img src="~/assets/icons/splitHorizontal_24_24_white.svg" class="lg:hidden w-[24px] h-[24px]">
    </button>
  </div>
</template>

<script setup>
defineProps({
  mode: String,
})

const emit = defineEmits(['delete', 'toggle', 'split'])
</script>
