// server/api/translate.post.js
export default defineEventHandler(async (event) => {
  const { from, to, text } = await readBody(event);

  try {
    // 這裡沒辦法改用useApi 會導致翻譯API 500
    const response = await $fetch(
      `https://lingva.ml/api/v1/${from}/${to}/${encodeURIComponent(text)}`
    );

    return {
      success: true,
      translation: response.translation,
      original: text,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Translation failed",
    });
  }
});

// 以下還沒試過

// MyMemoryAPI 翻譯API 還沒試過
// // server/api/translate-mymemory.post.js
// export default defineEventHandler(async (event) => {
//   const { text, from, to } = await readBody(event)
//   const response = await fetch(
//     `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
//   )  
//   const data = await response.json()
//   return { translatedText: data.responseData.translatedText }
// })

// 4. Microsoft Translator Text API
// 每月 200 萬字符免費（需要註冊 Azure 帳戶）
