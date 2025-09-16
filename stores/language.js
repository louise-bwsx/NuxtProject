import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  const sheetStore = useSheetStore()
  const getSupportLanguage = computed(() =>
    sheetStore.sheet[0].filter((
      c) => c.trim().length > 0 && c != "key"
    )
  );
  const selectedLanguage = ref('')
  const language = computed(() => selectedLanguage.value || localStorage.getItem("selectedLanguage") || 'zh');

  const L = (v, p2, p3) => {
    const foundIndex = sheetStore.sheet.findIndex((i) => i[0] === v);

    // console.log(`foundIndex: ${foundIndex}`) // 找不到的話會是-1
    if (foundIndex == -1) {
      console.error(`找不到: ${v}`);
      // 為了在customInput 用比較簡潔的運算 所以回傳""
      return "";
    }

    // { 這也能分嗎？ 如果超級巢狀勒？
    // TODO: 筆記新增完後即時更新

    var translateV = "";
    switch (language.value) {
      case "zh":
        translateV = sheetStore.sheet[foundIndex][1];
        break;
      case "en":
        translateV = sheetStore.sheet[foundIndex][2];
        break;
      case "ja":
        translateV = sheetStore.sheet[foundIndex][3];
        break;
    }

    // 如果沒有參數
    if (p2 == undefined || p2 == null) {
      return translateV;
    }

    var translateVSplit = translateV.split("|");
    // console.log(`p2${translateVSplit[0]}: ${typeof p2}`)
    // 取消註解|| Number(p2) 可以讓input 轉number 比i18N更好
    if (typeof p2 === "number" /* || Number(p2) */) {
      // |分割
      if (p2 <= 0) {
        return translateVSplit[0];
      }
      if (p2 <= 1) {
        return translateVSplit[1];
      }

      // 1以上
      for (let i = 0; i < p3.length; i++) {
        // replace找到的第一個
        translateVSplit[2] = translateVSplit[2].replace("{?}", p3[i]);
      }
      return translateVSplit[2];
    }

    // console.log(`typeof p2: ${typeof p2} ${translateV}`)
    // typeof [] 會返回object
    if (typeof p2 !== "object") {
      return translateVSplit[1];
    }

    try {
      for (let i = 0; i < p2.length; i++) {
        // replace找到的第一個
        translateV = translateV.replace("{?}", p2[i]);
      }

      return translateV.trim();
    } catch {
      console.error(`translateV: ${translateV}`);
      return "error";
    }
  };

  const changeLanguage = (locale) => {
    selectedLanguage.value = locale;
  };

  return { getSupportLanguage, L, changeLanguage, language };
})
