import { postTag, getAllTags } from "~/api/notes"

export const useNoteTags = (uid, tags) => {
  // 系統內所有標籤
  const allTags = ref([])

  // 已載入過就不重複打 API
  let loaded = false

  const loadAllTags = async () => {
    if (loaded) return

    const response = await getAllTags()

    // 同時相容「回傳整包 {code, data}」和「直接回傳陣列」兩種格式
    const list = Array.isArray(response) ? response : response?.data
    if (Array.isArray(list)) {
      allTags.value = list
      loaded = true
    }
  }

  // 新增了清單裡沒有的標籤時，同步放進 allTags
  const rememberTag = (tag) => {
    if (!allTags.value.includes(tag)) allTags.value.push(tag)
  }

  const onAddTag = async (tag) => {
    tags.value = tags.value ?? []

    // v-model 已經包含剛加入的 tag，出現超過一次代表重複
    if (tags.value.filter((t) => t === tag).length > 1) {
      tags.value.splice(tags.value.lastIndexOf(tag), 1)
      return
    }

    await postTag(uid.value, tag, "Add")
    rememberTag(tag)
  }

  // 點選下方的現有標籤
  const onPickTag = async (tag) => {
    tags.value = tags.value ?? []

    if (tags.value.includes(tag)) return
    tags.value.push(tag)
    await postTag(uid.value, tag, "Add")
  }

  const onRemoveTag = async (tag) => {
    await postTag(uid.value, tag, "Remove")
  }

  return { allTags, loadAllTags, onAddTag, onRemoveTag, onPickTag }
}
