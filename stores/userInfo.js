import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', () => {
  const userInfo = ref(undefined);

  const getUserInfo = computed(() => {
    // 20250709 louise 避免出現SSR Error ERROR  [unhandledRejection] localStorage is not defined
    if(!process.client) {
      return ""
    }

    if (
      userInfo.value == null ||
      userInfo.value == "" ||
      userInfo.value == undefined
    ) {
      var storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo == "[object Object]") {
        return "";
      }
      userInfo.value = JSON.parse(storedUserInfo);
    }
    return userInfo.value;
  });

  const setUserInfo = (newUserInfo) => {
    userInfo.value = newUserInfo
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
  }

  return { getUserInfo, setUserInfo }
})
