<script setup lang="ts">
import { ElRow, ElCol, ElCard, ElSkeleton } from 'element-plus'
import { CountTo } from '@/components/CountTo'
import { useDesign } from '@/hooks/web/useDesign'
import { useI18n } from '@/hooks/web/useI18n'
import { ref } from 'vue'
const props = defineProps({
  paneData: {
    type: Object,
    default: () => {
      return {
        detectAll: 0,
        discern: 0,
        fullDiscern: 0,
        accurateDiscern: 0
      }
    }
  }
})
const { t } = useI18n()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('panel')

const loading = ref(false)

// let totalState = reactive<AnalysisTotalTypes>({
//   detectAll: 0,
//   discern: 0,
//   fullDiscern: 0,
//   accurateDiscern: 0
// })
// console.log(props.paneData)
// Object.assign(totalState, props.paneData || {})
// const getCount = async () => {
//   const res = await getCountApi()
//     .catch(() => {})
//     .finally(() => {
//       loading.value = false
//     })
//   totalState = Object.assign(totalState, res?.data || {})
// }

// getCount()
</script>

<template>
  <ElRow :gutter="20" justify="space-between" :class="prefixCls">
    <ElCol :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="2">
          <template #default>
            <div :class="`${prefixCls}__item flex justify-between`">
              <div>
                <div
                  :class="`${prefixCls}__item--icon ${prefixCls}__item--peoples p-16px inline-block rounded-6px`"
                >
                  <Icon icon="svg-icon:peoples" :size="40" />
                </div>
              </div>
              <div class="flex flex-col justify-between">
                <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">{{
                  t('analysis.detectAll')
                }}</div>
                <CountTo
                  class="text-20px font-700 text-right"
                  :start-val="0"
                  :end-val="props.paneData.detectAll"
                  :duration="2600"
                />
              </div>
            </div>
          </template>
        </ElSkeleton>
      </ElCard>
    </ElCol>

    <ElCol :xl="8" :lg="8" :md="12" :sm="12" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="2">
          <template #default>
            <div :class="`${prefixCls}__item flex justify-between`">
              <div>
                <div
                  :class="`${prefixCls}__item--icon ${prefixCls}__item--message p-16px inline-block rounded-6px`"
                >
                  <Icon icon="svg-icon:message" :size="40" />
                </div>
              </div>
              <div class="flex flex-col justify-between">
                <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">{{
                  t('analysis.discern')
                }}</div>
                <CountTo
                  class="text-20px font-700 text-right"
                  :start-val="0"
                  :end-val="props.paneData.discern"
                  :duration="2600"
                />
              </div>
            </div>
          </template>
        </ElSkeleton>
      </ElCard>
    </ElCol>

    <ElCol :xl="8" :lg="8" :md="8" :sm="12" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="2">
          <template #default>
            <div :class="`${prefixCls}__item flex justify-between`">
              <div>
                <div
                  :class="`${prefixCls}__item--icon ${prefixCls}__item--money p-16px inline-block rounded-6px`"
                >
                  <Icon icon="svg-icon:money" :size="40" />
                </div>
              </div>
              <div class="flex flex-col justify-between">
                <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">{{
                  t('analysis.fullDiscern')
                }}</div>
                <CountTo
                  class="text-20px font-700 text-right"
                  :start-val="0"
                  :end-val="props.paneData.fullDiscern"
                  :duration="2600"
                />
              </div>
            </div>
          </template>
        </ElSkeleton>
      </ElCard>
    </ElCol>

    <!-- <ElCol :xl="6" :lg="6" :md="12" :sm="12" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="2">
          <template #default>
            <div :class="`${prefixCls}__item flex justify-between`">
              <div>
                <div
                  :class="`${prefixCls}__item--icon ${prefixCls}__item--shopping p-16px inline-block rounded-6px`"
                >
                  <Icon icon="svg-icon:shopping" :size="40" />
                </div>
              </div>
              <div class="flex flex-col justify-between">
                <div :class="`${prefixCls}__item--text text-16px text-gray-500 text-right`">{{
                  t('analysis.accurateDiscern')
                }}</div>
                <CountTo
                  class="text-20px font-700 text-right"
                  :start-val="0"
                  :end-val="props.paneData.accurateDiscern"
                  :duration="2600"
                />
              </div>
            </div>
          </template>
        </ElSkeleton>
      </ElCard>
    </ElCol> -->
  </ElRow>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-panel';

.@{prefix-cls} {
  &__item {
    &--peoples {
      color: #40c9c6;
    }

    &--message {
      color: #36a3f7;
    }

    &--money {
      color: #f4516c;
    }

    &--shopping {
      color: #34bfa3;
    }

    &:hover {
      :deep(.@{namespace}-icon) {
        color: #fff !important;
      }
      .@{prefix-cls}__item--icon {
        transition: all 0.38s ease-out;
      }
      .@{prefix-cls}__item--peoples {
        background: #40c9c6;
      }
      .@{prefix-cls}__item--message {
        background: #36a3f7;
      }
      .@{prefix-cls}__item--money {
        background: #f4516c;
      }
      .@{prefix-cls}__item--shopping {
        background: #34bfa3;
      }
    }
  }
}
</style>
