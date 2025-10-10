export const getMonthlyCost = async () => {
  return await useApiStore().get(`api/v1/charts/monthlyCost`)
}
