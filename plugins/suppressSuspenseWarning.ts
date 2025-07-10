export default defineNuxtPlugin(() => {
  if (import.meta.env.DEV) {
    const originalInfo = console.info;
    console.info = (...args) => {
      // 用來移除煩人的log <Suspense> is an experimental feature 
      if (
        typeof args[0] === "string" &&
        args[0].includes("<Suspense> is an experimental feature")
      ) {
        return; // terminate msg
      }
      originalInfo(...args);
    };
  }
});
