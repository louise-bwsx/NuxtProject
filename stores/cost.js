import { defineStore } from "pinia"
import { useRoute } from "vue-router"

export const useCostStore = defineStore("cost", () => {
  const route = useRoute()
  const expenditureList = ref([])
  const isLoading = ref(false)
  const todayCost = ref(undefined)
  const page = ref(1)
  const limit = ref(30)
  const hasNoMoreData = ref(false)
  const showMenu = ref(false)

  const getTodayCost = async () => {
    if (expenditureList.value.length <= 0) {
      await getCosts()
    }

    if (expenditureList.value[0].costDate.split("T")[0] == new Date().toISOString().split("T")[0]) {
      todayCost.value = expenditureList.value[0]
    } else {
      todayCost.value = {
        breakfastCost: "0",
        breakfastType: "",
        costDate: useDateTimeStore().now().split(" ")[0],
        dinnerCost: "0",
        dinnerType: "",
        extraCost: "0",
        extraType: "",
        lunchCost: "0",
        lunchType: "",
      }
    }
    return todayCost.value
  }

  const getCosts = async () => {
    try {
      const response = await useApiStore().get("/api/v1/report")
      expenditureList.value = response.data.expenditureReports
    } catch (error) {
      useToastStore().showToast(`不明原因 無法取得資料 請稍後再試: ${error}', 'error`)
    }
  }

  const searchCosts = async () => {
    try {
      // 準備查詢參數
      const params = new URLSearchParams()

      // 從 route.query 或傳入的參數中獲取搜尋條件
      const keyword = route.query.keyword
      const startDate = route.query.startDate
      const endDate = route.query.endDate

      // 只添加有值的參數
      if (keyword) {
        params.append("keyword", keyword)
      }
      if (startDate) {
        params.append("startDate", startDate)
      }
      if (endDate) {
        params.append("endDate", endDate)
      }
      params.append("page", page.value)
      params.append("limit", limit.value)

      // 建構完整的 API URL
      const apiUrl = `/api/v1/report${params.toString() ? "?" + params.toString() : ""}`

      const response = await useApiStore().get(apiUrl)
      if (page.value == 1) {
        expenditureList.value = response.data.expenditureReports
      } else {
        expenditureList.value.push(...response.data.expenditureReports)
      }

      page.value++
    } catch (error) {
      useToastStore().showToast(`不明原因 無法取得資料 請稍後再試: ${error}', 'error`)
    }
  }

  const onSaveDay = async (body) => {
    if (isLoading.value) return
    isLoading.value = true

    try {
      const response = await useApiStore().post("/api/v1/report", body)

      if (response.code == 0) {
        useToastStore().showToast("儲存成功", "success")
      } else {
        useToastStore().showToast(`儲存失敗: ${response.message}`, `error`)
      }

      // 不要在onSaveDay()裡面searchCosts()
      // searchCost跟onSaveDay沒有關聯
    } catch (error) {
      useToastStore().showToast(`不明原因 儲存失敗 請稍後再試: ${error}', 'error`)
    }
    isLoading.value = false
  }

  // 重置加載狀態的函數（可供外部調用）
  const resetLoadingState = () => {
    hasNoMoreData.value = false
    isLoading.value = false
  }

  return {
    expenditureList,
    isLoading,
    page,
    limit,
    hasNoMoreData,
    showMenu,

    getTodayCost,
    getCosts,
    searchCosts,
    onSaveDay,
    resetLoadingState,
  }
})
