<template>
  <div class="flex flex-col flex-1 p-4 gap-4">
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

    <!-- 單字列表 -->
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

    <!-- 語言選擇 -->
    <div class="flex items-end space-x-2">
      <!-- 左邊 -->
      <!-- <div class="form-control w-full">
        <label class="label">
          <span class="label-text text-sm font-medium">練習語言</span>
        </label>
        <select v-model="selectedLanguage" class="select select-bordered w-full">
          <option v-for="option in languageOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div> -->

      <!-- 右邊 -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text text-sm font-medium">模型</span>
        </label>
        <!-- 用select 取代 daisy dropdown因為選項會超出螢幕 出現橫向捲軸 -->
        <select v-model="aiChat.model" class="select select-bordered w-full">
          <option>gemma3:4b</option>
          <option>gpt-oss:20b</option>
        </select>
      </div>
    </div>

    <!-- 生成按鈕 -->
    <button class="btn btn-primary w-full" :disabled="isGenerating" @click="handleGenerate">
      <span v-if="isGenerating" class="loading loading-spinner loading-sm" />
      {{ isGenerating ? "生成中..." : "生成" }}
    </button>

    <!-- 句子列表 -->
    <template v-if="sentences.length">
      <div v-for="sentence in sentences" :key="sentence.uid" class="flex flex-col gap-2">
        <!-- 句子卡片 -->
        <div class="card bg-[#191E24] shadow">
          <div class="card-body p-4 gap-2">
            <!-- uid + block 按鈕 -->
            <div class="flex items-center justify-between">
              <span class="text-xs text-base-content/40 font-mono">#{{ sentence.uid }}</span>
              <button @click="blockSentence(sentence.uid)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640"
                  class="fill-current text-white">
                  <path fill="rgb(255, 255, 255)"
                    d="M431.2 476.5L163.5 208.8C141.1 240.2 128 278.6 128 320C128 426 214 512 320 512C361.5 512 399.9 498.9 431.2 476.5zM476.5 431.2C498.9 399.8 512 361.4 512 320C512 214 426 128 320 128C278.5 128 240.1 141.1 208.8 163.5L476.5 431.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z" />
                </svg>
              </button>
            </div>
            <p class="text-sm">{{ sentence[hintField] }}</p>
            <textarea v-model="userInputs[sentence.uid]" class="textarea textarea-bordered w-full resize-none text-sm"
              rows="2" :placeholder="`輸入${languageOptions.find((o) => o.value === selectedLanguage)?.label}...`" />
          </div>
        </div>

        <!-- 該題的解釋區塊 -->
        <div v-if="explanations[sentence.uid] || explaningUids.has(sentence.uid)" class="card bg-base-100 shadow">
          <div class="card-body p-4 gap-2">
            <h3 class="font-medium text-sm">錯誤解析</h3>
            <div class="text-sm markdown-content text-base-content/80"
              v-html="renderMarkdown(explanations[sentence.uid] ?? '')" />
            <span v-if="explaningUids.has(sentence.uid)"
              class="inline-block w-2 h-4 bg-base-content/50 animate-pulse ml-0.5" />
          </div>
        </div>
      </div>

      <!-- 確認按鈕 -->
      <button class="btn btn-success w-full" :disabled="isExplaining || isChecking" @click="handleConfirm">
        <span v-if="isExplaining" class="loading loading-spinner loading-sm" />
        {{ isExplaining ? "分析中..." : "開始分析" }}
      </button>
    </template>
  </div>
</template>

<script setup>
import { useApiStore } from "~/stores/api"
import { useToastStore } from "~/stores/toast"
import MarkdownIt from 'markdown-it'

const apiStore = useApiStore()
const aiChat = useAIChatStore()

const selectedLanguage = ref("en")
const sentences = ref([])
const userInputs = ref({})
const isGenerating = ref(false)
const isChecking = ref(false)
const isExplaining = ref(false)

// 每題獨立的解釋內容與載入狀態
const explanations = ref({})    // { [uid]: string }
const explaningUids = ref(new Set()) // 正在串流中的 uid

// 單字列表
const vocabularyList = ref([])
const deletingUids = ref(new Set())

// 配置 markdown-it
const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

// 計算渲染後的 HTML
const renderMarkdown = (content) => content ? md.render(content) : ''

const languageOptions = [
  { label: "中文", value: "zh" },
  { label: "英文", value: "en" },
]

const fieldMap = {
  zh: "chinese",
  en: "english",
  ja: "japanese",
}

// 提示語言：選中文時顯示英文，其他顯示中文
const hintField = computed(() =>
  selectedLanguage.value === "zh" ? "english" : "chinese"
)

const normalize = (str) =>
  str.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "")

