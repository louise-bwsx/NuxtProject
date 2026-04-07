<template>
  <div class="flex flex-col gap-4">
    <!-- 輸入區塊 -->
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

    <!-- 單字清單 -->
    <div v-if="vocabularyList.length" class="border border-base-300 rounded-xl overflow-hidden">
      <!-- 折疊標頭 -->
      <div class="flex items-center px-4 py-3 bg-base-200">
        <!-- 左側：折疊按鈕 -->
        <button class="flex items-center gap-2 flex-1 hover:opacity-70 transition-opacity"
          @click="isListOpen = !isListOpen">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span class="text-sm font-medium">我的單字本</span>
          <span class="badge badge-primary badge-sm">{{ vocabularyList.length }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-base-content/50 transition-transform duration-200"
            :class="{ 'rotate-180': isListOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <!-- 右側：批次刪除按鈕 -->
        <button v-if="selectedUids.size > 0" class="btn btn-error btn-xs gap-1" :disabled="isBatchDeleting"
          @click="confirmBatchDelete">
          <span v-if="isBatchDeleting" class="loading loading-spinner loading-xs" />
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
          刪除 {{ selectedUids.size }} 個
        </button>
      </div>

      <!-- 可捲動的單字清單 -->
      <div class="transition-all duration-300 overflow-hidden"
        :style="isListOpen ? `max-height: ${listMaxHeight}px` : 'max-height: 0px'">

        <!-- 搜尋框 + 全選 -->
        <div class="px-3 pt-3 flex items-center gap-2">
          <input type="checkbox" class="checkbox checkbox-sm checkbox-primary" :checked="isAllSelected"
            :indeterminate="isIndeterminate" @change="toggleSelectAll" />
          <input v-if="vocabularyList.length > 8" v-model="searchWord" type="text"
            class="input input-bordered input-sm w-full" placeholder="搜尋單字..." />
          <span v-else class="text-xs text-base-content/40">全選</span>
        </div>

        <!-- 清單 -->
        <div class="p-3 overflow-y-auto" :style="`max-height: ${listMaxHeight - 60}px`">
          <div class="flex flex-col gap-2">
            <div v-for="item in filteredList" :key="item.uid"
              class="flex items-center gap-3 px-3 py-2 rounded-lg border transition-all cursor-pointer" :class="[
                selectedUids.has(item.uid)
                  ? 'bg-primary/5 border-primary/40'
                  : 'bg-base-100 border-base-300',
                deletingUids.has(item.uid) ? 'opacity-50' : ''
              ]" @click="toggleSelect(item.uid)">
              <!-- Checkbox -->
              <input type="checkbox" class="checkbox checkbox-sm checkbox-primary shrink-0"
                :checked="selectedUids.has(item.uid)" @click.stop @change="toggleSelect(item.uid)" />

              <!-- 單字 -->
              <span class="text-sm font-medium truncate flex-1">{{ item.term }}</span>

              <!-- 單個刪除按鈕 -->
              <button class="shrink-0 p-0.5 rounded text-base-content/30 hover:text-error transition-colors"
                :disabled="deletingUids.has(item.uid)" @click.stop="confirmDeleteWord(item)">
                <span v-if="deletingUids.has(item.uid)" class="loading loading-spinner loading-xs" />
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 無搜尋結果 -->
          <div v-if="filteredList.length === 0" class="text-center py-6 text-base-content/40 text-sm">
            找不到「{{ searchWord }}」
          </div>
        </div>
      </div>
    </div>

    <!-- 確認刪除提示框 -->
    <el-dialog v-model="deleteDialog.visible" title="確認刪除" width="90%" max-width="360px" center>
      <div class="text-center text-sm text-black py-2">
        {{ deleteDialog.message }}
      </div>
      <template #footer>
        <div class="flex gap-2 justify-center">
          <button class="btn btn-cancel btn-sm" @click="deleteDialog.visible = false">取消</button>
          <button class="btn btn-error btn-sm" :disabled="deleteDialog.loading" @click="deleteDialog.onConfirm">
            <span v-if="deleteDialog.loading" class="loading loading-spinner loading-xs" />
            確認刪除
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useApiStore } from "~/stores/api"
import { useToastStore } from "~/stores/toast"

const apiStore = useApiStore()
const toastStore = useToastStore()

