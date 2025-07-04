<template>
  <div class="h-1/2 bbb">
    <div>土炮</div>
    <!-- t() - 基本翻譯函數 -->
    <!-- 用於一般的文字翻譯，不處理複數問題： -->
    <h1>{{ L('welcome') }}</h1>
    <p>{{ L('about') }}</p>

    <!-- 巢狀翻譯 -->
    <nav>
      <a href="#">{{ L('menu.products') }}</a>
      <a href="#">{{ L('menu.services') }}</a>
    </nav>

    <!-- 根據 appleCount 的值，自動選擇對應的文字 -->
    <!-- 參數1: key, 參數2: index 在json用|隔開所以1 的時候會有AAA, 參數3: 變數 -->
    <!-- 不需要改成Lc 反而會Error -->
    <p>{{ L('apple', appleCount, { count: appleCount }) }}</p>
    <p>{{ L('message', messageCount, { count: messageCount }) }}</p>
    <p>{{ L('item', itemCount, { count: itemCount }) }}</p>

    <!-- 按鈕 -->
    <button>{{ L('button.submit') }}</button>

    <p>{{ L('greeting', { name: name, date: date }) }}</p>

    <div>
      <p>當前語言：{{ props.selectedLanguage }}</p>
      <p>可用語言：{{ props.selectedLanguage }}</p>
    </div>
  </div>
</template>

<script setup>
import Papa from "papaparse";

const props = defineProps({
  selectedLanguage: Boolean
});

const L = () => {

}

const sheetUrl = 'https://docs.google.com/spreadsheets/d/1toMShsJED2XOhtQ4ilyQdaoXDIUwvvg1B7CVBLgZiOM/gviz/tq?tqx=out:csv&sheet=工作表1'

onMounted(() => {
  Papa.parse(sheetUrl, {
    download: true,
    header: true,
    complete: (results) => {
      console.log('✅ 解析成功:', results.data)
    },
    error: (err) => {
      console.error('❌ 發生錯誤:', err)
    }
  })
})

</script>