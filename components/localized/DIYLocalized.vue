<template>
  <div class="grow  flex justify-between">
    <!-- 等取得資料再顯示 不然都是-1 -->
    <div v-if="sheet.length > 0">
      <div>土炮</div>

      <!-- L() - 基本翻譯函數 -->
      <!-- 用於一般的文字翻譯，不處理複數問題： -->
      <h1>{{ languageStore.L('welcome') }}</h1>
      <p>{{ languageStore.L('about') }}</p>

      <!-- 巢狀翻譯 -->
      <nav>
        <a href="#">{{ languageStore.L('menu.products') }}</a>
        <a href="#">{{ languageStore.L('menu.services') }}</a>
      </nav>

      <!-- 根據 appleCount 的值，自動選擇對應的文字 -->
      <!-- 參數1: key, 參數2: index 在json用|隔開所以1 的時候會有AAA, 參數3: 變數 -->
      <!-- 不需要改成Lc 反而會Error -->
      <p>{{ languageStore.L('apple', props.appleCount, [props.appleCount, 3]) }}</p>
      <p>{{ languageStore.L('message', props.messageCount, [props.messageCount]) }}</p>
      <p>{{ languageStore.L('item', props.itemCount, [props.itemCount]) }}</p>

      <!-- 按鈕 -->
      <button>{{ languageStore.L('button.submit') }}</button>

      <p>{{ languageStore.L('greeting', [props.name, props.date]) }}</p>

      <div>
        <p>當前語言：{{ props.selectedLanguage }}</p>
        <p>可用語言：{{ languageStore.getSupportLanguage }}</p>
      </div>
    </div>

    <!-- TODOWarning: 在切換語言時不應該清掉 -->
    <div class=" overflow-auto h-full gap-2 w-[250px] px-2 flex flex-col">
      <div>總共: {{ props.customInput.length }}</div>
      <div v-for="value in props.customInput" :key="value.origin">{{ languageStore.L(value.origin) || value.translated }}</div>
      <div v-for="value in props.customInput">{{ languageStore.L(value.origin) || value.translated }}</div>
    </div>
  </div>
</template>

<script setup>
const sheetStore = useSheetStore()
const languageStore = useLanguageStore()
// storeToRefs 沒辦法取得function
const { sheet } = storeToRefs(sheetStore)

const props = defineProps({
  selectedLanguage: String,
  appleCount: String,
  messageCount: String,
  itemCount: String,
  name: String,
  date: String,
  customInput: Array
});

onMounted(async () => {
  await sheetStore.fetchSheet()
})
</script>