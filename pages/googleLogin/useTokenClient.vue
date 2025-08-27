
<template>
  <button :disabled="!isReady" @click="() => login()">Login with Google</button>
</template>

<script setup>
import { useTokenClient } from '#imports';

const handleOnSuccess = (response) => {
  console.log("Access Token: ", response.access_token);
};

const handleOnError = (errorResponse) => {
  console.log("Error: ", errorResponse);
};

const {isReady, login} = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
})
</script>