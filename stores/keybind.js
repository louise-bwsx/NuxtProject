import { defineStore } from 'pinia'

export const useKeybindStore = defineStore('keybind', () => {
  const currentPageName = ref("")
  const searchListener = ref(new Map())

  const searchShortCut = (event) => {
    // 檢查是否同時按下 cmd/ctrl + k
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault(); // 防止瀏覽器默認行為

      searchListener.value.get(currentPageName.value)?.()
    }
  };

  const registerGlobalShortcuts = () => {
    document.addEventListener('keydown', searchShortCut)
  }

  const unregisterGlobalShortcuts = () => {
    document.removeEventListener('keydown', searchShortCut)
  }

  const setListener = (pageName, callback) => {
    currentPageName.value = pageName
    searchListener.value.set(pageName, callback)
  }

  const clearListener = (pageName) => {
    searchListener.value.delete(pageName)
  }

  return {
    registerGlobalShortcuts,
    unregisterGlobalShortcuts,
    setListener,
    clearListener
  }
})
