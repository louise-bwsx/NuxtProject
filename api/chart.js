export const getYearCost = async () => {
  return await useApiStore().get(`api/v1/charts/yearCost`)
}

export const getMonthCost = async () => {
  return await useApiStore().get(`api/v1/charts/monthCost`)
}

export const getCostDistribution = async () => {
  return await useApiStore().get(`api/v1/charts/costDistribution?months=12`)
}
