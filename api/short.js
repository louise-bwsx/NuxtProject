export const createShortURL = async (longUrl) => {
  const body = {
    longUrl: longUrl,
  }

  const response = await useApiStore().post("/api/v1/short", body)
  return response
}
