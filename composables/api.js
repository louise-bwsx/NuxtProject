// import { useRuntimeConfig } from "#app";

export function useApi() {
  // const config = useRuntimeConfig();
  // const userInfo = localStorage.getItem("userInfo") || "{}";
  // const userInfoObj = JSON.parse(userInfo);
  // const token = userInfoObj.access_token ? userInfoObj.access_token : "";

  const apiFetch = async (endpoint, options = {}) => {
    console.log(import.meta.env.VITE_BASE_URL)
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
        // Authorization: token ? `Bearer ${token}` : "",
        ...(options.headers || {}),
      },
    };

    // 使用useApi是因為對SEO最友好
    // 唯一的缺點就是這邊沒辦法拿response 雖然是data 但data.value才是response
    // 20250422 louise 從useFetch改成$fetch 因為有warning
    const { data } = await $fetch(endpoint, mergedOptions);

    return data.value;
  };

  return {
    get: (endpoint, options) =>
      apiFetch(endpoint, { method: "GET", ...options }),
    post: (endpoint, body, options) =>
      apiFetch(endpoint, { method: "POST", body, ...options }),
    put: (endpoint, body, options) =>
      apiFetch(endpoint, { method: "PUT", body, ...options }),
    delete: (endpoint, options) =>
      apiFetch(endpoint, { method: "DELETE", ...options }),
  };
}

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
