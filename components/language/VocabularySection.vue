<template>
  <div class="flex flex-col gap-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text text-sm font-medium">儲存單字</span>
      </label>
      <div class="flex gap-2">
        <input v-model="newWord" type="text" class="input input-bordered w-full" placeholder="輸入單字" />
        <button class="btn btn-primary" :disabled="isSavingWord || !newWord.trim()" @click="saveWord">
          <span v-if="isSavingWord" class="loading loading-spinner loading-sm" />
          儲存
        </button>
      </div>

      <div v-if="isTranslating || translatedText" class="mt-2 text-sm pl-1">
        <span v-if="isTranslating" class="text-base-content/60 flex items-center gap-2">
          <span class="loading loading-dots loading-xs"></span> 翻譯中...
        </span>
        <span v-else class="text-success font-medium">
          翻譯結果：{{ translatedText }}
        </span>
      </div>
    </div>

    <div v-if="vocabularyList.length" class="flex flex-wrap gap-2">
      <button v-for="item in vocabularyList" :key="item.uid"
        class="badge badge-outline gap-1 cursor-pointer transition-colors hover:bg-red-500/20 hover:border-red-400 hover:text-red-400"
        :disabled="deletingUids.has(item.uid)" @click="deleteWord(item.uid)">
        <span v-if="deletingUids.has(item.uid)" class="loading loading-spinner loading-xs" />
        {{ item.term }}
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useApiStore } from "~/stores/api"
import { useToastStore } from "~/stores/toast"

const apiStore = useApiStore()
const toastStore = useToastStore()

// 狀態變數
const newWord = ref("")
const isSavingWord = ref(false)
const vocabularyList = ref([])
const deletingUids = ref(new Set())

// 翻譯相關變數
let debounceTimer = null
const lastCheckedWord = ref("") // 紀錄上一次檢查的單字
const translatedText = ref("")  // 儲存翻譯結果
const isTranslating = ref(false)

// 監聽輸入，實作 Debounce (防抖) 邏輯
watch(newWord, (newValue) => {
  // 清除上一次的計時器
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // 如果輸入框被清空，重置狀態並提早離開
  const trimmedValue = newValue.trim()
  if (!trimmedValue) {
    translatedText.value = ""
    lastCheckedWord.value = ""
    return
  }

  // 設定一秒 (1000ms) 後執行檢查
  debounceTimer = setTimeout(async () => {
    // 檢查和上一次翻譯的字是否不同
    if (trimmedValue !== lastCheckedWord.value) {
      lastCheckedWord.value = trimmedValue
      await translateWord(trimmedValue)
    }
  }, 1000)
})

// 呼叫翻譯 API
const translateWord = async (text) => {
  isTranslating.value = true
  translatedText.value = ""

  try {
    const response = await apiStore.post("/api/v1/language/translate", { term: text })

    if (response?.code === 0 && response?.data) {
      translatedText.value = response.data.translation
    } else {
      translatedText.value = "翻譯失敗"
    }
  } catch (err) {
    console.error("Translate error:", err)
    translatedText.value = "翻譯失敗"
  } finally {
    isTranslating.value = false
  }
}

// ===== 以下為原本的 CRUD 邏輯 =====
const fetchVocabulary = async () => {
  const response = await apiStore.get("/api/v1/language/word")
  if (response?.code !== 0) return
  vocabularyList.value = response.data ?? []
}

const saveWord = async () => {
  if (!newWord.value.trim()) return

  try {
    isSavingWord.value = true
    const payload = {
      term: newWord.value,
    }
    const response = await apiStore.post("/api/v1/language/word", payload)

    if (response?.code !== 0) {
      toastStore.showToast(response?.message || "儲存失敗", "error")
      return
    }

    if (response.data) {
      vocabularyList.value.unshift(response.data)
    }
    toastStore.showToast("儲存成功", "success")

    // 儲存成功後清空狀態
    newWord.value = ""
    translatedText.value = ""
    lastCheckedWord.value = ""
  } catch (err) {
    toastStore.showToast(err?.message || "儲存失敗", "error")
  } finally {
    isSavingWord.value = false
  }
}

const deleteWord = async (uid) => {
  if (deletingUids.value.has(uid)) return
  deletingUids.value = new Set([...deletingUids.value, uid])

  try {
    const response = await apiStore.delete(`/api/v1/language/word/${uid}`)
    if (response?.code !== 0) {
      toastStore.showToast(response?.message || "刪除失敗", "error")
      return
    }
    vocabularyList.value = vocabularyList.value.filter((item) => item.uid !== uid)
  } catch (err) {
    toastStore.showToast(err?.message || "刪除失敗", "error")
  } finally {
    const next = new Set(deletingUids.value)
    next.delete(uid)
    deletingUids.value = next
  }
}

onMounted(() => {
  fetchVocabulary()
})
</script>
