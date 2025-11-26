<template>
  <div id="userManagePage">
    <h1>管理员用户管理 (CRUD 靶场)</h1>

    <div class="action-card">
      <h3>1. 创建用户 (Add)</h3>
      <a-form layout="inline" :model="addForm" @finish="doAdd">
        <a-form-item label="账号">
          <a-input v-model:value="addForm.userAccount" placeholder="输入账号" />
        </a-form-item>
        <a-form-item label="昵称">
          <a-input v-model:value="addForm.userName" placeholder="输入昵称" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">创建</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="action-card">
      <h3>2. 删除用户 (Delete)</h3>
      <a-form layout="inline" :model="deleteForm" @finish="doDelete">
        <a-form-item label="用户ID">
          <a-input v-model:value="deleteForm.id" placeholder="请输入长ID" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" danger html-type="submit">删除</a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="action-card">
      <h3>3. 根据ID获取 (Get)</h3>
      <a-form layout="inline" :model="getForm" @finish="doGet">
        <a-form-item label="用户ID">
          <a-input v-model:value="getForm.id" placeholder="请输入长ID" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">查询</a-button>
        </a-form-item>
      </a-form>
      <div v-if="currentUser" class="result-box">
        查询结果: {{ currentUser }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { addUserUsingPost, deleteUserUsingPost, getUserByIdUsingGet } from '@/api/user'
import type { UserAddRequest, LoginUserVO } from '@/api/user'

// --- 创建 ---
const addForm = reactive<UserAddRequest>({
  userAccount: '',
  userName: '',
})
const doAdd = async () => {
  // res 是 string 类型的 ID
  const res = await addUserUsingPost(addForm)
  if (res) {
    message.success('创建成功，ID: ' + res)
  }
}

// --- 删除 ---
// 修正：id 初始化为空字符串
const deleteForm = reactive({ id: '' })
const doDelete = async () => {
  if(!deleteForm.id) {
    message.warning('请输入ID')
    return
  }
  const res = await deleteUserUsingPost({ id: deleteForm.id })
  if (res) {
    message.success('删除成功')
  } else {
    message.error('删除失败 (可能ID不存在)')
  }
}

// --- 查询 ---
// 修正：id 初始化为空字符串
const getForm = reactive({ id: '' })
const currentUser = ref<LoginUserVO>()
const doGet = async () => {
  if(!getForm.id) {
    message.warning('请输入ID')
    return
  }
  const res = await getUserByIdUsingGet(getForm.id)
  if (res) {
    currentUser.value = res
    message.success('查询成功')
  }
}
</script>

<style scoped>
#userManagePage {
  padding: 20px;
}
.action-card {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}
.result-box {
  margin-top: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  word-break: break-all;
}
</style>
