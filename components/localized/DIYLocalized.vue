<template>
  <div class="grow bbb">
    <!-- 等取得資料再顯示 不然都是-1 -->
    <div v-if="kvp.length > 0">
      <div>土炮</div>
      
      <!-- L() - 基本翻譯函數 -->
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
  </div>
</template>

<script setup>
import Papa from "papaparse";

const kvp = ref([])
const props = defineProps({
  selectedLanguage: String,
  appleCount: String,
  messageCount: String,
  itemCount: String,
  name: String,
  date: String,
});

const L = (v, p2, p3) => {
  const foundIndex = kvp.value.findIndex((i) => i[0] === v)
  
  // console.log(`foundIndex: ${foundIndex}`) // 找不到的話會是-1
  if (foundIndex == -1) {
    console.error(`找不到: ${v}`)
    return '-1';
  }
  
  // { 這也能分嗎？ 如果超級巢狀勒？

  var translateV = ""
  // console.log(`props.selectedLanguage: ${props.selectedLanguage}`)
  switch(props.selectedLanguage) {
    case "en":
      translateV = kvp.value[foundIndex][2];
      break;
    case "ja":
      translateV = kvp.value[foundIndex][3];
      break;
    case "zh":
      translateV = kvp.value[foundIndex][1];
      break;
  }

  // 如果沒有參數
  if (!p2 == undefined || !p2 == null) {
    return translateV
  }
  
  // |分割
  var translateVSplit = translateV.split('|')

  // console.log(`p2${translateVSplit[0]}: ${typeof p2}`)
  if (typeof p2 === "number" && p2 <= 1) {
    return translateVSplit[2]
  }

  try {
    // 如果|分割後index[1]有東西
    if (translateVSplit.length > 1) {
      return translateVSplit[1].trim()
    }

    // // 在p2是object時可以成功
    // // 處理 placeholder 替換
    // const params = typeof p3 === 'object' ? p3 :
    //   typeof p2 === 'object' ? p2 : {}
    // console.log(`params: ${JSON.stringify(params)}`)

    // Object.keys(params).forEach(k => {
    //   const val = params[k]
    //   translateV = translateV.replaceAll(`{${k}}`, val)
    // })
    // return translateV
    return translateVSplit[0].trim()
  } catch {
    console.error(`translateVSplit[1]: ${translateVSplit[1]}`)
    return "error"
  }
}

const sheetUrl = 'https://docs.google.com/spreadsheets/d/1toMShsJED2XOhtQ4ilyQdaoXDIUwvvg1B7CVBLgZiOM/gviz/tq?tqx=out:csv&sheet=工作表1'

onMounted(() => {
  Papa.parse(sheetUrl, {
    download: true,
    // header: true, // 使用header在取得對應語言會比較麻煩
    complete: (results) => {
      kvp.value = results.data
      // console.log('✅ 解析成功:', results.data)
    },
    error: (err) => {
      console.error('❌ 發生錯誤:', err)
    }
  })
})

</script>