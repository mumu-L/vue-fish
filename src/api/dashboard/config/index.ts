import request from '@/axios'
import type { ConfigItem } from './types'

/**
 * 获取配置列表
 * @returns {AxiosResponse} result
 */
export const getConfigList = (): Promise<IResponse<ConfigItem[]>> => {
  return request.get({ url: '/config/list' })
}

/**
 * 更新配置
 * @param params 配置
 * @param key active add update
 * @returns {} result
 */
export const updateConfig = (params?: object, key: string = 'active'): Promise<IResponse> => {
  return request.post({ url: `/config/${key}`, data: params })
}
/**
 * 删除配置
 * @param id 配置id
 * @returns
 */
export const deteleConfig = (id): Promise<IResponse> => {
  return request.get({ url: `/config/delete?id=${id}` })
}
