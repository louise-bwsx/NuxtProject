<template>
  <div>
    <el-input v-model="text" />
    <button @click="speak">aaa</button>
  </div>
</template>

<script setup>
const text = ref(``)
const speak = async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/tts/handler`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useAuthStore().getAccessToken}`
    },
    body: JSON.stringify({
      text: text.value,
      ref_audio_path: '/Users/wangshihchieh/Desktop/sample.wav',
      prompt_text: '在Mac上錄音非常簡單 主要可透過內建的Quick Time Player'
    })
  })

  if (!response.ok) {
    console.error('TTS 失敗', await response.text())
    return
  }

  // 原生 fetch 才有 .blob()
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)
  audio.play()
}
</script>
