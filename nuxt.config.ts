import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "~/assets/css/elementPlus.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "nuxt-vue3-google-signin",
    "@element-plus/nuxt",
  ],
  i18n: {
    bundle: {
      // 為了關掉yarn dev顯示的warning true或false都可以
      // 因為這個設定有問題 再v10以後會deprecated
      optimizeTranslationDirective: false,
    },
    // 支援的語言列表
    locales: [
      { code: "zh", name: "中文", file: "zh.json" },
      { code: "en", name: "English", file: "en.json" },
      { code: "ja", name: "日本語", file: "ja.json" },
    ],

    // 預設語言
    defaultLocale: "zh",

    // 翻譯檔案的位置
    langDir: "locales/",

    // 翻譯檔案配置
    lazy: true,

    // URL 策略
    strategy: "prefix_except_default",
  },
  googleSignIn: {
    clientId:
      "254859062418-c7pr9ecdhai0hmttks0mskgdiiol4hav.apps.googleusercontent.com",
  },
});
