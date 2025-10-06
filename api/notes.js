export const deleteNote = async (uid) => {
  const response = await useApiStore().delete(`/api/v1/notes/${uid}`)
  if (response.code === 0) {
    useToastStore().showToast("刪除成功", "success")
  } else {
    useToastStore().showToast(`刪除失敗: ${response.message}`, "error")
  }
  return response
}

// 20251006 補上createNote 為了解決新增筆記時 同一個筆記會被新增很多次 post不再有put的功能
export const createNote = async (title, content) => {
  const body = {
    title: title,
    content: content,
  }

  const response = await useApiStore().post("/api/v1/notes", body)
  if (response.code === 0) {
    useToastStore().showToast("上傳成功", "success")
  } else {
    useToastStore().showToast(`上傳失敗: ${response.message}`, "error")
  }
  return response
}

export const saveNote = async (uid, title, content) => {
  const body = {
    uid: uid,
    title: title,
    content: content,
  }

  const response = await useApiStore().put("/api/v1/notes", body)
  if (response.code === 0) {
    useToastStore().showToast("上傳成功", "success")
  } else {
    useToastStore().showToast(`上傳失敗: ${response.message}`, "error")
  }
  return response
}
