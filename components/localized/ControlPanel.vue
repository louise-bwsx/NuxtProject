<template>
  <div class="w-1/2">
    <div>操作面板</div>
    {{ props.selectedLanguage }}
    <select v-model="selected" @change="emit('change', $event.target.value)">
      <option value="zh">中文</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
    </select>

    <div class="bbb">
      <div>土炮</div>
      <div>1. 網站上如何切換語言: </div>
      <div>2. 程式架構打算怎麼修改: </div>
      <div>3. 未來如何擴充新的語言: </div>
      <div>4. 語言的文字如果要調整如何改最方便: </div>
      <div>5. 是否需要後端實作: </div>
      <div>優點:</div>
      <div>缺點:</div>
      <div>需要cache 不然要下載有點慢</div>
      <div>使用TranslateAPI神經機器翻譯 (NMT) 每月前 50 萬個字元 免費</div>
    </div>

    <div class="bbb">
      <div>i18n</div>
      <div>1. 網站上如何切換語言: $i18n.setLocale</div>
      <div>2. 程式架構打算怎麼修改: 需要翻譯的字要用$t()框住</div>
      <div>3. 未來如何擴充新的語言: 要在i18n/locales/zh.json新增對應的keyValue</div>
      <div>4. 語言的文字如果要調整如何改最方便: 直接在對應的json檔 修改文字</div>
      <div>5. 是否需要後端實作: 目前看可以只靠前端</div>
      <div>優點:</div>
      <div>缺點:</div>
    </div>
  </div>
</template>

<script setup>
const selected = ref("")

const props = defineProps({
  selectedLanguage: Boolean
});

const emit = defineEmits([
  'change',
])

watch(
  () => props.selectedLanguage,
  (newVal) => {
    selected.value = props.selectedLanguage
  }
)
</script>