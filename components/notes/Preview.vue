<template>
  <div class="markdown-content p-[20px] overflow-y-auto" v-html="html" />
</template>

<script setup>
import '~/assets/css/markdown.css'

const props = defineProps({
  content: String,
})

const { html } = useMarkdown(() => props.content)
</script>
