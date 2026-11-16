<template>
  <textarea ref="textareaRef" v-model="content" @paste="handlePaste" @dragover.prevent @drop="handleDrop" />
</template>

<script setup>
const content = defineModel()
const textareaRef = ref(null)

const { handlePaste, handleDrop } = useImageUpload(content, textareaRef)
</script>
