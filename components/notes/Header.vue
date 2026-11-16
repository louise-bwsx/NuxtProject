<template>
  <div class="border-s border-b border-e border-black">
    <div class="flex justify-between items-start px-4 py-1 border-b border-black">
      <div class="text-lg font-semibold">{{ title }}</div>
    </div>

    <div v-if="createDate" class="flex space-x-1 items-center px-4 py-1 border-b border-black">
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
        <path
          d="M216-96q-29.7 0-50.85-21.5Q144-139 144-168v-528q0-29 21.15-50.5T216-768h72v-96h72v96h240v-96h72v96h72q29.7 0 50.85 21.5Q816-725 816-696v528q0 29-21.15 50.5T744-96H216Zm0-72h528v-360H216v360Zm0-432h528v-96H216v96Zm0 0v-96 96Z" />
      </svg>
      <div class="text-xs whitespace-nowrap">
        {{ createDate.split("T")[0] }}
      </div>
    </div>

    <!-- 20251103 使用space-y-[4px]會和flex-wrap衝突 導致最後一個tag會比較大 改用gap-[4px] -->
    <div v-if="tags" class="flex w-full gap-[4px] flex-wrap px-4 py-1">
      <TagChip v-for="tag in tags" :key="tag">{{ tag }}</TagChip>
    </div>
  </div>
</template>

<script setup>
import TagChip from '~/components/notes/TagChip.vue'

defineProps({
  title: String,
  createDate: String,
  tags: Array,
})
</script>
