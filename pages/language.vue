<template>
  <div class="flex flex-col flex-1 p-4 gap-4">
    <VocabularySection />

    <div class="flex items-end space-x-2">
      <!-- 暫時註解 目前只能練習英文 -->
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
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text text-sm font-medium">模型</span>
        </label>
        <!-- 用select 取代 daisy dropdown因為選項會超出螢幕 出現橫向捲軸 -->
        <select v-model="aiChat.model" class="select select-bordered w-full">
          <option>gemma3:4b</option>
          <option>gpt-oss:20b</option>
          <option>qwen2.5:32b</option>
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
      <SentenceCard v-for="sentence in sentences" :key="sentence.uid" :sentence="sentence"
        v-model="userInputs[sentence.uid]" :explanation="explanations[sentence.uid]"
        :is-explaining="explaningUids.has(sentence.uid)" :hint-field="hintField" :language-label="languageLabel"
        @block="blockSentence" @check="handleCheck" />

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
import { useAIChatStore } from "~/stores/aiChat"
import VocabularySection from '~/components/language/VocabularySection.vue'
import SentenceCard from '~/components/language/SentenceCard.vue'

const apiStore = useApiStore()
const toastStore = useToastStore()
const aiChat = useAIChatStore()

usePageSeo({
  title: '英語練習',
  description: '透過 Louise 練習英語閱讀、聽力與詞彙，提升你的語文能力',
  url: 'https://www.louise.tw/language'
})


const selectedLanguage = ref("en")
const sentences = ref([])
const userInputs = ref({})
const isGenerating = ref(false)
const isChecking = ref(false)
const isExplaining = ref(false)

// 每題獨立的解釋內容與載入狀態
const explanations = ref({}) // { [uid]: string }
const explaningUids = ref(new Set()) // 正在串流中的 uid

const languageOptions = [
  { label: "中文", value: "zh" },
  { label: "英文", value: "en" },
]

const fieldMap = { zh: "chinese", en: "english", ja: "japanese" }

const hintField = computed(() => selectedLanguage.value === "zh" ? "english" : "chinese")
const languageLabel = computed(() => languageOptions.find((o) => o.value === selectedLanguage.value)?.label)

const normalize = (str) => str.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "")

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
    toastStore.showToast(response?.message || "生成失敗", "error")
    return
  }

  sentences.value = response.data
  sentences.value.forEach((s) => {
    userInputs.value[s.uid] = ""
  })
}

// ===== 確認與串流分析 =====
const handleConfirm = async () => {
  if (!sentences.value.length) {
    toastStore.showToast("請先生成資料", "error")
    return
  }

  const targetField = fieldMap[selectedLanguage.value]
  const wrongAnswers = sentences.value.filter(
    (s) => normalize(userInputs.value[s.uid] ?? "") !== normalize(s[targetField] ?? "")
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
        toastStore.showToast(err?.message || "解釋失敗", "error")
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

// ===== 單題 AI 提示（不公布答案）=====
const handleCheck = async ({ uid, original, userInput, languageLabel }) => {
  if (explaningUids.value.has(uid)) return

  explanations.value[uid] = ""
  explaningUids.value = new Set([...explaningUids.value, uid])

  await apiStore.postStream(
    `/api/v1/language/hint`,
    { uid, original, userInput, languageLabel, model: aiChat.model },
    {
      onMessage: (content) => {
        explanations.value[uid] = (explanations.value[uid] ?? "") + content
      },
      onError: (err) => {
        toastStore.showToast(err?.message || "提示失敗", "error")
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

// ===== 封鎖句子 =====
const blockSentence = async (uid) => {
  try {
    const response = await apiStore.post("/api/v1/language/sentence", { uid })

    if (response?.status || response?.code !== 0) {
      toastStore.showToast(response?.message || "儲存失敗", "error")
      return
    }

    switch (response.data.status) {
      case `isBlock`:
        toastStore.showToast("儲存成功 這個句子不會再出現", "success")
        break
      case `isAllow`:
        toastStore.showToast("儲存成功 這個句子將會隨機出現", "success")
        break
    }
  } catch (err) {
    toastStore.showToast(err?.message || "儲存失敗", "error")
  }
}
</script>
