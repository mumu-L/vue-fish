export interface ConfigItem {
  id: string | number
  name: string
  module: string
  conf: string | number
  iou: string | number | null
  imagz: string | number | null
  active: 0 | 1
  created_at?: string
}
