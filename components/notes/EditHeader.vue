<template>
  <div class="flex flex-col gap-2 p-3">
    <el-input type="text" v-model="title" placeholder="請輸入標題" clearable size="large" />
    <el-input-tag v-model="tags" placeholder="請輸入標籤" size="large" @add-tag="emit('addTag', $event)"
      @remove-tag="emit('removeTag', $event)" />

    <div v-if="availableTags.length" class="flex flex-col gap-1.5">
      <div class="flex flex-wrap gap-2 max-h-[96px] overflow-y-auto">
        <button v-for="tag in availableTags" :key="tag" type="button" @click="emit('pickTag', tag)"
          class="rounded-full cursor-pointer transition active:scale-95 hover:opacity-80">
          <TagChip>{{ tag }}</TagChip>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import TagChip from './TagChip.vue'

const props = defineProps({
  allTags: { type: Array, default: () => [] },
})

const title = defineModel('title')
const tags = defineModel('tags')
const emit = defineEmits(['addTag', 'removeTag', 'pickTag'])

// 已經選了的標籤不重複顯示
const availableTags = computed(() => {
  const selected = tags.value ?? []
  return props.allTags.filter(t => !selected.includes(t))
})
</script>
