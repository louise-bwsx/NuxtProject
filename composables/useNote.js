import { deleteNote, createNote, saveNote, postView } from "~/api/notes"

// 筆記資料：載入 / 儲存 / 刪除
export const useNote = () => {
  const notesStore = useNotesStore()
  const router = useRouter()

  const uid = ref("")
  const title = ref(``)
  const content = ref(``)
  const createDate = ref(``)
  const updateDate = ref(``)
  const tags = ref([])

  const load = async () => {
    const data = await notesStore.getNote()
    uid.value = data == undefined ? "" : data.uid
    content.value = data == undefined ? "" : data.content
    title.value = data == undefined ? "" : data.title
    createDate.value = data == undefined ? "" : data.createDate
    updateDate.value = data == undefined ? "" : data.updateDate
    tags.value = data == undefined ? "" : data.tags

    // 避免新增筆記時觸發增加觀看數 導致出現ErrorToast
    if (uid.value != "") {
      await postView(uid.value, useAuthStore().getUserInfo.id)
    }
  }

  // 新增或儲存，回傳 true 代表這次是新增
  const persist = async () => {
    // 20251006 補上createNote 為了解決新增筆記時 同一個筆記會被新增很多次 post不再有put的功能
    // 沒有uid代表是新增
    if (uid.value == "" || uid.value == undefined) {
      const response = await createNote(title.value, content.value)
      uid.value = response.data.lastInsertID
      return true
    }

    // 20251006 後端只吃int64 不確定為什麼沒辦法用json 所以用struct
    await saveNote(+uid.value, title.value, content.value)
    return false
  }

  const remove = async () => {
    // 20251006 後端只吃int64 不確定為什麼沒辦法用json 所以用struct
    await deleteNote(+uid.value)
    await notesStore.resetLoadingState()
    router.push("/notes")
  }

  return { uid, title, content, createDate, updateDate, tags, load, persist, remove }
}
