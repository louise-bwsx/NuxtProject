<template>
  <div class="bbb min-w-screen min-h-screen flex">
    <div class="bbb flex flex-col w-1/2">
      <DIYLocalized />
      <div v-if="false" class="h-1/2 bbb">
        <div>土炮</div>
        <!-- t() - 基本翻譯函數 -->
        <!-- 用於一般的文字翻譯，不處理複數問題： -->
        <h1>{{ $t('welcome') }}</h1>
        <p>{{ $t('about') }}</p>

        <!-- 巢狀翻譯 -->
        <nav>
          <a href="#">{{ $t('menu.products') }}</a>
          <a href="#">{{ $t('menu.services') }}</a>
        </nav>

        <!-- 根據 appleCount 的值，自動選擇對應的文字 -->
        <!-- 參數1: key, 參數2: index 在json用|隔開所以1 的時候會有AAA, 參數3: 變數 -->
        <!-- 不需要改成$tc 反而會Error -->
        <p>{{ $t('apple', appleCount, { count: appleCount }) }}</p>
        <p>{{ $t('message', messageCount, { count: messageCount }) }}</p>
        <p>{{ $t('item', itemCount, { count: itemCount }) }}</p>

        <!-- 按鈕 -->
        <button>{{ $t('button.submit') }}</button>

        <p>{{ $t('greeting', { name: name, date: date }) }}</p>

        <div>
          <p>當前語言：{{ $i18n.locale }}</p>
          <p>可用語言：{{ $i18n.locales }}</p>
        </div>
      </div>
      <!-- 大概兩個小時吧 -->
      <I18NLocalized :appleCount="appleCount" :messageCount="messageCount" :itemCount="itemCount" :i18n="$i18n" />
    </div>
    <ControlPanel 
      :selectedLanguage="selectedLanguage"
      @change="changeLanguage" 
    />
  </div>
</template>

<script setup>
import ControlPanel from '~/components/localized/ControlPanel.vue'
import DIYLocalized from '~/components/localized/DIYLocalized.vue'
import I18NLocalized from '~/components/localized/I18NLocalized.vue'

// import { useRouter, useRoute } from "vue-router";

const { $i18n } = useNuxtApp()
const selectedLanguage = ref("")
const { locale } = useI18n()
const appleCount = ref(2)    // 顯示：沒有蘋果
const messageCount = ref(1)  // 顯示：1 則訊息
const itemCount = ref(5)     // 顯示：5 個商品

const changeLanguage = (locale) => {
  $i18n.setLocale(locale)
}

onMounted(() => {
  // const router = useRouter()
  // const route = useRoute()
  // console.log(`router.query: ${router.query}`) // undefined
  // console.log(`router.params: ${router.params}`) // undefined
  // console.log(`route.params: ${JSON.stringify(route.params)}`) // {}
  // console.log(`route.query: ${JSON.stringify(route.query)}`) // {}
  console.log('Current locale:', locale.value) // ✅ 顯示 "en"
  selectedLanguage.value = locale.value
})
</script>