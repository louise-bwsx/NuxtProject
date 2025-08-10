import { defineStore } from "pinia";
import { useRoute } from "vue-router";

export const useCostStore = defineStore("cost", () => {
  const route = useRoute()
  const expenditureList = ref([]);
  const isLoading = ref(false);
  const todayCost = ref(undefined);

  const getTodayCost = async () => {
    // console.log(`expenditureList.value.length: ${expenditureList.value.length}`);
    if (expenditureList.value.length <= 0) {
      await getCosts()
    }

    if (expenditureList.value[0].costDate.split("T")[0] == new Date().toISOString().split("T")[0]) {
      todayCost.value = expenditureList.value[0];
    } else {
      todayCost.value = {
        breakfastCost: "0",
        breakfastType: "",
        costDate: new Date().toISOString().split("T")[0],
        dinnerCost: "0",
        dinnerType: "",
        extraCost: "0",
        extraType: "",
        lunchCost: "0",
        lunchType: "",
      };
    }
    return todayCost.value;
  };

  const getCosts = async () => {
    try {
      const response = await useApiStore().get("/api/v1/report");
      expenditureList.value = response.data.expenditureReports;
    } catch (error) {
      useToastStore().showToast(
        `不明原因 無法取得資料 請稍後再試: ${error}', 'error`
      );
    }
  };

  const searchCosts = async () => {
    try {
      // 準備查詢參數
      const params = new URLSearchParams();

      // 從 route.query 或傳入的參數中獲取搜尋條件
      const detail = route.query.detail;
      const startDate = route.query.startDate;
      const endDate = route.query.endDate;

      // 只添加有值的參數
      if (detail) {
        params.append('detail', detail);
      }
      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }

      // 建構完整的 API URL
      const apiUrl = `/api/v1/report${params.toString() ? '?' + params.toString() : ''}`;

      const response = await useApiStore().get(apiUrl);
      expenditureList.value = response.data.expenditureReports;

    } catch (error) {
      useToastStore().showToast(
        `不明原因 無法取得資料 請稍後再試: ${error}', 'error`
      );
    }
  };

  const handleSaveDay = async (body) => {
    if (isLoading.value) return;
    isLoading.value = true;

    try {
      const response = await useApiStore().post("/api/v1/report", body);

      // 刷新
      await getCosts()

      if (response.code == 0) {
        useToastStore().showToast("儲存成功", "success");
      } else {
        useToastStore().showToast(`儲存失敗: ${response.message}`, `error`);
      }
    } catch (error) {
      useToastStore().showToast(
        `不明原因 儲存失敗 請稍後再試: ${error}', 'error`
      );
    }
    isLoading.value = false;
  };

  return { expenditureList, isLoading, getTodayCost, getCosts, searchCosts, handleSaveDay, };
});
