<template>
  <div class="flex flex-col gap-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text text-sm font-medium">儲存單字</span>
      </label>
      <div class="flex gap-2">
        <input v-model="newWord" type="text" class="input input-bordered w-full" placeholder="輸入單字" />
        <button class="btn btn-primary" :disabled="isSavingWord" @click="saveWord">
          <span v-if="isSavingWord" class="loading loading-spinner loading-sm" />
          儲存
        </button>
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
import { ref, onMounted } from 'vue'
import { useApiStore } from "~/stores/api"
import { useToastStore } from "~/stores/toast"

const apiStore = useApiStore()
const toastStore = useToastStore()

const newWord = ref("")
const isSavingWord = ref(false)
const vocabularyList = ref([])
const deletingUids = ref(new Set())

const fetchVocabulary = async () => {
  const response = await apiStore.get("/api/v1/language/word")
  if (response?.code !== 0) return
  vocabularyList.value = response.data ?? []
}

const saveWord = async () => {
  if (!newWord.value.trim()) {
    toastStore.showToast("請輸入單字", "error")
    return
  }

  try {
    isSavingWord.value = true
    const response = await apiStore.post("/api/v1/language/word", { term: newWord.value })

    if (response?.code !== 0) {
      toastStore.showToast(response?.message || "儲存失敗", "error")
      return
    }

    if (response.data) {
      vocabularyList.value.unshift(response.data)
    }
    toastStore.showToast("儲存成功", "success")
    newWord.value = ""
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
