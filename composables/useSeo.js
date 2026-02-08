// composables/useSeo.ts
export const usePageSeo = (title, description, image, url) => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.baseUrl || "https://www.louise.tw"

  useSeoMeta({
    title: `${title} - Louise`,
    description: description,

    ogTitle: `${title} - Louise`,
    ogDescription: description,
    ogImage: image || `${baseUrl}/favicon.ico`,
    ogUrl: url || baseUrl,

    twitterTitle: `${title} - Louise`,
    twitterDescription: description,
    twitterImage: image || `${baseUrl}/favicon.ico`,
  })
}

// 使用方式
// pages/chat.vue
usePageSeo({
  title: "AI 聊天機器人",
  description: "與 Louise AI 即時對話,獲得專業建議",
  url: "https://www.louise.tw/chat",
})
