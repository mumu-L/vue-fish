<script setup lang="ts">
import PanelGroup from './components/PanelGroup.vue'
import { ElRow, ElCol, ElCard, ElSkeleton, ElMessage } from 'element-plus'
import { Echart } from '@/components/Echart'
import { pieOptions, barOptions, lineOptions } from './echarts-data'
import { ref, reactive, Ref, onMounted } from 'vue'
import { getData } from '@/api/dashboard/analysis'
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'
import { getModel } from '@/api/dashboard/workplace'

const { t } = useI18n()
const paneData = reactive({
  detectAll: 0,
  discern: 0,
  fullDiscern: 0,
  accurateDiscern: 0
})
const loading = ref(false)

const pieOptionsData = reactive<EChartsOption>(pieOptions) as EChartsOption

//模型
let modules: Ref<string[]> = ref([])

// 用户来源
// const getUserAccessSource = async () => {
//   const res = await getUserAccessSourceApi().catch(() => {})
//   if (res) {
let indicatorRate = [
  { value: 0, name: 'analysis.fish_w_rate' },
  { value: 0, name: 'analysis.body_w_rate' },
  { value: 0, name: 'analysis.body_h_rate' },
  { value: 0, name: 'analysis.head_rate' },
  { value: 0, name: 'analysis.mouth_rate' },
  { value: 0, name: 'analysis.tail_w_rate' },
  { value: 0, name: 'analysis.tail_h_rate' },
  { value: 0, name: 'analysis.caudal_fin_rate' }
]

const uploadData = () => {
  set(
    pieOptionsData,
    'legend.data',
    indicatorRate.map((v) => t(v.name))
  )
  pieOptionsData!.series![0].data = indicatorRate.map((v) => {
    return {
      name: t(v.name),
      value: v.value
    }
  })
}
// }
// }

const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption

const lineOptionsData = reactive<EChartsOption>(lineOptions) as EChartsOption
const queryList = async () => {
  let res = await getData()
  if (res.code !== 200) {
    ElMessage({
      type: 'error',
      message: res.msg
    })
  }
  // detectSource.value = res.data
  Object.assign(paneData, res.data.panel)
  Object.values(res.data.indicator).forEach((item, i) => {
    indicatorRate[i].value = item.length
  })

  Object.assign(barOptionsData, {
    xAxis: {
      data: Object.keys(res.data.batchs)
    },
    series: [
      {
        name: '指标',
        data: Object.values(res.data.batchs).map((m) => m.length),
        type: 'bar'
      }
    ]
  })
  let modules = res.data.modules
  Object.assign(lineOptionsData, {
    xAxis: {
      data: indicatorRate.map((m) => t(m.name))
    },
    legend: {
      data: Object.keys(modules),
      top: 50
    },
    series: Object.entries(modules).map((m) => {
      return {
        name: m[0],
        smooth: true,
        type: 'line',
        itemStyle: {},
        data: m[1],
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      }
    })
  })
  uploadData()
  // getDetectList({
  //   batch: null
  // }).then((res) => {

  // })
}
onMounted(() => {
  // getFish().then((res) => {
  //   dataSource.value = res.data
  // })
  queryList()
  //获取模型
  getModel().then((res) => {
    // console.log(res)
    modules.value = res.data
  })
})
</script>

<template>
  <PanelGroup :pane-data="paneData" />
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="10" :lg="10" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="pieOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :xl="14" :lg="14" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="barOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :span="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="4">
          <Echart :options="lineOptionsData" :height="350" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
</template>
