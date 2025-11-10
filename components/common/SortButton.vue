<template>
  <button @click="emit('onClick')"
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap aaa">
    <svg v-if="sortType == value && sortOption == 'DESC'" xmlns="http://www.w3.org/2000/svg" height="14px"
      viewBox="0 -960 960 960" width="14px" fill="#FFFFFF">
      <path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z" />
    </svg>

    <svg v-else-if="sortType == value && sortOption == 'ASC'" xmlns="http://www.w3.org/2000/svg" height="14px"
      viewBox="0 -960 960 960" width="14px" fill="#FFFFFF">
      <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
    </svg>
    {{ title }}
  </button>
</template>

<script setup>
const props = defineProps(["title", "value", "sortType", "sortOption"])
const emit = defineEmits(["onClick"])
</script>
