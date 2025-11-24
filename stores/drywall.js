import { defineStore } from "pinia"
import * as XLSX from "xlsx"

export const useDrywallStore = defineStore("drywall", () => {
  const width = ref(0)
  const height = ref(0)
  const hasDoor = ref(false)
  const hasWindow = ref(false)
  const doorHeight = ref(90)
  const doorWidth = ref(210)
  const windowHeight = ref(210)
  const windowWidth = ref(90)
  const windowHeightFromFloor = ref(0)

  // 參數設定
  const minFrameLengthTaiwanFoot = ref(8)
  const maxFrameLengthTaiwanFoot = ref(12)
  const frameSpacing = ref(40.5)
  const frameWidth = ref(6.5)
  const hasRockWool = ref(false)
  const isDoubleSided = ref(false)
  const boardMaterial = ref("矽酸鈣")
  const boardThickness = ref(9)
  const boardWidthCM = ref(122)
  const boardHeightCM = ref(183)

  const TAIWAN_FOOT_TO_CM = 30.303 // 台尺轉公分
  const ROCK_WOOL_SHEET_AREA = 122 * 40.5 // 4941 平方公分
  const SHEETS_PER_PACK = 8 // 棉一包8片
  const ROCK_WOOL_PACK_AREA = ROCK_WOOL_SHEET_AREA * SHEETS_PER_PACK // 39528 平方公分
  const MAX_REINFORCEMENT_WIDTH = 6.5 // 加強料最大寬度
  const TRACK_LENGTH_TAIWAN_FOOT = 8 // 上下槽固定長度 8 台尺
  const REINFORCEMENT_LENGTH_TAIWAN_FOOT = 8 // 加強料固定長度 8 台尺

  const savedSizes = ref([])
  const calculatedMaterials = ref({})

  const exportToExcel = () => {
    console.log(`calculatedMaterials: ${JSON.stringify(calculatedMaterials.value)}`) // 這是總和
    console.log(`savedSizes: ${JSON.stringify(savedSizes.value)}`)
    const workbook = XLSX.utils.book_new()
    const worksheetData = [
      [""],
      // 不能刪除prettier-ignore註解 會導致每個元素變成一個row
      // prettier-ignore
      ["樓層","隔間編號","長","高","面積","門編號","長","高","面積","窗編號","長","高","面積","小計","上下槽","加強料","橫柱","60K棉","板子","12尺","11尺","10尺","9尺","8尺","槽鐵",],
      // ["", 100], // C4
    ]

    for (let i = 0; i < savedSizes.value.length; i++) {
      const frameCount = Math.ceil(savedSizes.value[i].width / savedSizes.value[i].frameSpacing) + 1
      const frameLength = Math.ceil(savedSizes.value[i].height / TAIWAN_FOOT_TO_CM)
      const frameLengthClamped =
        frameLength <= minFrameLengthTaiwanFoot.value ? minFrameLengthTaiwanFoot.value : frameLength

      worksheetData.push(
        // prettier-ignore
        ["",i + 1,savedSizes.value[i].width,savedSizes.value[i].height,"公式=寬*高",savedSizes.value[i].hasDoor ? "" : "門編號",savedSizes.value[i].doorWidth,savedSizes.value[i].doorHeight,"公式=寬*高",savedSizes.value[i].hasWindow ? "" : "窗編號",savedSizes.value[i].windowWidth,savedSizes.value[i].windowHeight,"公式=寬*高","公式=第4格-第8格-第12格","上下槽","加強料","橫柱","60K棉","板子",frameLength >= 12 ? frameCount : 0,frameLength == 11 ? frameCount : 0,frameLength == 10 ? frameCount : 0,frameLength == 9 ? frameCount : 0,frameLength <= minFrameLengthTaiwanFoot.value ? frameCount : 0,"槽鐵",],
        ""[savedSizes.value[i]],
      )
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

    // 必須更新範圍，否則 B5~B7 不會被保存
    worksheet["!ref"] = "A1:Z200" // 或使用更精準 "A1:B7"

    // A1 註解 會常駐顯示沒辦法隱藏
    // worksheet["A1"] = { t: "s", v: "" }
    // worksheet["A1"].c = [{ t: "這是註解內容", a: "系統", hidden: true }]
    // worksheet["!comments"] = "hidden"

    // // A2 公式 錯誤時顯示 #VALUE!
    // worksheet["A2"] = {
    //   t: "n",
    //   f: "B4+B3",
    // }

    // // A3 文字
    // worksheet["B7"] = { t: "s", v: "測試" }

    XLSX.utils.book_append_sheet(workbook, worksheet, "分頁一")

    const date = new Date()
    const fileName = `隔間計算機_${date.getFullYear()}${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}${String(date.getDate()).padStart(2, "0")}_${String(date.getHours()).padStart(
      2,
      "0",
    )}${String(date.getMinutes()).padStart(2, "0")}.xlsx`

    XLSX.writeFile(workbook, fileName)
  }

  return {
    width,
    height,
    hasDoor,
    hasWindow,
    doorHeight,
    doorWidth,
    windowHeight,
    windowWidth,
    windowHeightFromFloor,
    minFrameLengthTaiwanFoot,
    maxFrameLengthTaiwanFoot,
    frameSpacing,
    frameWidth,
    hasRockWool,
    isDoubleSided,
    boardMaterial,
    boardThickness,
    boardWidthCM,
    boardHeightCM,
    TAIWAN_FOOT_TO_CM,
    ROCK_WOOL_SHEET_AREA,
    SHEETS_PER_PACK,
    ROCK_WOOL_PACK_AREA,
    MAX_REINFORCEMENT_WIDTH,
    TRACK_LENGTH_TAIWAN_FOOT,
    REINFORCEMENT_LENGTH_TAIWAN_FOOT,
    savedSizes,
    calculatedMaterials,
    exportToExcel,
  }
})
