<template>
  <div class="w-full flex flex-col justify-start items-center p-4 space-y-8">
    <!-- https://www.youtube.com/watch?v=SODClEHLeCA -->
    <!-- 如果遇到 [GSI_LOGGER]: The given origin is not allowed for the given client ID. -->
    <!-- 需要在GCP OAuth 2.0用戶端登入 將http:localhost 新增至 已授權的 JavaScript 來源 和 已授權的重新導向 URI -->
    <!-- <NuxtLink to="/googleLogin/GoogleSign-inButton" class="btn btn-primary">
      GoogleSign-inButton
    </NuxtLink>
    <NuxtLink to="/googleLogin/useCodeClient" class="btn btn-primary">
      useCodeClient
    </NuxtLink>
    <NuxtLink to="/googleLogin/useTokenClient" class="btn btn-primary">
      useTokenClient
    </NuxtLink>
    <NuxtLink to="/localized" class="btn btn-primary">
      切換語言測試
    </NuxtLink> -->

    <Weather />

    <WorkTimeline />

    <!-- <NuxtLink to="/chat" class="btn btn-primary">
      AIChat
    </NuxtLink> -->

    <NuxtLink to="/short" class="btn btn-primary">
      短網址
    </NuxtLink>

    <NuxtLink to="/cropper" class="btn btn-primary">
      cropper圖片修改工具
    </NuxtLink>
  </div>
</template>

<script setup>
import WorkTimeline from '~/components/common/WorkTimeline.vue';
import Weather from '~/components/common/Weather.vue';

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
