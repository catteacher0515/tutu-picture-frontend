<template>
  <div class="picture-detail-page">
    <a-row :gutter="[24, 24]">
      <a-col :span="16">
        <a-card hoverable class="image-card">
          <div class="image-wrapper">
            <a-image
              v-if="picture"
              :src="picture.url"
              :alt="picture.name"
              style="max-width: 100%; max-height: 600px; object-fit: contain"
            />
            <a-skeleton v-else active :paragraph="{ rows: 10 }" />
          </div>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-space direction="vertical" style="width: 100%" size="middle">
          <a-card title="图片信息">
            <a-skeleton v-if="!picture" active />
            <a-descriptions v-else :column="1" bordered size="small">
              <a-descriptions-item label="名称">{{ picture.name }}</a-descriptions-item>
              <a-descriptions-item label="简介">{{ picture.introduction }}</a-descriptions-item>
              <a-descriptions-item label="尺寸">
                {{ picture.picWidth }} x {{ picture.picHeight }}
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                <a-tag color="blue">团队空间</a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <PictureEditConsole
            v-if="picture && loginUser"
            :picture-id="Number(picture.id)"
            :user="loginUser"
          />
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getLoginUser } from '@/generated/backend/userController';
import type { LoginUserVO } from '@/api/user';
import PictureEditConsole from '@/components/PictureEditConsole.vue';

// --- 定义接口 ---
interface PictureVO {
  id: number;
  url: string;
  name: string;
  introduction?: string;
  picWidth?: number;
  picHeight?: number;
  spaceId?: number;
}

// --- 模拟数据方法 ---
const getPictureVOById = async (id: string | number): Promise<{ data: PictureVO }> => {
  // ✅ 修复 1：打印一下 id，证明我们用到了它
  console.log('正在获取图片详情，Mock ID:', id);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: 2001262304171663362,
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          name: '协同编辑测试图',
          introduction: '这是一张用于测试 WebSocket 协同的图片',
          picWidth: 1024,
          picHeight: 768,
          spaceId: 123
        }
      });
    }, 500);
  });
};

// --- 状态定义 ---
const route = useRoute();
const picture = ref<PictureVO | null>(null);
const loginUser = ref<LoginUserVO | null>(null);

// --- 核心逻辑 ---
onMounted(async () => {
  const id = route.params.id || '2001262304171663362';

  // 1. 获取用户信息
  try {
    const res = await getLoginUser();
    const user = res as unknown as LoginUserVO;

    if (user && user.id) {
      loginUser.value = user;
      console.log('✅ [详情页] 已获取真实登录用户:', loginUser.value.userName);
    } else {
      throw new Error('未登录');
    }
  } catch (error) {
    // ✅ 修复 2：把 error 打印出来，证明我们关心错误原因
    console.warn('⚠️ 获取用户失败或未登录，切换为访客模式。错误详情:', error);

    loginUser.value = {
      id: '1993239384233156614', // 👈 你的真实 ID
      userName: '访客侦探',
      userAvatar: '',
      userProfile: '我是兜底的',
      userRole: 'user',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };
  }

  // 2. 获取图片信息
  try {
    const picRes = await getPictureVOById(id as string);
    if (picRes.data) {
      picture.value = picRes.data;
      console.log('✅ [详情页] 已加载图片:', picture.value.name);
    }
  } catch (error) {
    console.error('❌ 图片加载失败:', error);
  }
});
</script>

<style scoped>
.picture-detail-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}
.image-card {
  text-align: center;
  background: #fafafa;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
