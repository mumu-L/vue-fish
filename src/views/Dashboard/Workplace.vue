<script setup lang="ts">
import { Descriptions } from '@/components/Descriptions'
import { getModel, start, GetCameraList } from '@/api/dashboard/workplace/index'
import { getConfigList } from '@/api/dashboard/config/index'
import { computed, onMounted, Ref, ShallowReactive, shallowReactive } from 'vue'
import { ref } from 'vue'
import { DataSourceItem, DetectConf } from '@/api/dashboard/workplace/types'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive } from 'vue'
import { DescriptionsSchema } from '@/components/Descriptions/src/types'
import { ConfigItem } from '@/api/dashboard/config/types'
import { ElMessage, ElStatistic } from 'element-plus'
import { VideoCameraFilled, Odometer } from '@element-plus/icons-vue'
import { io } from 'socket.io-client'
import { useAppStore } from '@/store/modules/app'
const { t } = useI18n()

const appStore = useAppStore()
const analysisInfo = computed(() => appStore.getAnalysisInfo)
//图片地址
const imgUrl = ref('')
let detectSource: ShallowReactive<DataSourceItem> = shallowReactive({})
let loading = ref(false)
//称重设备状态
const weightState = ref(true)
//摄像头状态
const cameraState = ref(true)
//当前选中配置
const currentConf = ref(0)
let config: DetectConf = reactive({
  conf: 0.6,
  iou: 0.4,
  imagz: 640,
  batch: '', //批次
  module: 'yolo8n/v1-1',
  camera: 0
})
let modules: Ref<string[]> = ref([])
//配置列表
let confList: Ref<ConfigItem[]> = ref([
  {
    id: '1',
    name: '配置1',
    module: '',
    conf: 0.6,
    iou: null,
    imagz: null,
    active: 0
  },
  {
    id: '2',
    name: '配置2',
    module: '',
    conf: 0.8,
    iou: null,
    imagz: null,
    active: 0
  }
])
// 摄像头列表
const cameraList: Ref<string[]> = ref([])
// Statistic列表
const statisticList = [
  {
    title: '今日',
    key: 'today',
    value: 0
  },
  // {
  //   title: '本月',
  //   key: 'discern',
  //   value: 0
  // },
  {
    title: '总共',
    key: 'detectAll',
    value: 0
  }
]
const schema = reactive<DescriptionsSchema[]>([])
//摄像头是否开启
// let isCamera:Ref<boolean> = ref(false)
const keys: string[] = [
  'cls',
  'direction',
  'fish_w',
  'body_w',
  'body_h',
  'head',
  'mouth',
  'tail_muscles_w',
  'tail_muscles_h',
  'caudal_fin',
  'weight'
  // 'use_model',
  // 'link'
  // 'created_at'
]
keys.forEach((key) => {
  schema.push({
    field: key,
    label: t(`analysis.${key}`),
    span: ['link'].includes(key) ? 24 : 12
  })
})
const enginStart = async () => {
  // const res = await switchCamera()
  // if (res.code == 200) {
  let module = config.module
  const str = module.replaceAll('/', '_')
  imgUrl.value =
    imgUrl.value !== ''
      ? ''
      : `${import.meta.env.VITE_API_BASE_PATH}/task/open_camera?module=${str}&conf=${config.conf}&imagz=${config.imagz}&iou=${config.iou}&camera=${config.camera}`
  // }

  // imgUrl.value = imgUrl.value !== '' ? '' : `/api/task/open_camera/${str}/${config.conf}`
}

