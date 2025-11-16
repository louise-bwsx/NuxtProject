<template>
  <div style="width:100%; height:100vh;">
    <iframe src="/unity/index.html" style="width:100%; height:100%; border:none;"></iframe>
  </div>
</template>

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
