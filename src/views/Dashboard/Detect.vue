<template>
  <div style="height: 100%">
    <el-card style="height: calc(100% - 10px); overflow-y: auto">
      <section>
        <el-form :inline="true" :model="query">
          <el-form-item label="模型">
            <el-select v-model="query.module" style="width: 200px" class="w-120px">
              <el-option label="全部" value="" />
              <el-option :label="item" :value="item" v-for="item in modules" :key="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="批次">
            <el-input v-model="query.batch" />
            <!-- <el-seltect v-model="query.batch">
            <el-option :value="item" v-for="item in currentModule" :key="item" />
          </el-seltect> -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>
      </section>
      <!-- <img src="/detect/2024-04-23/1713862369521.jpg" alt="" /> -->
      <el-table :data="detectSource">
        <el-table-column type="expand">
          <template #default="props">
            <el-descriptions :column="6" border>
              <el-descriptions-item v-for="item in descList" size="small" :key="item.dataIndex">
                <template #label>
                  <div class="cell-item">
                    {{ item.title }}
                  </div>
                </template>
                {{ props.row[item.dataIndex] }}
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column
          :prop="col.dataIndex"
          v-for="col in detectList"
          :label="col.title"
          :key="col.dataIndex"
          :show-overflow-tooltip="col.ellipsis"
        >
          <template #default="scope">
            <template
              v-if="
                [
                  'fish_w_rate',
                  'body_w_rate',
                  'body_h_rate',
                  'head_rate',
                  'mouth_rate',
                  'tail_w_rate',
                  'tail_h_rate',
                  'caudal_fin_rate'
                ].includes(col.dataIndex)
              "
            >
              <el-tag
                v-if="scope.row[col.dataIndex] < 1.11 && scope.row[col.dataIndex] > 0.89"
                type="danger"
              >
                {{ scope.row[col.dataIndex] }}
              </el-tag>
              <span v-else>
                {{ scope.row[col.dataIndex] }}
              </span>
            </template>
            <el-image
              v-else-if="col.dataIndex == 'link'"
              :z-index="20"
              preview-teleported="true"
              style="width: 20px; height: 20px"
              :src="'http://localhost:5000/file' + scope.row[col.dataIndex]"
              :preview-src-list="['http://localhost:5000/file' + scope.row[col.dataIndex]]"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90px">
          <template #default="scope">
            <el-button
              title="删除"
              type="danger"
              size="small"
              :icon="Delete"
              @click="deleteByIdType(scope.row.id)"
              circle
            />
          </template>
        </el-table-column>
        <!-- <template #summary>
        <a-table-summary-row>
          <a-table-summary-cell>识别</a-table-summary-cell>
          <a-table-summary-cell>共{{ detectSource.length }}</a-table-summary-cell>
          <a-table-summary-cell v-for="(item, index) in Object.values(totle.discern)" :key="index">
            <a-typography-text type="danger">{{ item }}</a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell>/</a-table-summary-cell>
          <a-table-summary-cell>/</a-table-summary-cell>
          <a-table-summary-cell>/</a-table-summary-cell>
        </a-table-summary-row>
        <a-table-summary-row>
          <a-table-summary-cell>准确</a-table-summary-cell>
          <a-table-summary-cell>共{{ detectSource.length }}</a-table-summary-cell>
          <a-table-summary-cell v-for="(item, index) in Object.values(totle.rate)" :key="index">
            <a-typography-text type="danger">{{
              `${item}/${((item / detectSource.length) * 100).toFixed(2)}`
            }}</a-typography-text>
          </a-table-summary-cell>
          <a-table-summary-cell>/</a-table-summary-cell>
          <a-table-summary-cell>/</a-table-summary-cell>
          <a-table-summary-cell>/</a-table-summary-cell>
        </a-table-summary-row>
      </template> -->
      </el-table>
      <section class="mt-6 flex justify-center">
        <el-pagination
          background
          layout="prev, pager, next"
          @change="currentChange"
          :total="total"
        />
      </section>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { getDetectList, getModel, deleteById } from '@/api/dashboard/workplace'
import { DataSourceItem } from '@/api/dashboard/workplace/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { onMounted, Ref, computed, shallowReactive } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

let detectSource: Ref<DataSourceItem[]> = ref([])
let route = useRoute()
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(10)
const batch: Ref<string> = ref('') //批次
let modules: Ref<string[]> = ref([])
const query = shallowReactive({
  batch: '',
  module: '',
  type: null
})

