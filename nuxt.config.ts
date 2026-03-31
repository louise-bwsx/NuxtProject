import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app:{
    head:{
      htmlAttrs:{
        "data-theme": "dark", // 強制 DaisyUI 使用 dark 主題
        class: "dark"// 強制 Tailwind 的 dark: 修飾符生效
      }
      // 可以透過chrome > 右上角更多 > 設定 > 外觀 > 模式 > 淺色來確認
    }
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "~/assets/css/elementPlus.css"],
  vite: {
    build: {
      // 20260331 告訴bundler 把echarts相關城市集中輸出成同一個.js 避免重複打包
      rollupOptions: {
        output: {
          manualChunks: {
            'echarts': ['echarts'],
          }
        }
      },
      // 20260331 關閉deploy時的sourcemap警告 sourcemap只是
      // 是一個記錄「打包後的程式碼」對應到「原始程式碼」哪一行的對照表，副檔名通常是 .map。
      // production 因為壓縮及安全的原因不應該開啟
      sourcemap: false
    },
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "nuxt-vue3-google-signin",
    "@element-plus/nuxt",
  ],
  // 為了避免進入/cropper時出現warning Failed to resolve component
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('cropper-')
    }
  },
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
