import { defineStore } from 'pinia'
import { jwtDecode } from "jwt-decode";

export const useAuthStore = defineStore('auth', () => {
  const userInfo = ref(undefined);
  const accessToken = ref(undefined);

  const getAccessToken = computed(() => {
    // 20250709 避免出現SSR Error ERROR [unhandledRejection] localStorage is not defined
    // 20250709 改用import.meta.client 因為process.client deprecate
    if (!import.meta.client) {
      return "";
    }

    if (
      accessToken.value == null ||
      accessToken.value == "" ||
      accessToken.value == undefined
    ) {
      accessToken.value = localStorage.getItem("accessToken");
    }

    if (isExpire(accessToken.value)) {
      localStorage.clear("accessToken");
      localStorage.clear("userInfo");
      accessToken.value = "";
    }
    return accessToken.value;
  });

  const setAccessToken = (newaccessToken) => {
    accessToken.value = newaccessToken;
    localStorage.setItem("accessToken", newaccessToken);
  };

  const getUserInfo = computed(() => {
    // 20250709 避免出現SSR Error ERROR  [unhandledRejection] localStorage is not defined
    // 20250709 改用import.meta.client 因為process.client deprecate
    if (!import.meta.client) {
      return undefined;
    }

    if (
      userInfo.value == null ||
      userInfo.value == "" ||
      userInfo.value == undefined
    ) {
      var storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo == "[object Object]") {
        return undefined;
      }
      userInfo.value = JSON.parse(storedUserInfo);
    }

    if (isExpire(getAccessToken.value)) {
      localStorage.clear("accessToken");
      localStorage.clear("userInfo");
      accessToken.value = "";
      userInfo.value = {}
    }

    return userInfo.value;
  });

  const setUserInfo = (newUserInfo) => {
    userInfo.value = newUserInfo
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
  }

  const getExp = (token) => {
    const decoded = jwtDecode(token);
    return decoded;
  };

  const isExpire = (token) => {
    if (token == "" || token == null) {
      return true;
    }

    const timestampNow = Date.now() / 1000;
    const decoded = jwtDecode(token);
    return timestampNow > decoded.exp;
  }

  return {
    getAccessToken,
    getUserInfo,

    setAccessToken,
    setUserInfo,
    getExp,
    isExpire,
  };
})
