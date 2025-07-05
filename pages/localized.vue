<template>
  <div class="bbb min-w-screen min-h-screen flex">
    <div class="bbb flex flex-col w-1/2">

      <DIYLocalized :appleCount="appleCount" :messageCount="messageCount" :itemCount="itemCount"
        :selectedLanguage="selectedLanguage" :name="name" :date="date" />

      <BeforeLocalized />

      <!-- 大概兩個小時吧 -->
      <I18NLocalized :appleCount="appleCount" :messageCount="messageCount" :itemCount="itemCount" :i18n="$i18n"
        :name="name" :date="date"/>
    </div>
    <ControlPanel :selectedLanguage="selectedLanguage" @change="changeLanguage" />
  </div>
</template>

<script setup>
import BeforeLocalized from '~/components/localized/BeforeLocalized.vue'
import ControlPanel from '~/components/localized/ControlPanel.vue'
import DIYLocalized from '~/components/localized/DIYLocalized.vue'
import I18NLocalized from '~/components/localized/I18NLocalized.vue'

// import { useRouter, useRoute } from "vue-router";

const { $i18n } = useNuxtApp()
const selectedLanguage = ref("")
const { locale } = useI18n()
const appleCount = ref(2)    // 0 顯示：沒有蘋果
const messageCount = ref("B")  // "B" 顯示：1 則訊息 
const itemCount = ref(false)     // false 顯示：1 個商品
const name = ref("aaa")
const date = ref("bbb")

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