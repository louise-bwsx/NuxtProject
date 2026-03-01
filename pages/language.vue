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

    <!-- 語言選擇 -->
    <div class="flex items-end space-x-2">
      <!-- 左邊 -->
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
      <div v-for="sentence in sentences" :key="sentence.uid" class="card bg-base-100 shadow">
        <div class="card-body p-4 gap-2">
          <div class="flex gap-1 items-center">
            <span class="badge badge-ghost badge-sm text-nowrap">{{ hintLabel }}</span>
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
        <div class="text-sm markdown-content text-base-content/80" v-html="renderedContent" />
        <span v-if="isExplaining" class="inline-block w-2 h-4 bg-base-content/50 animate-pulse ml-0.5" />
      </div>
    </div>
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
// 測試用資料
// const sentences = ref([
//   {
//     "uid": 46,
//     "chinese": "老兄，沒問題，記得申報你帶的膠條，保證海關檢查順利。",
//     "english": "Mate, no worries, just declare your gum for a smooth check.",
//     "japanese": "メイト、心配ないよ。ガムを申告すれば、スムーズにチェックが通るよ。"
//   },
//   {
//     "uid": 5,
//     "chinese": "我覺得這個泳池的設施一流，夥伴。",
//     "english": "I reckon the pool's facilities are top-notch, mate.",
//     "japanese": "このプールの施設は最高だと思うよ、相棒。"
//   },
//   {
//     "uid": 7,
//     "chinese": "夥伴，我覺得搭配咖啡的酪梨吐司是早餐超棒的選擇。",
//     "english": "Mate, the avo toast with espresso is bonza for breakfast.",
//     "japanese": "メイト、エスプレッソと一緒のアボカドトーストは朝食に最高だよ。"
//   },
//   {
//     "uid": 8,
//     "chinese": "我能買包薯片和一些水果嗎，兄弟？沒問題。",
//     "english": "Can I grab a pack of chips and some fruit, mate? No worries.",
//     "japanese": "チップスと果物を買ってもいいですか、メイト？大丈夫です。"
//   },
//   {
//     "uid": 14,
//     "chinese": "嗨！我想要兩晚的雙人房，請問可以嗎？",
//     "english": "G'day! Could I get a double room for two nights, please?",
//     "japanese": "こんにちは！2泊のダブルルームをお願いできますか？"
//   }
// ])
const userInputs = ref({})
const isGenerating = ref(false)
const isChecking = ref(false)
const explanation = ref("")
const isExplaining = ref(false)

// 配置 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

// 計算渲染後的 HTML
const renderedContent = computed(() => {
  return explanation.value ? md.render(explanation.value) : ''
})

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

    const response = await apiStore.post("/api/v1/language/word", {
      term: newWord.value
    })

    if (response?.status || response?.code !== 0) {
      useToastStore().showToast(response?.message || "儲存失敗", "error")
      return
    }

    generatedSentence.value = response.data?.generatedSentence || ""

    useToastStore().showToast("儲存成功", "success")
    newWord.value = ""
  } catch (err) {
    useToastStore().showToast(err?.message || "儲存失敗", "error")
  } finally {
    isSavingWord.value = false
  }
}
</script>

<style scoped>
@import url("~/assets/css/markdown.css");
</style>
