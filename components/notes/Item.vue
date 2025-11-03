<template>
  <!-- TODO: 沒有筆記時 顯示沒有筆記 -->
  <!-- 20250825 為了避免 title中因為其他字符 # 導致在搜尋時被截斷 使用encodeURIComponent -->
  <!-- 20251101 改用query避免因為"/"導致無法取得正確的筆記內容 -->
  <div :to="`/notes/read?title=${encodeURIComponent(note.title)}`"
    class="flex flex-col items-start flex-1 space-y-[8px] m-[10px] p-[8px] overflow-x-hidden aaa">
    <NuxtLink :to="`/notes/read?title=${encodeURIComponent(note.title)}`"
      class="text-ellipsis flex-1 overflow-hidden text-lg font-semibold line-clamp-2 w-full">
      {{ note.title }}
    </NuxtLink>

    <!-- 20251103 使用space-y-[4px]會和flex-wrap衝突 導致最後一個tag會比較大 改用gap-[4px] -->
    <div class="flex w-full gap-[4px] flex-wrap">
      <div v-for="tag in note.tags" :key="tag"
        class="aaa inline-flex items-center space-x-[6px] px-2.5 py-1 rounded-full text-xs font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-tag">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path
            d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z" />
        </svg>

        <div>{{ tag }}</div>
      </div>
    </div>

    <div class="border border-b w-full"></div>

    <div class="flex justify-between items-center w-full">
      <div class="flex space-x-[16px]">
        <div class="flex items-center space-x-[8px]">
          <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px"
            fill="currentColor" stroke="currentColor">
            <path
              d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
          </svg>
          <span class="text-sm font-medium">{{ note.viewCount }}</span>
        </div>

        <div class="flex items-center space-x-[8px]">
          <button @click="onLikeClick(note)">
            <svg v-if="note.action == 'like'" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-thumb-up">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M13 3a3 3 0 0 1 2.995 2.824l.005 .176v4h2a3 3 0 0 1 2.98 2.65l.015 .174l.005 .176l-.02 .196l-1.006 5.032c-.381 1.626 -1.502 2.796 -2.81 2.78l-.164 -.008h-8a1 1 0 0 1 -.993 -.883l-.007 -.117l.001 -9.536a1 1 0 0 1 .5 -.865a2.998 2.998 0 0 0 1.492 -2.397l.007 -.202v-1a3 3 0 0 1 3 -3z" />
              <path
                d="M5 10a1 1 0 0 1 .993 .883l.007 .117v9a1 1 0 0 1 -.883 .993l-.117 .007h-1a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-7a2 2 0 0 1 1.85 -1.995l.15 -.005h1z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-thumb-up">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
            </svg>
          </button>
          <span class="text-sm font-medium">{{ note.likeCount }}</span>
        </div>

        <div class="flex items-center space-x-[8px]">
          <button @click="onDislikeClick(note)">
            <svg v-if="note.action == 'dislike'" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 24 24" fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-thumb-down">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M13 21.008a3 3 0 0 0 2.995 -2.823l.005 -.177v-4h2a3 3 0 0 0 2.98 -2.65l.015 -.173l.005 -.177l-.02 -.196l-1.006 -5.032c-.381 -1.625 -1.502 -2.796 -2.81 -2.78l-.164 .008h-8a1 1 0 0 0 -.993 .884l-.007 .116l.001 9.536a1 1 0 0 0 .5 .866a2.998 2.998 0 0 1 1.492 2.396l.007 .202v1a3 3 0 0 0 3 3z" />
              <path
                d="M5 14.008a1 1 0 0 0 .993 -.883l.007 -.117v-9a1 1 0 0 0 -.883 -.993l-.117 -.007h-1a2 2 0 0 0 -1.995 1.852l-.005 .15v7a2 2 0 0 0 1.85 1.994l.15 .005h1z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-thumb-down">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" />
            </svg>
          </button>
          <span class="text-sm font-medium">{{ note.dislikeCount }}</span>
        </div>
      </div>

      <div class="flex items-center text-xs">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
          <path
            d="M216-96q-29.7 0-50.85-21.5Q144-139 144-168v-528q0-29 21.15-50.5T216-768h72v-96h72v96h240v-96h72v96h72q29.7 0 50.85 21.5Q816-725 816-696v528q0 29-21.15 50.5T744-96H216Zm0-72h528v-360H216v360Zm0-432h528v-96H216v96Zm0 0v-96 96Z" />
        </svg>
        <span>
          {{ props.note.createDate.split('T')[0] }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { interaction } from '~/api/notes'

const props = defineProps(["note"])
const isLoading = ref(false)

const onLikeClick = async (note) => {
  if (isLoading.value == true) return;

  isLoading.value = true

  const changeStatus = note.action == null || note.action == 'dislike' ? 'like' : null

  const response = await interaction(note.uid, useAuthStore().getUserInfo.id, changeStatus)
  if (response.code != 0) {
    useToastStore().showToast(response.message, 'error')
  }

  if (note.action == 'dislike' && changeStatus == 'like') {
    note.dislikeCount -= 1
  }

  note.action = changeStatus
  note.likeCount = changeStatus == null ? note.likeCount - 1 : note.likeCount + 1

  isLoading.value = false
}


const onDislikeClick = async (note) => {
  if (isLoading.value == true) return;

  isLoading.value = true

  const changeStatus = note.action == null || note.action == 'like' ? 'dislike' : null

  const response = await interaction(note.uid, useAuthStore().getUserInfo.id, changeStatus)
  if (response.code != 0) {
    useToastStore().showToast(response.message, 'error')
  }

  if (note.action == 'like' && changeStatus == 'dislike') {
    note.likeCount -= 1
  }

  note.action = changeStatus
  note.dislikeCount = changeStatus == null ? note.dislikeCount - 1 : note.dislikeCount + 1

  isLoading.value = false
}
</script>
