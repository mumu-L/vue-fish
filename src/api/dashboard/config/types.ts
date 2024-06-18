import { Detect } from '../workplace/types'

export interface ConfigItem extends Detect {
  id: string | number
  name: string
  active: 0 | 1
  created_at?: string
}
