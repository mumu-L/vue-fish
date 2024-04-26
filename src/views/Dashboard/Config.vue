<template>
  <div style="height: 100%">
    <el-card style="height: 100%">
      <section>
        <el-form :inline="true" :model="query">
          <el-form-item label="模型">
            <el-select v-model="query.module" style="width: 200px" class="w-120px">
              <el-option label="全部" value="" />
              <el-option :label="item" :value="item" v-for="item in modules" :key="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="query.name" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>
      </section>
      <section class="mb-2">
        <el-button type="success" @click="updateConf(null, 'add')">新增</el-button>
      </section>
      <el-table :data="detectSource" :height="500">
        <el-table-column
          :prop="col.dataIndex"
          v-for="col in detectList"
          :label="col.title"
          :key="col.dataIndex"
        >
          <template #default="scope" v-if="col.dataIndex == 'active'">
            <el-tag :type="scope.row.active == 0 ? 'info' : 'success'">{{
              scope.row.active == 0 ? '未激活' : '已激活'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" @click="updateConf(scope.row)" v-if="scope.row.active == 0"
              >激活</el-button
            >
            <el-button class="ml-2" size="mini" @click="updateConf(scope.row, 'update')"
              >修改</el-button
            >
            <el-button class="ml-2" size="mini" @click="deleteConfById(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="!!config.id ? '编辑配置' : '新增配置'"
      width="500"
      :before-close="handleClose"
    >
      <el-form :model="config" :rules="rules" ref="ruleFormRef" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="config.name" />
        </el-form-item>
        <el-form-item label="模型" prop="module">
          <el-select v-model="config.module" class="w-120px">
            <el-option label="全部" value="" />
            <el-option :label="item" :value="item" v-for="item in modules" :key="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="conf" prop="conf">
          <el-input-number v-model="config.conf" :precision="1" :step="0.1" :max="1" />
          <!-- <el-input v-model="config.conf" /> -->
        </el-form-item>
        <el-form-item label="iou">
          <el-input-number v-model="config.iou" :precision="1" :step="0.1" :max="1" />
        </el-form-item>
        <el-form-item label="imagz">
          <el-input v-model="config.imagz" />
        </el-form-item>
        <el-form-item label="是否激活">
          <el-switch inactive-value="0" active-value="1" v-model="config.active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { updateConfig, deteleConfig, getConfigList } from '@/api/dashboard/config'
import { ConfigItem } from '@/api/dashboard/config/types'
import { getModel } from '@/api/dashboard/workplace'
import { TableColumn } from '@/components/Table/src/types'
import { onMounted, Ref, computed, shallowReactive, reactive } from 'vue'
import { ref } from 'vue'
//弹框
const dialogVisible: Ref<Boolean> = ref(false)
const ruleFormRef = ref<FormInstance>()
let detectSource: Ref<ConfigItem[]> = ref([])
let modules: Ref<string[]> = ref([])
let baseConfig = {
  name: '',
  module: '',
  conf: 0.6,
  iou: 0.4,
  imagz: 640,
  active: 0
}
//查询条件
const query = shallowReactive({
  ...baseConfig
})
//配置
const config = shallowReactive({
  id: '',
  ...baseConfig
})
const keys: string[] = ['name', 'module', 'conf', 'iou', 'imagz', 'active', 'created_at']
const names: string[] = ['名称', '模型', '置信度', 'IOU', 'imagz', '是否激活', '创建时间']
const detectList: CloumnItem[] = []

interface RuleForm {
  name: string
  module: string
  // region: string
  // count: string
  // date1: string
  // date2: string
  // delivery: boolean
  // location: string
  // type: string[]
  // resource: string
  // desc: string
}
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请填写名称', trigger: 'change' },
    { min: 3, max: 20, message: '长度在3-20个字符之间', trigger: 'change' }
  ],
  module: [{ required: true, message: '请选择模型', trigger: 'change' }]
  // region: [
  //   {
  //     required: true,
  //     message: 'Please select Activity zone',
  //     trigger: 'change',
  //   },
  // ],
  // count: [
  //   {
  //     required: true,
  //     message: 'Please select Activity count',
  //     trigger: 'change',
  //   },
  // ],
  // date1: [
  //   {
  //     type: 'date',
  //     required: true,
  //     message: 'Please pick a date',
  //     trigger: 'change',
  //   },
  // ],
  // date2: [
  //   {
  //     type: 'date',
  //     required: true,
  //     message: 'Please pick a time',
  //     trigger: 'change',
  //   },
  // ],
  // location: [
  //   {
  //     required: true,
  //     message: 'Please select a location',
  //     trigger: 'change',
  //   },
  // ],
  // type: [
  //   {
  //     type: 'array',
  //     required: true,
  //     message: 'Please select at least one activity type',
  //     trigger: 'change',
  //   },
  // ],
  // resource: [
  //   {
  //     required: true,
  //     message: 'Please select activity resource',
  //     trigger: 'change',
  //   },
  // ],
  // desc: [
  //   { required: true, message: 'Please input activity form', trigger: 'blur' },
  // ],
})
keys.forEach((key, i) => {
  detectList.push({
    title: names[i],
    dataIndex: key,
    key: key,
    ellipsis: true
  })
})

const queryList = () => {
  getConfigList().then((res) => {
    detectSource.value = res.data
  })
}

const configAPI = async (params, type) => {
  let res = await updateConfig(params, type)
  if (res.code == 200) {
    dialogVisible.value = false
    queryList()
    ElMessage({
      type: 'success',
      message: '操作成功'
    })
  }
}
//提交配置
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    console.log(valid)
    if (valid) {
      configAPI(config, !!config.id ? 'update' : 'add')
    } else {
      ElMessage({
        type: 'error',
        message: '请正确填写配置'
      })
    }
  })
}
//重置配置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
//操作
const updateConf = (row, type = 'active') => {
  if (type == 'active') {
    ElMessageBox.confirm('是否激活此配置？', 'Warning', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        configAPI(
          {
            id: row.id,
            active: 1
          },
          type
        )
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '操作取消'
        })
      })
  } else {
    Object.assign(config, type == 'update' ? row : baseConfig)
    dialogVisible.value = true
    // configAPI(
    //   {
    //     id: row.id,
    //     active: 1
    //   },
    //   type
    // )
    // let res = await upDateConfig(row, type)
  }
}
const deleteConfById = (id) => {
  ElMessageBox.confirm('是否删除此配置？', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      let res = await deteleConfig(id)
      if (res.code == 200) {
        queryList()
        ElMessage({
          type: 'success',
          message: '操作成功'
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
//弹框关闭
const handleClose = () => {
  dialogVisible.value = false
  resetForm(ruleFormRef.value)
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
