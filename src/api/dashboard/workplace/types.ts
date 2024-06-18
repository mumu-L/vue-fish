export type WorkplaceTotal = {
  project: number
  access: number
  todo: number
}

export type Project = {
  name: string
  icon: string
  message: string
  personal: string
  time: Date | number | string
}

export type Dynamic = {
  keys: string[]
  time: Date | number | string
}

export type Team = {
  name: string
  icon: string
}

export type RadarData = {
  personal: number
  team: number
  max: number
  name: string
}

export type ModuleItem = string[]

// export interface Modules {
//   ['string']: any
//   data: ModuleItem
// }

export interface ResponseModules<T> {
  code: string
  data: T
  msg: string
}

/**
 * 检测
 */
export type Detect = {
  module: string
  conf: string | number
  iou: string | number | null
  imagz: string | number | null
}
//检测配置
export type DetectConf = Detect & {
  batch: string
  camera: number
}
// /**
//  * 检测传参
//  */
// export interface DetectQuery extends DetectConf {
//   type: 'test' | 'detect'
// }
/**
 * 检测列表
 */
export type DataSourceItem = {
  [key: string]: string | number | null
}
