import { defineStore } from "pinia";
import { useRoute } from "vue-router";

export const useNotesStore = defineStore("notes", () => {
  const route = useRoute()
  const notes = ref([]);
  const page = ref(1)
  const limit = ref(30)
  const hasNoMoreData = ref(false)

  const searchNotes = async () => {
    try {
      // 準備查詢參數
      const params = new URLSearchParams();

      // 從 route.query 或傳入的參數中獲取搜尋條件
      const keyword = route.query.keyword;
      const startDate = route.query.startDate;
      const endDate = route.query.endDate;

      // 只添加有值的參數
      if (keyword) {
        params.append('keyword', keyword);
      }
      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }
      params.append('page', page.value);
      params.append('limit', limit.value);

      // 建構完整的 API URL
      const apiUrl = `/api/v1/notes${params.toString() ? '?' + params.toString() : ''}`;

      const response = await useApiStore().get(apiUrl);
      if (page.value == 1) {
        notes.value = response.data.notes;
      } else {
        notes.value.push(...response.data.notes)
      }

      page.value++;
    } catch (error) {
      useToastStore().showToast(
        `不明原因 無法取得資料 請稍後再試: ${error}', 'error`
      );
    }
  };

  const getNote = async () => {
    try {
      // 從 route.query 或傳入的參數中獲取搜尋條件
      const title = route.params.title;

      // 建構完整的 API URL
      const apiUrl = `/api/v1/notes/${title}`;

      const response = await useApiStore().get(apiUrl);
      return response.data
    } catch (error) {
      useToastStore().showToast(
        `不明原因 無法取得資料 請稍後再試: ${error}', 'error`
      );
    }
  }

  // 重置加載狀態的函數（可供外部調用）
  const resetLoadingState = () => {
    hasNoMoreData.value = false
  }

  return { notes, page, searchNotes, resetLoadingState, getNote};
});
