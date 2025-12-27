<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { formatSize } from '@/utils'

// --- 数据定义 ---
const columns = [
  { title: 'ID', dataIndex: 'id', width: 180 },
  { title: '空间名称', dataIndex: 'spaceName' },
  { title: '空间级别', dataIndex: 'spaceLevel', width: 120 },
  { title: '使用情况', dataIndex: 'usage' },
  { title: '创建人', dataIndex: 'userId', width: 180 },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '操作', key: 'action' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataList = ref<any[]>([])
const loading = ref(false)
const pagination = reactive({ current: 1, pageSize: 10, total: 0 })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modalVisible = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formData = reactive<any>({ spaceName: '', spaceLevel: 0 })

// --- 模拟方法 ---
const fetchData = async () => {
  loading.value = true
  // 模拟数据
  setTimeout(() => {
    dataList.value = []
    loading.value = false
  }, 500)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleTableChange = (page: any) => {
  pagination.current = page.current
  pagination.pageSize = page.pageSize
  fetchData()
}

const handleSubmit = async () => {
  message.success('演示模式：创建成功 (后端接口未连接)')
  modalVisible.value = false
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="space-manage-page">
    <a-card title="空间管理 (前端演示版)" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="modalVisible = true">新建空间</a-button>
      </template>
      <a-table :columns="columns" :data-source="dataList" :loading="loading" :pagination="pagination" @change="handleTableChange" row-key="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'spaceLevel'">
            <a-tag>{{ record.spaceLevel }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'usage'">
            {{ formatSize(record.totalSize) }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="text" danger size="small">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:open="modalVisible" title="创建新空间" @ok="handleSubmit">
      <a-form layout="vertical">
        <a-form-item label="空间名称"><a-input v-model:value="formData.spaceName" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
