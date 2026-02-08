// composables/useSeo.ts
export const usePageSeo = (title, description, image, url) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.baseUrl || "https://www.louise.tw"

  // 處理 title，只有在有值時才加上 " - Louise"
  const pageTitle = title ? `${title} - Louise` : "Louise"

  useSeoMeta({
    title: pageTitle,
    description: description,

    ogTitle: pageTitle,
    ogDescription: description,
    ogImage: image || `${baseUrl}/favicon.ico`,
    ogUrl: url || baseUrl,

    twitterTitle: pageTitle,
    twitterDescription: description,
    twitterImage: image || `${baseUrl}/favicon.ico`,
  })
}

// 使用方式
// pages/chat.vue
// usePageSeo({
//   title: "AI 聊天機器人",
//   description: "與 Louise AI 即時對話,獲得專業建議",
//   url: "https://www.louise.tw/chat",
// })