const totle = computed(() => {
  let obj: { [key: string]: number } = {
    direction: 0,
    fish_w: 0,
    body_w: 0,
    body_h: 0,
    head: 0,
    mouth: 0,
    tail_muscles_w: 0,
    tail_muscles_h: 0,
    caudal_fin: 0,
    fish_w_rate: 0,
    body_w_rate: 0,
    body_h_rate: 0,
    head_rate: 0,
    mouth_rate: 0,
    tail_w_rate: 0,
    tail_h_rate: 0,
    caudal_fin_rate: 0
  }
  let rate: { [key: string]: number } = {
    direction: 0,
    fish_w: 0,
    body_w: 0,
    body_h: 0,
    head: 0,
    mouth: 0,
    tail_muscles_w: 0,
    tail_muscles_h: 0,
    caudal_fin: 0,
    fish_w_rate: 0,
    body_w_rate: 0,
    body_h_rate: 0,
    head_rate: 0,
    mouth_rate: 0,
    tail_w_rate: 0,
    tail_h_rate: 0,
    caudal_fin_rate: 0
  }
  let rarr = [
    'fish_w_rate',
    'body_w_rate',
    'body_h_rate',
    'head_rate',
    'mouth_rate',
    'tail_w_rate',
    'tail_h_rate',
    'caudal_fin_rate'
  ]
  // let rate:{[key:string]:number} ={

  // }
  detectSource.value.forEach((f) => {
    Object.keys(obj).forEach((o: string) => {
      if (Number(f[o]) !== 0) {
        obj[o]++
        if (rarr.includes(o)) {
          console.log(f[o])
          //找出误差小于0.11大于0.89的
          if (Number(f[o]) > 0.89 && Number(f[o]) < 1.11) {
            rate[o]++
          }
        }
      }
    })
  })
  return {
    discern: obj,
    rate: rate
  }
})
const detectList: CloumnItem[] = []
const descList: CloumnItem[] = []
const creatCloumn = () => {
  let detect = [
    'direction',
    'fish_w',
    'body_w',
    'body_h',
    'head',
    'mouth',
    'tail_muscles_w',
    'tail_muscles_h',
    'caudal_fin',
    'link',
    'created_at'
  ]
  let detectTest = [
    'direction',
    // 'fish_w',
    // 'body_w',
    // 'body_h',
    // 'head',
    // 'mouth',
    // 'tail_muscles_w',
    // 'tail_muscles_h',
    // 'caudal_fin',
    'fish_w_rate',
    'body_w_rate',
    'body_h_rate',
    'head_rate',
    'mouth_rate',
    'tail_w_rate',
    'tail_h_rate',
    'caudal_fin_rate',
    'link',
    'created_at'
  ]
  let obj = {
    // 'id',
    uid: '编号',
    direction: '朝向',
    fish_w: '全长(mm)',
    body_w: '身长(mm)',
    body_h: '身高(mm)',
    head: '头长(mm)',
    mouth: '嘴长(mm)',
    tail_muscles_w: '尾柄长(mm)',
    tail_muscles_h: '尾柄宽(mm)',
    caudal_fin: '尾长(mm)',
    fish_w_rate: '全长(%)',
    body_w_rate: '身长(%)',
    body_h_rate: '身高(%)',
    head_rate: '头长(%)',
    mouth_rate: '嘴长(%)',
    tail_w_rate: '尾柄长(%)',
    tail_h_rate: '尾柄宽(%)',
    caudal_fin_rate: '尾长(%)',
    batch: '批次',
    use_model: '模型',
    img: '图片名',
    link: '链接',
    created_at: '时间'
  }

  Object.keys(obj).forEach((f) => {
    descList.push({
      title: obj[f],
      dataIndex: f,
      key: f,
      ellipsis: f == 'link'
    })
  })
  if (route.path.indexOf('test') > -1) {
    detectTest.forEach((f) => {
      detectList.push({
        title: obj[f],
        dataIndex: f,
        key: f,
        ellipsis: f == 'link'
      })
    })
  } else {
    detect.forEach((f) => {
      detectList.push({
        title: obj[f],
        dataIndex: f,
        key: f,
        ellipsis: f == 'link'
      })
    })
  }
}
//分页变动
const currentChange = (currentPage, size) => {
  pageNum.value = currentPage
  pageSize.value = size
  queryList()
}
const queryList = () => {
  getDetectList({ ...query, pageNum: pageNum.value, pageSize: pageSize.value }).then((res) => {
    detectSource.value = res.data.list
    pageNum.value = res.data.page
    pageSize.value = res.data.pageSize
    total.value = res.data.total
  })
}
const deleteByIdType = async (id) => {
  ElMessageBox.confirm('此操作不可恢复，是否要删除？', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      let res = await deleteById(id, query.type)
      if (res.code == 200) {
        queryList()
        ElMessage({
          message: res.msg,
          type: 'success'
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消'
      })
    })
}
creatCloumn()
if (route.path.indexOf('test') > -1) {
  Object.assign(query, { type: 'test' })
}
onMounted(() => {
  // getFish().then((res) => {
  //   dataSource.value = res.data
  // })
  queryList()
  //获取模型
  getModel().then((res) => {
    modules.value = res.data
    // Object.assign(query, {
    //   module: res.data[0]
    // })
  })
})
</script>
<style lang="less" scoped>
:deep(.table-striped) td {
  background-color: #f5f5f5;
}

:deep(.ant-table-wrapper) {
  height: 600px;
}

.txt-read {
  color: red;
}
</style>
