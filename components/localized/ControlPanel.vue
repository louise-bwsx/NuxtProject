<template>
  <div class="w-1/2">
    <div>操作面板</div>
    顯示語言:
    <select v-model="selected" @change="emit('change', $event.target.value)">
      <option value="zh">中文</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
    </select>

    <div class="flex flex-col">
      <div><span>AppleCount:</span> <input type="text" v-model="props.appleCount"
          @input="emit('onAppleCountInput', $event.target.value)" placeholder="appleCount"></div>
      <div><span>MessageCount:</span> <input type="text" v-model="props.messageCount"
          @input="emit('onMessageCountInput', $event.target.value)" placeholder="messageCount"></div>
      <div><span>ItemCount:</span> <input type="text" v-model="props.itemCount"
          @input="emit('onItemCountInput', $event.target.value)" placeholder="itemCount"></div>
      <div><span>Name:</span> <input type="text" v-model="props.name" @input="emit('onNameInput', $event.target.value)"
          placeholder="name"></div>
      <div><span>Date:</span> <input type="text" v-model="props.date" @input="emit('onDateInput', $event.target.value)"
          placeholder="date"></div>
      <div>
        <span>自訂輸入:</span> <input type="text" placeholder="自訂輸入"
          @keyup.enter="emit('onCustomInput', $event.target.value)">
      </div>
      <button class="w-full flex justify-start" @click="useSheetStore().hasSameKey('1bb2')">hasSameKey</button>
      <button class="w-full flex justify-start" @click="useSheetStore().getLastRowIndex()">getLastRowIndex</button>
      <button class="w-full flex justify-start" @click="useSheetStore().getColumnTop(1)">getColumnTop</button>
    </div>

    <div class="bbb">
      <div>土炮</div>
      <div>1. 網站上如何切換語言: </div>
      <div>2. 程式架構打算怎麼修改: </div>
      <div>3. 未來如何擴充新的語言: </div>
      <div>4. 語言的文字如果要調整如何改最方便: </div>
      <div>5. 是否需要後端實作: </div>
      <div>優點:</div>
      <div>很酷</div>
      <div>缺點:</div>
      <div>需要cache 不然要下載有點慢</div>
      <div>使用TranslateAPI神經機器翻譯 (NMT) 每月前 50 萬個字元 免費</div>
      <div>假設有跳行會導致錯誤 例如資料只到16行 但B17有資料 會錯誤</div>
      <div>免費的翻譯API超慢</div>
      <div>自訂輸入目前只有中文</div>
      <div>在很多人使用的情況下可能會重複覆蓋 導致資料錯誤</div>
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
  selectedLanguage: String,
  appleCount: String,
  messageCount: String,
  itemCount: String,
  name: String,
  date: String,
});

const emit = defineEmits([
  'change',
  'onAppleCountInput',
  'onMessageCountInput',
  'onItemCountInput',
  'onNameInput',
  'onDateInput',
  'onCustomInput',
])

watch(
  () => props.selectedLanguage,
  (newVal) => {
    selected.value = props.selectedLanguage
  }
)
</script>