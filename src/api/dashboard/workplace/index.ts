import request from '@/axios'
import type { DataSourceItem, ModuleItem } from './types'

// export const getCountApi = (): Promise<IResponse<WorkplaceTotal>> => {
//   return request.get({ url: '/mock/workplace/total' })
// }

// export const getProjectApi = (): Promise<IResponse<Project>> => {
//   return request.get({ url: '/mock/workplace/project' })
// }

// export const getDynamicApi = (): Promise<IResponse<Dynamic[]>> => {
//   return request.get({ url: '/mock/workplace/dynamic' })
// }

// export const getTeamApi = (): Promise<IResponse<Team[]>> => {
//   return request.get({ url: '/mock/workplace/team' })
// }

// export const getRadarApi = (): Promise<IResponse<RadarData[]>> => {
//   return request.get({ url: '/mock/workplace/radar' })
// }
/**
 * 获取鱼列表
 * @returns {AxiosResponse} result
 */
export const getFish = (): Promise<any> => {
  return request.get({ url: '/fish/list' })
}

/**
 * 获取检测列表
 * @returns {AxiosResponse} result
 */
export const getDetectList = (
  params: object = {}
): Promise<IResponse<QueryPage<DataSourceItem[]>>> => {
  return request.post({ url: '/fish/detect_list', data: params })
}
export const deleteById = (id: string, type: string | null): Promise<IResponse> => {
  return request.get({ url: `/fish/delete?id=${id}&type=${type}` })
}
/**
 * 开启引擎
 * @returns {AxiosResponse} result
 */
export const startEngine = (): Promise<any> => {
  return request.get({ url: '/engine/start' })
}
/**
 * 检测
 * @returns {AxiosResponse} result
 */
export const start = (params: object): Promise<any> => {
  return request.post({ url: '/task/detect', data: params })
}
/**
 * ，打开或关闭
 */
// export const switchCamera = (): Promise<IResponse> => {
//   return request.get({ url: '/task/switch_camera' })
// }
/**
 *获取摄像头列表
 * @returns
 */
export const GetCameraList = (): Promise<IResponse<string[]>> => {
  return request.get({ url: '/device/camera_list' })
}
/**
 * 获取所有模型
 * @returns
 */
export const getModel = async (): Promise<IResponse<ModuleItem>> => {
  return await request.get({ url: '/config/get_module' })
}
/**
 * 下载数据csv格式
 * @param { Object } params
 * @param { String } params.type 1实时/0测试
 * @returns File
 */
export const downFile = async (params) => {
  return await request.get({
    url: '/file/csv_down',
    params: params,
    responseType: 'blob'
  })
}
