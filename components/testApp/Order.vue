<template>
  <div class="px-4 absolute top-6 w-full">
    <div class="flex justify-between items-center px-2 w-full h-[60px] bg-white shadow-md rounded-sm text-[#181818]">
      <div class="flex">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F8BF14"
          class="mr-1">
          <path
            d="M320-440h320v-80H320v80Zm0 120h320v-80H320v80Zm0 120h200v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
        </svg>
        您有
        <span class="text-[#3D95DB]">{{ amount }}</span>
        筆進行中的訂單
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#9F9F9F">
        <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </div>
  </div>
</template>

<script setup>
const amount = ref(0)
</script>
