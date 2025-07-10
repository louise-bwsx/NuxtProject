<template>
  <!-- 20250705 加上max-h-screen 在左側有三個區塊時會被擠爆 超出螢幕高度 -->
  <div class="bbb min-w-screen min-h-screen max-h-screen flex overflow-y-hidden">
    <div class="bbb flex flex-col w-1/2">
      <DIYLocalized :appleCount="appleCount" :messageCount="messageCount" :itemCount="itemCount"
        :selectedLanguage="selectedLanguage" :name="name" :date="date" :customInput="customInput"/>

      <BeforeLocalized />

      <!-- 大概兩個小時吧 -->
      <I18NLocalized :appleCount="appleCount" :messageCount="messageCount" :itemCount="itemCount" :i18n="$i18n"
        :name="name" :date="date"/>
    </div>
    <ControlPanel 
      :selectedLanguage="selectedLanguage" 
      :appleCount="appleCount"
      :messageCount="messageCount"
      :itemCount="itemCount"
      :name="name"
      :date="date"
      @change="changeLanguage"
      @onAppleCountInput="onAppleCountInput"
      @onMessageCountInput="onMessageCountInput"
      @onItemCountInput="onItemCountInput"
      @onNameInput="onNameInput"
      @onDateInput="onDateInput"
      @onCustomInput="onCustomInput"
    />
  </div>
</template>

<script setup>
import BeforeLocalized from '~/components/localized/BeforeLocalized.vue'
import ControlPanel from '~/components/localized/ControlPanel.vue'
import DIYLocalized from '~/components/localized/DIYLocalized.vue'
import I18NLocalized from '~/components/localized/I18NLocalized.vue'

const { $i18n } = useNuxtApp()
const selectedLanguage = ref("")
const { locale } = useI18n()
const appleCount = ref(2)    // 0 顯示：沒有蘋果
const messageCount = ref("B")  // "B" 顯示：1 則訊息 
const itemCount = ref(false)     // false 顯示：1 個商品
const name = ref("aaa")
const date = ref("bbb")
const customInput = ref([])
const webAppUrl = 'https://script.google.com/macros/s/AKfycbwBx1RRtdu_DZKaI4vf1sec08Lbhnn_1pRtuXLlsqGVGPBX8Ug_HeElLTKGIOJqqcjG/exec'
const translateStore = useTranslateStore()

// 使用 Apps Script Web App 更新資料
// 使用 JSONP 避免 CORS 問題
function updateGoogleSheetWithJSONP(range, value) {
  return new Promise((resolve, reject) => {
    // jsonp_callback_1751720532944 is not defined
    const callbackName = 'jsonp_callback_' + Date.now()

    // 建立回調函數
    window[callbackName] = (data) => {
      document.head.removeChild(script)
      delete window[callbackName]
      resolve(data)
    }

    // 建立 script 標籤
    const script = document.createElement('script')
    script.src = `${webAppUrl}?range=${encodeURIComponent(range)}&value=${encodeURIComponent(value)}&callback=${callbackName}`
    script.onerror = () => {
      document.head.removeChild(script)
      delete window[callbackName]
      reject(new Error('JSONP request failed'))
    }

    document.head.appendChild(script)
  })
}

const changeLanguage = (locale) => {
  // 只更改localStorage 沒用 太慢
  localStorage.setItem('selectedLanguage', locale)
  useLanguageStore().changeLanguage(locale)

  $i18n.setLocale(locale)
}

const onAppleCountInput = (newVal) => {
  appleCount.value = newVal
}

const onMessageCountInput = (newVal) => {
  messageCount.value = newVal
}

const onItemCountInput = (newVal) => {
  itemCount.value = newVal
}

const onNameInput = (newVal) => {
  name.value = newVal
}

const onDateInput = (newVal) => {
  date.value = newVal
}

const onCustomInput = async (newVal) => {
  if (!useSheetStore().hasSameKey(newVal)) {
    useSheetStore().cacheIndex += 1;
    const lastIndex = useSheetStore().getLastRowIndex()
    
    const translationZhToEn = await useTranslateStore().translate('zh', 'en', newVal)
    const translationZhToJa = await useTranslateStore().translate('zh', 'ja', newVal)
    
    console.log("翻譯完成")
    switch (useLanguageStore().language) {
      case "zh":
        customInput.value.push({ origin: newVal, translated: newVal })
        return;
      case "en":
        customInput.value.push({ origin: newVal, translated: translationZhToEn })
        return;
      case "ja":
        customInput.value.push({ origin: newVal, translated: translationZhToJa })
        return;
    }
    // await是必要的 不然會有jsonp_callback_1751720532944 is not defined
    await updateGoogleSheetWithJSONP(`A${lastIndex}`, newVal) // key
    await updateGoogleSheetWithJSONP(`B${lastIndex}`, newVal) // zh
    await updateGoogleSheetWithJSONP(`C${lastIndex}`, translationZhToEn) // en
    await updateGoogleSheetWithJSONP(`D${lastIndex}`, translationZhToJa) // ja
  }

  customInput.value.push({ origin: newVal })
}

onMounted(async() => {
  // console.log('Current locale:', locale.value) // ✅ 顯示 "en"
  // selectedLanguage.value = locale.value
  
  selectedLanguage.value = useLanguageStore().language
})
</script>