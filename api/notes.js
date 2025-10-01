export const deleteNote = async  (uid) => {
  const response = await useApiStore().delete(`/api/v1/notes/${uid}`);
  if (response.code === 0) {
    useToastStore().showToast("刪除成功", "success")
  } else {
    useToastStore().showToast(`刪除失敗: ${response.message}`, "error")
  }
  return response
}

export const saveNote = async  (uid, title, content) => {
  const body = {
    uid: uid,
    title: title,
    content: content,
  }

  const response = await useApiStore().post('/api/v1/notes', body);
  if (response.code === 0) {
    useToastStore().showToast("上傳成功", "success")
  } else {
    useToastStore().showToast(`上傳失敗: ${response.message}`, "error")
  }
  return response
}
