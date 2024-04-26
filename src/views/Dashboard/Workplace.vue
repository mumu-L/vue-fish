<script setup lang="ts">
import { Descriptions } from '@/components/Descriptions'
import { getModel, start } from '@/api/dashboard/workplace/index'
import { getConfigList } from '@/api/dashboard/config/index'
import { onMounted, Ref, ShallowReactive, shallowReactive } from 'vue'
import { ref } from 'vue'
import { DataSourceItem } from '@/api/dashboard/workplace/types'
import { useI18n } from '@/hooks/web/useI18n'
import { reactive } from 'vue'
import { DescriptionsSchema } from '@/components/Descriptions/src/types'
import { ConfigItem } from '@/api/dashboard/config/types'
import { ElMessage } from 'element-plus'
const { t } = useI18n()

const imgUrl = ref('')
let detectSource: ShallowReactive<DataSourceItem> = shallowReactive({})
let loading = ref(false)
const currentConf = ref(0)
let config = reactive({
  conf: 0.6,
  iou: '',
  imagz: '',
  batch: null, //批次
  module: 'yolo8n/v1-1'
})

let modules: Ref<string[]> = ref([])
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
const schema = reactive<DescriptionsSchema[]>([])
//摄像头是否开启
// let isCamera:Ref<boolean> = ref(false)
const keys: string[] = [
  'direction',
  'fish_w',
  'body_w',
  'body_h',
  'head',
  'mouth',
  'tail_muscles_w',
  'tail_muscles_h',
  'caudal_fin',
  'use_model',
  'link'
  // 'created_at'
]
keys.forEach((key) => {
  schema.push({
    field: key,
    label: t(`analysis.${key}`),
    span: 12
  })
})
const enginStart = () => {
  let module = config.module
  let str = module.replaceAll('/', '&')
  imgUrl.value = imgUrl.value !== '' ? '' : `/api/task/open_camera/${str}/${config.conf}`
  // imgUrl.value = imgUrl.value !== '' ? '' : `/api/task/open_camera/${str}/${config.conf}`
}

const detectStart = (tag: string | null = null) => {
  loading.value = true
  start({
    conf: config.conf,
    module: config.module,
    type: tag,
    batch: config.batch ? config.batch : new Date().getTime()
  })
    .then((res) => {
      if (res.code == 200) {
        loading.value = false
        Object.assign(detectSource, res.data)
        ElMessage.success(res.msg)
      }

      // queryList()
      // loading.value = false
    })
    .catch((e) => {
      loading.value = false
    })
}
//切换配置
const checkConf = () => {
  Object.assign(config, confList.value[currentConf.value])
}
onMounted(() => {
  // getFish().then((res) => {
  //   dataSource.value = res.data
  // })
  // queryList()
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
  })
})
</script>

<template>
  <div class="w-full flex h-full">
    <!-- <ElCard shadow="never" class="w-full"> -->
    <el-image :src="imgUrl" class="w-1000 h-full border-dashed border-2 border-indigo-600">
      <template #placeholder>
        <div class="image-slot">请开启摄像头<span class="dot">...</span> </div>
      </template>
    </el-image>
    <!-- <img :src="imgUrl" alt="" /> -->
    <div class="ml-4">
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
        <el-form-item label="置信度：">
          <el-input v-model="config.conf" disabled="true" />
        </el-form-item>
        <el-form-item label="iou：">
          <el-input v-model="config.iou" disabled="true" />
        </el-form-item>
        <el-form-item label="imagz:">
          <el-input v-model="config.imagz" disabled="true" />
        </el-form-item>
        <el-form-item label="模型：">
          <el-select v-model="config.module" @change="imgUrl = ''" disabled="true">
            <el-option :label="item" :value="item" v-for="item in modules" :key="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="批次：">
          <el-input v-model="config.batch" />
        </el-form-item>
      </el-form>
      <section class="flex justify-center">
        <el-button :type="imgUrl !== '' ? 'danger' : 'success'" class="mr-2" @click="enginStart()">
          {{ imgUrl !== '' ? '关闭摄像头' : '开启摄像头' }}
        </el-button>
        <el-button type="primary" class="mr-2" :loading="loading" @click="detectStart()"
          >开始检测</el-button
        >
        <el-button type="warning" :loading="loading" @click="detectStart('test')">测试</el-button>
      </section>
      <section class="mt-6">
        <Descriptions :title="t('analysis.resultText')" :data="detectSource" :schema="schema" />
        <!-- <Table :columns="columns" :data="detectSource" /> -->
        <!-- <el-table :data="detectSource">
          <el-table-column
            v-for="(item, index) in keys"
            :prop="item"
            :label="names[index]"
            :key="item"
          >
        </el-table-column>
        </el-table> -->
      </section>
    </div>
    <!-- </ElCard> -->
  </div>
</template>
