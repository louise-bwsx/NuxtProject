<template>
  <div>
    <el-input type="text" v-model="title" placeholder="請輸入標題" clearable size="large" />
    <el-input-tag v-model="tags" placeholder="請輸入標籤" size="large" @add-tag="emit('addTag', $event)"
      @remove-tag="emit('removeTag', $event)" />

    <div v-if="availableTags.length" class="flex w-full gap-[4px] flex-wrap px-4 py-1">
      <button v-for="tag in availableTags" :key="tag" type="button" @click="emit('pickTag', tag)">
        <TagChip>{{ tag }}</TagChip>
      </button>
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
