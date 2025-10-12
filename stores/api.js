import { defineStore } from "pinia"

// TODO: 需要參考兆基 目前沒有超時結果

// 20250708 從composables/api.js 移到stores/api.js 因為在composables/api.js 不會即時更新 不知道是不是因為變數用let
export const useApiStore = defineStore("api", () => {
  const apiFetch = async (endpoint, options = {}) => {
    // 必須要用try catch包起來 因為401 Error時 不會回傳response 而是直接Error
    try {
      // console.log(import.meta.env.VITE_BASE_URL)
      // 合併默認選項和用戶提供的選項
      const mergedOptions = {
        baseURL: import.meta.env.VITE_BASE_URL,
        // 合併用戶提供的選項
        ...options,
        // 合併 headers
        headers: {
          // 在使用FormData時 不使用ContentType 為了讓上傳圖片功能可以 可以自動識別 而不是寫死application/json
          ...(!(options.body instanceof FormData) && !options.headers?.["Content-Type"]
            ? { "Content-Type": "application/json" }
            : {}),
          Accept: "application/json",
          // 加上Authorization後 會變成 "非簡單請求" 所以會預先發送OPTIONS 在後端沒有處理OPTIONS時 會CORS
          // 需要給後端安裝中間件
          Authorization: `Bearer ${useAuthStore().getAccessToken}`,
          ...(options.headers || {}),
        },
      }

      // 使用$fetch是因為對SEO最友好
      // 20250422  從useFetch改成$fetch 因為有warning
      return await $fetch(endpoint, mergedOptions)
    } catch (error) {
      // 這是error.data
      // { "code":1, "data":null, "message":"Token無效: token has invalid claims: token is expired" }
      return {
        status: error?.status || null,
        message: error?.data?.message || error?.message || "Unknown error",
        data: error?.data || null,
      }
    }
  }

  return {
    get: (endpoint, options) => apiFetch(endpoint, { method: "GET", ...options }),
    post: (endpoint, body, options) => apiFetch(endpoint, { method: "POST", body, ...options }),
    put: (endpoint, body, options) => apiFetch(endpoint, { method: "PUT", body, ...options }),
    delete: (endpoint, options) => apiFetch(endpoint, { method: "DELETE", ...options }),
  }
})
