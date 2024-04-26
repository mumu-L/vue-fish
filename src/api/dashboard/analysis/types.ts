export type AnalysisTotalTypes = {
  detectAll: number
  discern: number
  fullDiscern: number
  accurateDiscern: number
}

export type UserAccessSource = {
  value: number
  name: string
}

export type WeeklyUserActivity = {
  value: number
  name: string
}

export type MonthlySales = {
  name: string
  estimate: number
  actual: number
}

type Item = {
  [key: string]: []
}
export interface Analysis {
  panel: Object
  indicator: Item
  batchs: Item
  modules: Item
}
