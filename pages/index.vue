<template>
  <div class=" w-full h-full flex flex-col justify-center items-center">
    <NuxtLink to="/expenditureReport" class="btn btn-primary">
      收支表單
    </NuxtLink>

    <NuxtLink to="/costCharts" class="btn btn-primary">
      收支圖表
    </NuxtLink>

    <NuxtLink to="/notes" class="btn btn-primary">
      筆記列表
    </NuxtLink>

    <NuxtLink to="/localized" class="btn btn-primary">
      切換語言測試
    </NuxtLink>

    <!-- https://www.youtube.com/watch?v=SODClEHLeCA -->
    <!-- 如果遇到 [GSI_LOGGER]: The given origin is not allowed for the given client ID. -->
    <!-- 需要在GCP OAuth 2.0用戶端登入 將http:localhost 新增至 已授權的 JavaScript 來源 和 已授權的重新導向 URI -->
    <NuxtLink to="/googleLogin/GoogleSign-inButton" class="btn btn-primary">
      GoogleSign-inButton
    </NuxtLink>
    <NuxtLink to="/googleLogin/useCodeClient" class="btn btn-primary">
      useCodeClient
    </NuxtLink>
    <NuxtLink to="/googleLogin/useTokenClient" class="btn btn-primary">
      useTokenClient
    </NuxtLink>
    <NuxtLink to="/short" class="btn btn-primary">
      短網址
    </NuxtLink>

    <!-- 手機sm ~ 320px -->
    <!-- Sony手機411 832 -->
    <!-- 20250710 避免Hyration警告 -->
    <ClientOnly>
      <div>Width: {{ width }}</div>
      <div>Height: {{ height }}</div>
      <button @click="useToastStore().showToast('aaa', 'success')" class="btn">showToast</button>
    </ClientOnly>
  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
</script>
<!-- TODO: 網址需要可以大小寫不分 -->

<!--

Hangfire
    <div>一般登入</div>
    <div>Apple登入</div>
    <div>FB登入</div>
    <div>X登入</div>
    <div>mdeditor</div>
    <div>Github專案轉移</div>
    <div>Github專案轉移</div>
    <div>C#API</div>
    <div>Github專案轉移</div>
    <div>JavascriptAPI</div>
    <div>Github專案轉移</div>
    <div>PythonFlask</div>
    <div>Github專案轉移</div>
    <div>PHP</div>
    <div>Github專案轉移</div>
    <div>Flutter</div>
    <div>Github專案轉移</div>
    <div>Cyborg</div>
    <div>Github專案轉移</div>
    <div>Line機器人</div>
    <div>Github專案轉移</div>
    <div>Discord機器人</div>
    <div>Web Tutorial引導mask</div>
    <div>websoket聊天室</div>
    <div>照抄底下這樣的東西 用自己的方式 VStack{ foreaxh { chip }}</div>
    <div>
      https://www.google.com/search?q=swiftUI+flex+wrap&oq=swiftUI+flex+wrap&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIKCAEQABiABBiiBDIHCAIQABjvBTIHCAMQABjvBTIHCAQQABjvBdIBCDU3MjRqMGo0qAIAsAIB&sourceid=chrome&ie=UTF-8
    </div>
    <div>rust</div> -->
