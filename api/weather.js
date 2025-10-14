export const current = async (q) => {
  return await useApiStore().get(
    `/v1/current.json?q=${q}&lang=zh_tw&key=${import.meta.env.VITE_WEATHER_KEY}`,
    { baseUrl: `https://api.weatherapi.com` },
  )
}
