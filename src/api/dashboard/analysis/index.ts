import request from '@/axios'
import type { Analysis } from './types'

// export const getCountApi = (): Promise<IResponse<AnalysisTotalTypes[]>> => {
//   return request.get({ url: '/mock/analysis/total' })
// }

// export const getUserAccessSourceApi = (): Promise<IResponse<UserAccessSource[]>> => {
//   return request.get({ url: '/mock/analysis/userAccessSource' })
// }

// export const getWeeklyUserActivityApi = (): Promise<IResponse<WeeklyUserActivity[]>> => {
//   return request.get({ url: '/mock/analysis/weeklyUserActivity' })
// }

// export const getMonthlySalesApi = (): Promise<IResponse<MonthlySales[]>> => {
//   return request.get({ url: '/mock/analysis/monthlySales' })
// }

export const getData = (): Promise<IResponse<Analysis>> => {
  return request.get({ url: '/task/result' })
}
