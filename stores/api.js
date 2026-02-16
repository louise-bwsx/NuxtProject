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
        baseURL: options.baseUrl ?? import.meta.env.VITE_BASE_URL,
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

  // 專門給aiChat使用 因為stream改成true
  const postStream = async (endpoint, body, { onMessage, onError, onDone }) => {
    const url = import.meta.env.VITE_BASE_URL + endpoint

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${useAuthStore().getAccessToken}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          if (onDone) onDone()
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        // 解析 SSE 格式 (假設後端傳送 data: {...}\n\n)
        const lines = chunk.split("\n")
        for (let line of lines) {
          line = line.trim() // 移除前後空白與換行符
          // console.log(`處理中的行: "${line}"`)

          if (line.startsWith("data:")) {
            try {
              // 移除 "data:" 字串，不管後面有沒有空格
              const jsonStr = line.replace(/^data:\s*/, "")
              // console.log(`成功提取 JSON 字串: ${jsonStr}`)

              if (jsonStr) {
                const data = JSON.parse(jsonStr)
                if (onMessage) onMessage(data)
              }
            } catch (e) {
              console.warn("解析串流 JSON 失敗", e, "原始內容:", line)
            }
          }
        }
      }
    } catch (error) {
      if (onError) onError(error)
    }
  }

  return {
    postStream,
    get: (endpoint, options) => apiFetch(endpoint, { method: "GET", ...options }),
    post: (endpoint, body, options) => apiFetch(endpoint, { method: "POST", body, ...options }),
    put: (endpoint, body, options) => apiFetch(endpoint, { method: "PUT", body, ...options }),
    delete: (endpoint, options) => apiFetch(endpoint, { method: "DELETE", ...options }),
  }
})
