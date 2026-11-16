// view / edit / split 模式切換，persist 由 useNote 提供
export const useNoteMode = (persist) => {
  const route = useRoute()
  const router = useRouter()

  const currentMode = ref(`view`) // view, edit, split

  const initMode = () => {
    currentMode.value = route.query.mode == undefined ? 'view' : route.query.mode
  }

  const onVisibilityClick = async () => {
    if (currentMode.value == 'edit') {
      // 新增筆記時建立完成後停留在編輯模式
      const created = await persist()
      if (created) return
    }

    currentMode.value = currentMode.value == 'edit' ? 'view' : 'edit'

    const newQuery = { ...route.query }

    if (currentMode.value == 'edit') {
      newQuery.mode = 'edit'
    } else {
      delete newQuery.mode // 移除參數而不是設為 false
    }

    await router.replace({ query: newQuery })
  }

  const onSplitClick = async () => {
    currentMode.value = 'split'

    // 20251101 修正新建筆記時沒辦法透過split進行儲存
    await persist()
  }

  return { currentMode, initMode, onVisibilityClick, onSplitClick }
}
