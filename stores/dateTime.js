import { defineStore } from "pinia"

export const useDateTimeStore = defineStore("dateTime", () => {
  const now = (isUTC = false) => {
    if (isUTC) {
      // 轉成 UTC 表示（保持 Date 物件，但可用 .toISOString() 或 .getUTC... 取得）
      return new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          now.getUTCSeconds(),
          now.getUTCMilliseconds(),
        ),
      )
    }
    // console.log(`${now.getDate()}`) // 3
    // console.log(`${now.getDay()}`) // 3
    // console.log(`${now.getTime()}`) // 1756883839321
    // console.log(`${now.getTimezoneOffset()}`) // -480
    // console.log(`${now.getUTCDate()}`) // 3
    // console.log(`${now.getUTCDay()}`) // 3
    // console.log(`${now.toISOString()}`) // 2025-06-27T10:14:35.898Z
    // console.log(`${now.toDateString()}`) // Fri Jun 27 2025
    // console.log(`${now.toLocaleDateString()}`) // 2025/6/27
    // console.log(`${now.toLocaleString()}`) // 2025/6/27 下午6:14:35
    // console.log(`${now.toLocaleTimeString()}`) // 下午6:14:35
    // console.log(`${now.toJSON()}`) // 2025-09-03T07:15:02.244Z
    // console.log(`${now.toTimeString()}`) // 15:15:02 GMT+0800 (台北標準時間)
    // console.log(`${now.toUTCString()}`) // Wed, 03 Sep 2025 07:15:02 GMT
    return new Date()
  }

  const getTimeAfter15Minutes = (useUtc = false, baseDate = null) => {
    const now = baseDate || new Date()

    if (useUtc) {
      // 使用 UTC 時間計算
      const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
      return new Date(utcTime.getTime() + 15 * 60 * 1000)
    } else {
      // 使用本地時間計算
      return new Date(now.getTime() + 15 * 60 * 1000)
    }
  }

  /// 將2025-08-21T05:37:10 格式化成 2025-08-21 05:37
  const formatTo = (date) => {
    const split = date.split("T")
    const timeSplit = split[1].split(":")

    return `${split[0]} ${timeSplit[0]}:${timeSplit[1]}`
  }

  /// 將2025-08-21T05:37:10 格式化成 2025-08-21 13:37
  const formatToLocal = (dateString, divider = "-") => {
    if (dateString[dateString.length - 1] != "Z") {
      dateString += "Z"
    }

    const date = new Date(dateString)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${year}${divider}${month}${divider}${day} ${hours}:${minutes}`
  }

  // 將Mon Aug 18 2025 00:00:00 GMT+0800 (台北標準時間) 改成 2025-08-18
  const primeVueFormat = (date) => {
    // 允許的型別：Date、string、number
    if (!(date instanceof Date) && typeof date !== "string" && typeof date !== "number") {
      return ""
    }

    const dateObj = new Date(date)
    // 判斷是不是合法日期
    if (isNaN(dateObj.getTime())) {
      return ""
    }

    // 取得年、月、日
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, "0") // 月份從0開始，所以+1
    const day = String(dateObj.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    const paddedMinutes = String(minutes).padStart(1, "0")
    const paddedSeconds = String(seconds).padStart(2, "0")
    return `${paddedMinutes}:${paddedSeconds}`
  }

  return {
    now,
    getTimeAfter15Minutes,
    formatTo,
    formatToLocal,
    primeVueFormat,
    formatTime,
  }
})
