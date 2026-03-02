<template>
  <div class="min-h-screen bg-base-200 flex justify-center px-4 py-6">
    <div class="w-full max-w-md space-y-4">

      <!-- 標題 -->
      <div>
        <h1 class="text-2xl font-bold">TTS Voice Demo</h1>
        <p class="text-sm text-gray-500">AI 中英語音生成展示(日文會很怪)</p>
      </div>

      <!-- 輸入區 -->
      <div class="form-control">
        <textarea v-model="text" class="textarea textarea-bordered w-full" placeholder="請輸入文字（最多 200 字）"
          maxlength="200" />
        <div class="text-right text-xs text-gray-400 mt-1">
          {{ text.length }}/200
        </div>
      </div>

      <!-- 按鈕 -->
      <button class="btn btn-primary w-full" :class="{ 'btn-disabled': loading }" @click="speak">
        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
        <span v-if="!loading">生成語音</span>
      </button>

      <!-- 歷史紀錄 -->
      <div v-if="history.length" class="card bg-base-100 shadow">
        <div class="card-body p-4">
          <h2 class="font-semibold mb-2">歷史紀錄</h2>

          <div v-for="item in history" :key="item.uid"
            class="flex justify-between items-center py-2 border-b border-base-200">
            <div class="w-2/3 text-sm truncate">
              {{ item.text }}
            </div>

            <div class="flex gap-2">
              <button class="btn btn-xs btn-outline" @click="playHistory(item)">
                播放
              </button>

              <button class="btn btn-xs btn-error" @click="deleteItem(item.uid)">
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
const loading = ref(false)
const history = ref([])
const userId = ref(``)

const playHistory = (item) => {
  if (!item?.audioPath) return

  const baseURL = import.meta.env.VITE_BASE_URL
  const fullUrl = item.audioPath.startsWith('http')
    ? item.audioPath
    : `${baseURL}${item.audioPath}`

  new Audio(fullUrl).play()
}

const deleteItem = async (uid) => {
  if (!uid) return

  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/v1/tts/history/${uid}`,
      {
        method: 'DELETE'
      }
    )

    if (!res.ok) return

    await fetchHistory()

  } catch (err) {
    return
  }
}

const speak = async () => {
  if (!text.value.trim()) return
  if (text.value.length > 50) return

  loading.value = true

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/v1/tts/handler`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore().getAccessToken}`
        },
        body: JSON.stringify({
          text: text.value,
          userId: userId.value
        })
      }
    )

    if (!response.ok) {
      loading.value = false
      return
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    new Audio(url).play()

    text.value = ''
    await fetchHistory()

  } catch (err) {
    loading.value = false
    return
  }

  loading.value = false
}

const fetchHistory = async () => {
  if (!userId.value) return
  try {

    const response = await useApiStore().get(`/api/v1/tts/history/${userId.value}`)
    if (response.code != 0) {
      useToastStore().showToast(`取得所有音檔失敗`, "error")
      return
    }

    history.value = response.data
  } catch (err) {
    return
  }
}

onMounted(() => {
  userId.value = useAuthStore().getUserInfo.id
  fetchHistory()
})
</script>
