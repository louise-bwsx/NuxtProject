import { defineStore } from "pinia"
import { jwtDecode } from "jwt-decode"

export const useAuthStore = defineStore("auth", () => {
  const userInfo = ref(undefined)
  const accessToken = ref(undefined)

  const getAccessToken = computed(() => {
    // 20250709 避免出現SSR Error ERROR [unhandledRejection] localStorage is not defined
    // 20250709 改用import.meta.client 因為process.client deprecate
    if (!import.meta.client) {
      return ""
    }

    if (accessToken.value == null || accessToken.value == "" || accessToken.value == undefined) {
      accessToken.value = localStorage.getItem("accessToken")
    }

    if (isExpire(accessToken.value)) {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("userInfo")
      accessToken.value = ""
    }
    return accessToken.value
  })

  const setAccessToken = (newaccessToken) => {
    accessToken.value = newaccessToken
    localStorage.setItem("accessToken", newaccessToken)
  }

  const isLogin = computed(() => {
    return getUserInfo.value != undefined && !isEmptyObject(getUserInfo.value)
  })

  const getUserInfo = computed(() => {
    // 20250709 避免出現SSR Error ERROR  [unhandledRejection] localStorage is not defined
    // 20250709 改用import.meta.client 因為process.client deprecate
    if (!import.meta.client) {
      return undefined
    }

    if (userInfo.value == null || userInfo.value == "" || userInfo.value == undefined) {
      var storedUserInfo = localStorage.getItem("userInfo")
      if (storedUserInfo == "[object Object]") {
        return undefined
      }
      userInfo.value = JSON.parse(storedUserInfo)
    }

    if (isExpire(getAccessToken.value)) {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("userInfo")
      accessToken.value = ""
      userInfo.value = {}
    }

    return userInfo.value
  })

  const isDeveloper = computed(() => {
    return isLogin.value && getUserInfo.value.email === "louise87276@gmail.com"
  })

  const setUserInfo = (newUserInfo) => {
    userInfo.value = newUserInfo
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo))
  }

  const getExp = (token) => {
    const decoded = jwtDecode(token)
    return decoded
  }

  const isExpire = (token) => {
    if (token == "" || token == null) {
      return true
    }

    const timestampNow = Date.now() / 1000
    const decoded = jwtDecode(token)
    // console.log("decoded:", JSON.stringify(decoded))
    // {"user_id":"guest_735da63e-eaf9-4ff8-bf55-4f99f5d6dfc6","email":"","exp":1770652024,"nbf":1770565624,"iat":1770565624}
    // exp Expiration time（過期時間）
    // nbf Not Before（生效時間）token 在這個時間之前不可使用
    // iat Issued At（發行時間）token 是在這個時間點產生的

    return timestampNow > decoded.exp
  }

  return {
    getAccessToken,
    getUserInfo,
    isLogin,
    isDeveloper,

    setAccessToken,
    setUserInfo,
    getExp,
    isExpire,
  }
})
