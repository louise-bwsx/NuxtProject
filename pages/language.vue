<template>
  <div class="min-h-screen bg-base-200 flex flex-col">
    <div class="navbar bg-base-100 shadow-sm px-4">
      <span class="text-lg font-semibold">語言練習</span>
    </div>

    <div class="flex-1 p-4 flex flex-col gap-4">
      <!-- 語言選擇 -->
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text text-sm font-medium">練習語言</span>
        </label>
        <select v-model="selectedLanguage" class="select select-bordered w-full">
          <option v-for="option in languageOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="dropdown dropdown-top dropdown-center">
        <div tabindex="0" role="button" class="btn m-1">{{ aiChat.model }}</div>
        <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-150 w-52 p-2 shadow-sm">
          <li><a @click="aiChat.model = `gemma3:4b`">gemma3:4b</a></li>
          <li><a @click="aiChat.model = `gpt-oss:20b`">gpt-oss:20b</a></li>
        </ul>
      </div>

      <!-- 生成按鈕 -->
      <button class="btn btn-primary w-full" :disabled="isGenerating" @click="handleGenerate">
        <span v-if="isGenerating" class="loading loading-spinner loading-sm" />
        {{ isGenerating ? "生成中..." : "生成" }}
      </button>

      <!-- 句子列表 -->
      <template v-if="sentences.length">
        <div v-for="sentence in sentences" :key="sentence.uid" class="card bg-base-100 shadow">
          <div class="card-body p-4 gap-2">
            <div class="flex gap-1 items-center">
              <span class="badge badge-ghost badge-sm">{{ hintLabel }}</span>
              <p class="text-sm">{{ sentence[hintField] }}</p>
            </div>
            <textarea v-model="userInputs[sentence.uid]" class="textarea textarea-bordered w-full resize-none text-sm"
              rows="2" :placeholder="`輸入${languageOptions.find((o) => o.value === selectedLanguage)?.label}...`" />
          </div>
        </div>

        <!-- 確認按鈕 -->
        <button class="btn btn-success w-full" :disabled="isExplaining || isChecking" @click="handleConfirm">
          <span v-if="isExplaining" class="loading loading-spinner loading-sm" />
          {{ isExplaining ? "分析中..." : "確認" }}
        </button>
      </template>

      <!-- 解釋區塊 -->
      <div v-if="explanation || isExplaining" class="card bg-base-100 shadow">
        <div class="card-body p-4 gap-2">
          <h3 class="font-medium text-sm">錯誤解析</h3>
          <p class="text-sm whitespace-pre-wrap text-base-content/80">
            {{ explanation }}
            <span v-if="isExplaining" class="inline-block w-2 h-4 bg-base-content/50 animate-pulse ml-0.5" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useApiStore } from "~/stores/api"
import { useToastStore } from "~/stores/toast"

const apiStore = useApiStore()
const aiChat = useAIChatStore()

const selectedLanguage = ref("en")
const sentences = ref([])
const userInputs = ref({})
const isGenerating = ref(false)
const isChecking = ref(false)
const explanation = ref("")
const isExplaining = ref(false)

const languageOptions = [
  { label: "中文", value: "zh" },
  { label: "英文", value: "en" },
  { label: "日文", value: "ja" },
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

const hintLabel = computed(() =>
  selectedLanguage.value === "zh" ? "英文" : "中文"
)

const normalize = (str) =>
  str
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]/gu, "")

const handleGenerate = async () => {
  isGenerating.value = true
  explanation.value = ""
  userInputs.value = {}

  const response = await apiStore.post(`/api/v1/language/generate`, {
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

const handleConfirm = async () => {
  if (!sentences.value.length) {
    useToastStore().showToast("請先生成資料", "error")
    return
  }

  const targetField = fieldMap[selectedLanguage.value]

  const wrongAnswers = sentences.value
    .filter(
      (s) =>
        normalize(userInputs.value[s.uid] ?? "") !==
        normalize(s[targetField] ?? "")
    )
    .map((s) => ({
      uid: s.uid,
      answer: userInputs.value[s.uid] ?? "",
    }))

  if (!wrongAnswers.length) return

  isExplaining.value = true
  explanation.value = ""

  await apiStore.postStream(
    `/api/v1/language/explain`,
    {
      answers: wrongAnswers,
      model: aiChat.model
    },
    {
      onMessage: (content) => {
        explanation.value += content
      },
      onError: (err) => {
        useToastStore().showToast(err?.message || "解釋失敗", "error")
        isExplaining.value = false
      },
      onDone: () => {
        isExplaining.value = false
      },
    }
  )
}
</script>
