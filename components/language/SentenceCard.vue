<template>
  <div class="flex flex-col gap-2">
    <div class="card bg-[#191E24] shadow">
      <div class="card-body p-4 gap-2">
        <!-- uid + block 按鈕 -->
        <div class="flex items-center justify-between">
          <span class="text-xs text-base-content/40 font-mono">#{{ sentence.uid }}</span>
          <button @click="$emit('block', sentence.uid)" title="封鎖此句">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 640 640"
              class="fill-current text-white hover:text-red-400 transition-colors">
              <path fill="currentColor"
                d="M431.2 476.5L163.5 208.8C141.1 240.2 128 278.6 128 320C128 426 214 512 320 512C361.5 512 399.9 498.9 431.2 476.5zM476.5 431.2C498.9 399.8 512 361.4 512 320C512 214 426 128 320 128C278.5 128 240.1 141.1 208.8 163.5L476.5 431.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z" />
            </svg>
          </button>
        </div>

        <p class="text-sm">{{ sentence[hintField] }}</p>

        <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
          class="textarea textarea-bordered w-full resize-none text-sm" rows="2"
          :placeholder="`輸入${languageLabel}...`" />

        <!-- AI 提示按鈕 -->
        <div class="flex justify-end mt-1">
          <button class="btn btn-xs btn-outline gap-1" :class="isExplaining ? 'btn-disabled' : 'btn-info'"
            :disabled="isExplaining || !modelValue.trim()" @click="handleCheck" title="讓 AI 提示哪裡錯了（不公布答案）">
            <svg v-if="isExplaining" class="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {{ isExplaining ? '分析中...' : 'AI 提示' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 該題的解釋區塊 -->
    <div v-if="explanation || isExplaining" class="card bg-base-100 shadow">
      <div class="card-body p-4 gap-2">
        <h3 class="font-medium text-sm">錯誤解析</h3>
        <div class="text-sm markdown-content text-base-content/80" v-html="renderedExplanation" />
        <span v-if="isExplaining" class="inline-block w-2 h-4 bg-base-content/50 animate-pulse ml-0.5" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'

const props = defineProps({
  sentence: { type: Object, required: true },
  modelValue: { type: String, default: "" },
  explanation: { type: String, default: "" },
  isExplaining: { type: Boolean, default: false },
  hintField: { type: String, required: true },
  languageLabel: { type: String, default: "" }
})

const emit = defineEmits(['update:modelValue', 'block', 'check'])

const md = new MarkdownIt({ html: true, linkify: true, typographer: true })

const renderedExplanation = computed(() => props.explanation ? md.render(props.explanation) : '')

function handleCheck() {
  if (!props.modelValue.trim() || props.isExplaining) return
  // 把原題內容、使用者的作答、語言標籤一起傳給父層
  emit('check', {
    uid: props.sentence.uid,
    original: props.sentence[props.hintField],
    userInput: props.modelValue,
    languageLabel: props.languageLabel,
  })
}
</script>

<style scoped>
@import url("~/assets/css/markdown.css");
</style>