const detectStart = (type = 'detect') => {
  loading.value = true
  start({
    conf: config.conf,
    module: config.module,
    iou: config.iou,
    type: type,
    batch: config.batch ? config.batch : new Date().getTime().toString()
  })
    .then((res) => {
      if (res.code == 200) {
        loading.value = false
        Object.assign(detectSource, res.data)
        appStore.countToday()
        ElMessage.success(res.msg)
      }

      // queryList()
      // loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}
const getCameraList = async () => {
  const list = await GetCameraList()
  cameraList.value = list.data
}
//切换配置
const checkConf = () => {
  Object.assign(config, confList.value[currentConf.value])
}
console.log(import.meta.env.VITE_WS_URL)
const socket = io(import.meta.env.VITE_WS_URL)

// client-side
socket.on('connect', () => {
  console.log('socket-connect')
})
socket.on('message', (message) => {
  if (message.type == 0) {
    //异常提示
    ElMessage.error(message.msg)
  } else if (message.type == 1) {
    //正常数据推送
    Object.assign(detectSource, message.data)
    // ElMessage.error(message.msg)
  } else if (message.type == 2) {
    weightState.value = !!message.data.state
    if (!weightState.value) {
      imgUrl.value = ''
    }
  } else if (message.type == 3) {
    cameraState.value = !!message.data.state
    if (!cameraState.value) {
      imgUrl.value = ''
    }
  }
})
// socket.on('server-msg', (message) => {
//   console.log(message)
//   if (message.type == 0) {
//     ElMessage.error(message.msg)
//   }
// })
socket.on('disconnect', () => {
  console.log('disconnect')
})

getCameraList()
onMounted(() => {
  //获取模型
  getModel().then((res) => {
    // console.log(res)
    modules.value = res.data
    Object.assign(config, {
      currentModule: res.data[0]
    })
  })
  getConfigList().then((res) => {
    confList.value = res.data
    currentConf.value = res.data.findIndex((f) => f.active == 1)
    checkConf()
  })
})
// onUnmounted(() => {
//   //关闭摄像头
//   switchCamera()
// })
</script>

<template>
  <div class="w-full flex h-full">
    <div class="w-70% h-full">
      <el-image :src="imgUrl" class="w-full h-full border-dashed border-2 border-indigo-600">
        <template #error>
          <div class="w-full h-full flex justify-center items-center">
            请开启摄像头<span class="dot">...</span>
          </div>
        </template>
        <template #placeholder>
          <div class="w-full h-full flex justify-center items-center"
            >正在打开摄像头<span class="dot">...</span>
          </div>
        </template>
      </el-image>
    </div>

    <div class="w-30% pl-20px">
      <el-card>
        <el-row>
          <el-col :span="12" class="flex justify-center">
            <el-icon :size="40" :color="weightState ? '#67C23A' : '#F56C6C'"><Odometer /></el-icon>
            <!-- <el-tag :type="weightState ? 'success' : 'danger'" effect="dark" round>
              {{ weightState ? '正常' : '异常' }}</el-tag
            > -->
          </el-col>
          <el-col :span="12" class="flex justify-center">
            <el-icon :size="40" :color="cameraState ? '#67C23A' : '#F56C6C'"
              ><VideoCameraFilled
            /></el-icon>
            <!-- <el-tag :type="cameraState ? 'success' : 'danger'" effect="dark" round>
              {{ cameraState ? '正常' : '异常' }}</el-tag
            > -->
          </el-col>
        </el-row>
      </el-card>
      <el-card class="mt-10px">
        <el-row>
          <el-col :span="8" v-for="item in statisticList" :key="item.key">
            <el-statistic :value="analysisInfo.panel[item.key]">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  {{ item.title }}
                  <!-- <el-tooltip
                    effect="dark"
                    content="Number of users who logged into the product in one day"
                    placement="top"
                  >
                    <el-icon style="margin-left: 4px" :size="12">
                      <Warning />
                    </el-icon>
                  </el-tooltip> -->
                </div>
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="mt-10px">
        <el-form label-width="80px">
          <el-form-item label="配置：">
            <el-select v-model="currentConf" @change="checkConf">
              <el-option
                :label="item.name"
                :value="index"
                v-for="(item, index) in confList"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="拍摄：">
            <el-select v-model="config.camera">
              <el-option
                :label="item"
                :value="index"
                v-for="(item, index) in cameraList"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="批次：">
            <el-input v-model="config.batch" />
          </el-form-item>
        </el-form>
        <section class="flex justify-center">
          <el-button
            :type="imgUrl !== '' ? 'danger' : 'success'"
            class="mr-2"
            @click="enginStart()"
          >
            {{ imgUrl !== '' ? '关闭摄像头' : '开启摄像头' }}
          </el-button>
          <el-button
            type="primary"
            class="mr-2"
            :loading="loading"
            :disabled="imgUrl == ''"
            @click="detectStart()"
            >开始检测</el-button
          >
          <el-button type="warning" :loading="loading" @click="detectStart('test')">测试</el-button>
        </section>
      </el-card>
      <el-card class="mt-10px">
        <Descriptions
          :collapse="false"
          :width="'80px'"
          :title="t('analysis.resultText')"
          :data="detectSource"
          :schema="schema"
        />
      </el-card>
    </div>
    <!-- </ElCard> -->
  </div>
</template>
