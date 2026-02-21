<template>
  <div class="flex justify-center items-center h-full">
    <div v-if="isMobile" class="wrap-break-word whitespace-pre-line">
      哭哭
      無法用手機顯示Unity打包的Webgl
      在電腦顯示正常
    </div>
    <iframe v-else src="/unity/index.html?v=3" style="width:100%; height:100%; border:none;"></iframe>
  </div>
</template>

<script setup>
const isMobile = computed(() => {
  if (!window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|Android)/i)) {
    return false
  }
  return true
})

usePageSeo({
  title: '小遊戲',
  description: '我做的小遊戲',
  url: 'https://www.louise.tw/game'
})
</script>

<!-- <template>
  <canvas id="unity-canvas" style="width:100%; height:100vh;"></canvas>
</template>

<script setup>
onMounted(() => {
  const script = document.createElement("script")
  script.src = "/unity/Build/TestWebBuild.loader.js"
  script.onload = () => {
    createUnityInstance(document.querySelector("#unity-canvas"), {
      dataUrl: "/unity/Build/TestWebBuild.data",
      frameworkUrl: "/unity/Build/TestWebBuild.framework.js",
      codeUrl: "/unity/Build/TestWebBuild.wasm"
    })
  }
  document.body.appendChild(script)
})
</script> -->
