import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', () => {
  const userInfo = ref(undefined);

  const getUserInfo = computed(() => {
    if (
      userInfo.value == null ||
      userInfo.value == "" ||
      userInfo.value == undefined
    ) {
      userInfo.value = JSON.parse(localStorage.getItem("userInfo"));
    }
    return userInfo.value;
  });

  const setUserInfo = (newUserInfo) => {
    userInfo.value = newUserInfo
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
  }

  return { getUserInfo, setUserInfo }
})
