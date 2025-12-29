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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { getLoginUser } from '@/generated/backend/userController';
import type { LoginUserVO } from '@/api/user';
import PictureEditConsole from '@/components/PictureEditConsole.vue';
import PictureEditWebSocket, { PictureEditMessageTypeEnum } from '@/utils/PictureEditWebSocket';
// --- 定义接口 ---
interface PictureVO {
  id: number; // 这里的 id 通常是 number (long)
  url: string;
  name: string;
  introduction?: string;
  picWidth?: number;
  picHeight?: number;
  spaceId?: number;
}

// --- 模拟数据方法 ---
const getPictureVOById = async (id: string | number): Promise<{ data: PictureVO }> => {
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
const editingUser = ref<LoginUserVO | null>(null);
let websocket: PictureEditWebSocket | null = null;

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
    console.warn('⚠️ 获取用户失败或未登录，切换为访客模式。错误详情:', error);

    loginUser.value = {
      id: '1993239384233156614',
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

      // 3. 图片加载成功后，初始化 WebSocket 连接
      initWebSocket();
    }
  } catch (error) {
    console.error('❌ 图片加载失败:', error);
  }
});

// 4. 页面销毁时断开连接
onUnmounted(() => {
  if (websocket) {
    websocket.disconnect();
  }
});

// --- WebSocket 初始化逻辑 ---
const initWebSocket = () => {
  if (!picture.value || !picture.value.id) {
    return;
  }

  // ✅ 修正：将 ID 转为字符串，且我们在 utils 里已经把类定义改为了 string
  const pictureId = String(picture.value.id);

  // 🛡️ 防止重复连接
  if (websocket) {
    websocket.disconnect();
  }

  // 创建实例
  websocket = new PictureEditWebSocket(pictureId, {
    onOpen: () => {
      console.log('🚀 [WebSocket] 连接成功，准备协同！');
    },

    // ✅ 修复：加上 ESLint 忽略注释，跳过 any 检查
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMessage: (msg: any) => {
      console.log('📬 [WebSocket] 收到消息:', msg);

      if (!msg) return;

      switch (msg.type) {
        case PictureEditMessageTypeEnum.INFO:
          message.info(msg.message);
          break;

        case PictureEditMessageTypeEnum.ERROR:
          message.error(msg.message);
          break;

        case PictureEditMessageTypeEnum.ENTER_EDIT:
          if (msg.user) {
            editingUser.value = msg.user;
            message.success(`${msg.user.userName} 开始编辑图片`);
          }
          break;

        case PictureEditMessageTypeEnum.EXIT_EDIT:
          editingUser.value = null;
          message.info('当前无人编辑，你可以抢占了');
          break;

        case PictureEditMessageTypeEnum.EDIT_ACTION:
          message.loading(`执行操作: ${msg.editAction}`);
          break;
      }
    },

    // ✅ 修复：加上 ESLint 忽略注释
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      console.error('💥 [WebSocket] 连接报错:', err);
      message.error('协同服务连接失败');
    },

    onClose: () => {
      console.log('🔌 [WebSocket] 连接关闭');
    }
  });

  websocket.connect();
};
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
