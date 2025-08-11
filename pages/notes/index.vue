<template>
  <div>
    {{ notesStore.notes }}
  </div>
</template>

<script setup>
const notesStore = useNotesStore()

onMounted(() => {
  notesStore.searchNotes()
})
</script>