// ===== 單字列表 =====
const fetchVocabulary = async () => {
  const response = await apiStore.get("/api/v1/language/word")
  if (response?.code !== 0) return
  vocabularyList.value = response.data ?? []
}

const deleteWord = async (uid) => {
  if (deletingUids.value.has(uid)) return
  deletingUids.value = new Set([...deletingUids.value, uid])

  try {
    const response = await apiStore.delete(`/api/v1/language/word/${uid}`)
    if (response?.code !== 0) {
      useToastStore().showToast(response?.message || "刪除失敗", "error")
      return
    }
    vocabularyList.value = vocabularyList.value.filter((item) => item.uid !== uid)
  } catch (err) {
    useToastStore().showToast(err?.message || "刪除失敗", "error")
  } finally {
    const next = new Set(deletingUids.value)
    next.delete(uid)
    deletingUids.value = next
  }
}

// ===== 生成 =====
const handleGenerate = async () => {
  isGenerating.value = true
  explanations.value = {}
  explaningUids.value = new Set()
  userInputs.value = {}

  const response = await apiStore.post(`/api/v1/language/question`, {
    model: aiChat.model
  })
  isGenerating.value = false

  if (response?.status || response?.code !== 0) {
    useToastStore().showToast(response?.message || "生成失敗", "error")
    return
  }

  sentences.value = response.data
  sentences.value.forEach((s) => {
    userInputs.value[s.uid] = ""
  })
}

// ===== 確認：對每一題錯誤各自發一次串流請求 =====
const handleConfirm = async () => {
  if (!sentences.value.length) {
    useToastStore().showToast("請先生成資料", "error")
    return
  }

  const targetField = fieldMap[selectedLanguage.value]

  const wrongAnswers = sentences.value.filter(
    (s) =>
      normalize(userInputs.value[s.uid] ?? "") !==
      normalize(s[targetField] ?? "")
  )

  if (!wrongAnswers.length) return

  isExplaining.value = true

  // 每題平行發送，各自寫入自己的 explanations[uid]
  await Promise.all(
    wrongAnswers.map((s) => explainSingle(s.uid, userInputs.value[s.uid] ?? ""))
  )

  isExplaining.value = false
}

const explainSingle = async (uid, answer) => {
  explanations.value[uid] = ""
  explaningUids.value = new Set([...explaningUids.value, uid])

  await apiStore.postStream(
    `/api/v1/language/explain`,
    { answers: [{ uid, answer }], model: aiChat.model },
    {
      onMessage: (content) => {
        explanations.value[uid] = (explanations.value[uid] ?? "") + content
      },
      onError: (err) => {
        useToastStore().showToast(err?.message || "解釋失敗", "error")
        const next = new Set(explaningUids.value)
        next.delete(uid)
        explaningUids.value = next
      },
      onDone: () => {
        const next = new Set(explaningUids.value)
        next.delete(uid)
        explaningUids.value = next
      },
    }
  )
}

// ===== 儲存單字 =====
const newWord = ref("")
const isSavingWord = ref(false)
const generatedSentence = ref("")

const saveWord = async () => {
  if (!newWord.value.trim()) {
    useToastStore().showToast("請輸入單字", "error")
    return
  }

  try {
    isSavingWord.value = true
    const response = await apiStore.post("/api/v1/language/word", { term: newWord.value })

    if (response?.status || response?.code !== 0) {
      useToastStore().showToast(response?.message || "儲存失敗", "error")
      return
    }

    generatedSentence.value = response.data?.generatedSentence || ""
    // 儲存成功後直接插入列表最前面，不需重新 fetch
    vocabularyList.value.unshift(response.data)
    useToastStore().showToast("儲存成功", "success")
    newWord.value = ""
  } catch (err) {
    useToastStore().showToast(err?.message || "儲存失敗", "error")
  } finally {
    isSavingWord.value = false
  }
}

// ===== 封鎖句子 =====
const blockSentence = async (uid) => {
  try {
    const response = await apiStore.post("/api/v1/language/sentence", { uid })

    if (response?.status || response?.code !== 0) {
      useToastStore().showToast(response?.message || "儲存失敗", "error")
      return
    }

    switch (response.data.status) {
      case `isBlock`:
        useToastStore().showToast("儲存成功 這個句子不會再出現", "success")
        break
      case `isAllow`:
        useToastStore().showToast("儲存成功 這個句子將會隨機出現", "success")
        break
    }
  } catch (err) {
    useToastStore().showToast(err?.message || "儲存失敗", "error")
  }
}

// 頁面掛載時載入單字列表
onMounted(() => {
  fetchVocabulary()
})
</script>

<style scoped>
@import url("~/assets/css/markdown.css");
</style>