// 清單 UI 狀態
const isListOpen = ref(false)
const searchWord = ref('')
const listMaxHeight = 320

// 資料狀態
const newWord = ref("")
const isSavingWord = ref(false)
const vocabularyList = ref([])
const deletingUids = ref(new Set())

// 批次選取
const selectedUids = ref(new Set())
const isBatchDeleting = ref(false)

const isAllSelected = computed(() =>
  filteredList.value.length > 0 && filteredList.value.every(item => selectedUids.value.has(item.uid))
)
const isIndeterminate = computed(() =>
  filteredList.value.some(item => selectedUids.value.has(item.uid)) && !isAllSelected.value
)

const toggleSelect = (uid) => {
  const next = new Set(selectedUids.value)
  next.has(uid) ? next.delete(uid) : next.add(uid)
  selectedUids.value = next
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedUids.value = new Set()
  } else {
    selectedUids.value = new Set(filteredList.value.map(item => item.uid))
  }
}

// 確認對話框
const deleteDialog = ref({
  visible: false,
  message: '',
  loading: false,
  onConfirm: () => { }
})

const confirmDeleteWord = (item) => {
  deleteDialog.value = {
    visible: true,
    message: `確定要刪除「${item.term}」嗎？`,
    loading: false,
    onConfirm: async () => {
      deleteDialog.value.loading = true
      await deleteWord(item.uid)
      deleteDialog.value.visible = false
    }
  }
}

const confirmBatchDelete = () => {
  const count = selectedUids.value.size
  deleteDialog.value = {
    visible: true,
    message: `確定要刪除選取的 ${count} 個單字嗎？`,
    loading: false,
    onConfirm: async () => {
      deleteDialog.value.loading = true
      await batchDeleteWords()
      deleteDialog.value.visible = false
    }
  }
}

// 翻譯
let debounceTimer = null
const lastCheckedWord = ref("") // 紀錄上一次檢查的單字
const translatedText = ref("") // 儲存翻譯結果
const isTranslating = ref(false)

// 監聽輸入，實作 Debounce (防抖) 邏輯
watch(newWord, (newValue) => {
  // 清除上一次的計時器
  if (debounceTimer) clearTimeout(debounceTimer)
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
    translatedText.value = response?.code === 0 ? response.data.translation : "翻譯失敗"
  } catch {
    translatedText.value = "翻譯失敗"
  } finally {
    isTranslating.value = false
  }
}

// CRUD
const fetchVocabulary = async () => {
  const response = await apiStore.get("/api/v1/language/word")
  if (response?.code !== 0) return
  vocabularyList.value = response.data ?? []
}

const filteredList = computed(() => {
  if (!searchWord.value.trim()) return vocabularyList.value
  return vocabularyList.value.filter(item =>
    item.term.toLowerCase().includes(searchWord.value.toLowerCase())
  )
})

const saveWord = async () => {
  if (!newWord.value.trim()) return
  try {
    isSavingWord.value = true
    const response = await apiStore.post("/api/v1/language/word", { term: newWord.value })
    if (response?.code !== 0) {
      toastStore.showToast(response?.message || "儲存失敗", "error")
      return
    }
    if (response.data) vocabularyList.value.unshift(response.data)
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
    vocabularyList.value = vocabularyList.value.filter(item => item.uid !== uid)
    selectedUids.value.delete(uid)
    toastStore.showToast("刪除成功", "success")
  } catch (err) {
    toastStore.showToast(err?.message || "刪除失敗", "error")
  } finally {
    const next = new Set(deletingUids.value)
    next.delete(uid)
    deletingUids.value = next
  }
}

const batchDeleteWords = async () => {
  isBatchDeleting.value = true
  const uids = [...selectedUids.value]
  try {
    // 逐一刪除，或替換成你的批次 API
    await Promise.all(uids.map(uid => apiStore.delete(`/api/v1/language/word/${uid}`)))
    vocabularyList.value = vocabularyList.value.filter(item => !uids.includes(item.uid))
    selectedUids.value = new Set()
    toastStore.showToast(`已成功刪除 ${uids.length} 個單字`, 'success')
  } catch (e) {
    toastStore.showToast(e?.message || '批次刪除失敗', 'error')
  } finally {
    isBatchDeleting.value = false
  }
}

onMounted(() => {
  fetchVocabulary()
})
</script>
