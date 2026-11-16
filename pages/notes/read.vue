<template>
  <!-- 20251013 從h-screen改成h-full 避免出現窗雙重卷軸 -->
  <div class="w-screen h-full overflow-y-auto relative flex flex-col">
    <EditHeader v-if="currentMode == 'edit' || currentMode == 'split'" v-model:title="title" v-model:tags="tags"
      :all-tags="allTags" @add-tag="onAddTag" @remove-tag="onRemoveTag" @pick-tag="onPickTag" />

    <Header v-else-if="title" :title="title" :create-date="createDate" :tags="tags" />

    <Editor v-if="currentMode == 'edit'" v-model="content" class="outline-none w-full h-full" />

    <!-- 20251001 使用flex-1佔滿剩餘空間 加上overflow-hidden避免在水平分割時 出現多餘的捲軸 -->
    <div v-else-if="currentMode == 'split'" class="flex-1 flex flex-col lg:flex-row overflow-hidden">
      <Editor v-model="content" class="outline-none resize-none w-full lg:w-1/2 h-[50dvh] lg:h-full aaa" />
      <Preview :content="content" class="w-full lg:w-1/2 h-[50dvh] lg:h-full aaa" />
    </div>

    <Preview v-else :content="content" />

    <Actions :mode="currentMode" @delete="remove" @toggle="onVisibilityClick" @split="onSplitClick" />
  </div>
</template>

<script setup>
import Actions from '~/components/notes/Actions.vue'
import EditHeader from '~/components/notes/EditHeader.vue'
import Editor from '~/components/notes/Editor.vue'
import Header from '~/components/notes/Header.vue'
import Preview from '~/components/notes/Preview.vue'

usePageSeo({
  title: '筆記',
  description: '筆記',
})

const { uid, title, content, createDate, tags, load, persist, remove } = useNote()
const { currentMode, initMode, onVisibilityClick, onSplitClick } = useNoteMode(persist)
const { allTags, loadAllTags, onAddTag, onRemoveTag, onPickTag } = useNoteTags(uid, tags)

onMounted(async () => {
  initMode()
  await load()
})

// 進入編輯或分割模式才載入所有標籤
watch(currentMode, (mode) => {
  if (mode != 'view') loadAllTags()
})
</script>
