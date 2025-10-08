<template>
  <div class="w-full h-full flex flex-col space-y-4 justify-center items-center">
    <div>將長網址轉換為短網址 存活時間固定30天</div>
    <el-input class="" type="text" v-model="longUrl" placeholder="需要縮短的網址" clearable size="large" />

    <button @click="onClickCreate" class="btn">生成短網址</button>

    <div v-if="shortUrl" class="flex space-x-4 items-center">
      <a :href="shortUrl">{{ shortUrl }}</a>
      <button @click="copy(shortUrl)" class="btn">copy</button>
    </div>
  </div>
</template>

<script setup>
import { createShortURL } from '~/api/short';

const longUrl = ref("")
const shortUrl = ref("")

const onClickCreate = async () => {
  const response = await createShortURL(longUrl.value)
  if (response.code != 0) {
    useToastStore().showToast(`縮短失敗: ${response.message}`, "error")
    return
  }

  useToastStore().showToast("縮短成功", "success")
  shortUrl.value = response.data.shortUrl
}
</script>
