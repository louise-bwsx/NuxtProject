// /api/workHours.js
const api = () => useApiStore()

// apiFetch 出錯時回傳 { status, message, data };成功時是資料本身
// (DELETE 成功是 204,會得到 undefined,所以要先判斷是不是物件)
export const isApiError = (res) =>
  !!res && typeof res === "object" && !Array.isArray(res) && "status" in res && "message" in res

export const getWorkLogs = async (from, to) => {
  return await api().get(`/api/v1/workLogs?from=${from}&to=${to}`)
}

// 只搜尋地址與備註
export const searchWorkLogs = async (q) => {
  return await api().get(`/api/v1/workLogs?q=${encodeURIComponent(q)}`)
}

export const putWorkLog = async (date, body) => {
  return await api().put(`/api/v1/workLogs/${date}`, body)
}

export const deleteWorkLog = async (date) => {
  return await api().delete(`/api/v1/workLogs/${date}`)
}

export const getWorkLocations = async () => {
  return await api().get(`/api/v1/workLocations`)
}

export const getWorkSummary = async (from, to) => {
  return await api().get(`/api/v1/workSummary?from=${from}&to=${to}`)
}

// 兩週結算期列表(新的在前),to = 要列到哪一天所在的那一期
export const getWorkPeriods = async (to) => {
  return await api().get(`/api/v1/workPeriods?to=${to}`)
}

// method: "bank" | "cash" | null(清除)
export const putWorkPeriod = async (start, method) => {
  return await api().put(`/api/v1/workPeriods/${start}`, { method })
}

export const getWorkSettings = async () => {
  return await api().get(`/api/v1/workSettings`)
}

export const putWorkSettings = async (body) => {
  return await api().put(`/api/v1/workSettings`, body)
}
