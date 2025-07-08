// import { useRuntimeConfig } from "#app";
import { defineStore } from "pinia";

// 20250708 louise 從composables/api.js 移到stores/api.js 因為在composables/api.js 不會即時更新 不知道是不是因為變數用let
export const useApiStore = defineStore("api", () => {
  const accessToken = ref(undefined);

  const getAccessToken = computed(() => {
    // 20250709 louise 避免出現SSR Error ERROR  [unhandledRejection] localStorage is not defined
    if (!process.client) {
      return "";
    }

    if (
      accessToken.value == null ||
      accessToken.value == "" ||
      accessToken.value == undefined
    ) {
      accessToken.value = localStorage.getItem("accessToken");
    }
    return accessToken.value;
  });

  const setAccessToken = (newaccessToken) => {
    accessToken.value = newaccessToken;
    localStorage.setItem("accessToken", newaccessToken);
  };
  // const userInfoObj = JSON.parse(userInfo);
  // const token = userInfoObj.access_token ? userInfoObj.access_token : "";

  const apiFetch = async (endpoint, options = {}) => {
    console.log(accessToken.value)
    // 必須要用try catch包起來 因為401 Error時 不會回傳response 而是直接Error
    try {
      // console.log(import.meta.env.VITE_BASE_URL)
      // 合併默認選項和用戶提供的選項
      const mergedOptions = {
        // TODO: baseURL 用env區分
        // baseURL: config.public.apiBase,
        baseURL: import.meta.env.VITE_BASE_URL,
        // 合併用戶提供的選項
        ...options,
        // 合併 headers
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // 加上Authorization後 會變成 "非簡單請求" 所以會預先發送OPTIONS 在後端沒有處理OPTIONS時 會CORS
          // 需要給後端安裝中間件
          Authorization: `Bearer ${getAccessToken.value}`,
          ...(options.headers || {}),
        },
      };

      // 使用$fetch是因為對SEO最友好
      // 20250422 louise 從useFetch改成$fetch 因為有warning
      return await $fetch(endpoint, mergedOptions);
    } catch (error) {
      // 這是error.data
      // { "code":1, "data":null, "message":"Token無效: token has invalid claims: token is expired" }
      return {
        status: error?.status || null,
        message: error?.data?.message || error?.message || "Unknown error",
        data: error?.data || null,
      };
    }
  };

  return { 
    getAccessToken,
    setAccessToken,
    get: (endpoint, options) =>
      apiFetch(endpoint, { method: "GET", ...options }),
    post: (endpoint, body, options) =>
      apiFetch(endpoint, { method: "POST", body, ...options }),
    put: (endpoint, body, options) =>
      apiFetch(endpoint, { method: "PUT", body, ...options }),
    delete: (endpoint, options) =>
      apiFetch(endpoint, { method: "DELETE", ...options }),
  };
});

// TODO: 錯誤處理
// const apiFetch = async (endpoint, options = {}) => {
//   try {
//     const { data, error } = await useFetch(endpoint, mergedOptions);
//     if (error.value) {
//       // 处理错误
//       console.error("API 错误:", error.value);
//       return { error: error.value };
//     }
//     return data.value;
//   } catch (e) {
//     console.error("请求异常:", e);
//     return { error: e };
//   }
// };