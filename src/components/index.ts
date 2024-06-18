import type { App } from 'vue'
import { Icon } from './Icon'
import { Permission } from './Permission'
import { BaseButton } from './Button'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSelect,
  ElImage,
  ElTable,
  ElTableColumn,
  ElTag,
  ElOption,
  ElDialog,
  ElSwitch,
  ElPagination,
  ElCard,
  ElInputNumber,
  ElDescriptions,
  ElDescriptionsItem,
  ElRow,
  ElCol,
  ElIcon
} from 'element-plus'
import { DeleteFilled } from '@element-plus/icons-vue'
const components = [
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElSelect,
  ElImage,
  ElTable,
  ElTableColumn,
  ElTag,
  ElOption,
  ElDialog,
  ElSwitch,
  ElPagination,
  ElCard,
  ElInputNumber,
  ElDescriptions,
  ElDescriptionsItem,
  ElRow,
  ElCol,
  ElIcon
]
export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
  app.component('Permission', Permission)
  app.component('BaseButton', BaseButton)
  app.component('DeleteFilled', DeleteFilled)
  components.forEach((c) => {
    app.use(c)
  })
}
