<template>
  <div class="picture-edit-console">
    <div class="action-bar">
      <a-space>
        <a-button type="primary" danger ghost v-if="isEditing" @click="exitEdit">
          🚪 退出编辑
        </a-button>
        <a-button type="primary" v-else @click="enterEdit" :disabled="!!editingUser">
          ✏️ {{ editingUser ? `用户 ${editingUser.userName} 正在编辑` : '进入编辑' }}
        </a-button>

        <a-button @click="doAction(PictureEditActionEnum.ROTATE_LEFT)" :disabled="!isEditing">
          ↺ 左旋
        </a-button>
        <a-button @click="doAction(PictureEditActionEnum.ROTATE_RIGHT)" :disabled="!isEditing">
          ↻ 右旋
        </a-button>
        <a-button @click="doAction(PictureEditActionEnum.ZOOM_IN)" :disabled="!isEditing">
          🔍 放大
        </a-button>
        <a-button @click="doAction(PictureEditActionEnum.ZOOM_OUT)" :disabled="!isEditing">
          🔎 缩小
        </a-button>
      </a-space>
    </div>

    <div class="log-panel">
      <div class="log-title">🕵️‍♂️ 协同日志</div>
      <div class="log-list">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          <span class="log-time">[{{ log.time }}]</span>
          <span class="log-content">{{ log.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { message } from 'ant-design-vue';
import type { LoginUserVO } from '@/api/user';
// 引入刚才写好的通信类和枚举
import PictureEditWebSocket, {
  PictureEditMessageTypeEnum,
  PictureEditActionEnum,
  type PictureEditResponseMessage
} from '@/utils/PictureEditWebSocket';

// --- Props 定义 ---
interface Props {
  pictureId: number;
  user: LoginUserVO; // 当前登录用户
}
const props = defineProps<Props>();

// --- 状态定义 ---
const isEditing = ref<boolean>(false); // 我是否持有编辑权
const editingUser = ref<LoginUserVO | null>(null); // 当前谁在编辑
const logs = ref<{ time: string; content: string }[]>([]);

// WebSocket 实例
let socket: PictureEditWebSocket | null = null;

// --- 辅助函数：写日志 ---
const addLog = (content: string) => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    content,
  });
  // 保持日志不超过 20 条
  if (logs.value.length > 20) {
    logs.value.pop();
  }
};

// --- 核心：初始化 WebSocket ---
const initSocket = () => {
  if (!props.pictureId || !props.user || !props.user.id) {
    console.warn('缺少必要参数，无法初始化 WebSocket');
    return;
  }

  // 1. 创建实例
  socket = new PictureEditWebSocket(props.pictureId);

  // 2. 建立连接
  socket.connect();

  // 3. 监听：通知消息 (INFO)
  socket.on(PictureEditMessageTypeEnum.INFO, (msg: PictureEditResponseMessage) => {
    // 过滤掉那条"连接成功"的废话，只显示重要的
    if (!msg.message.includes('连接成功')) {
      addLog(`📢 ${msg.message}`);
    }
  });

  // 4. 监听：错误消息 (ERROR)
  socket.on(PictureEditMessageTypeEnum.ERROR, (msg: PictureEditResponseMessage) => {
    addLog(`⚠️ ${msg.message}`);
    message.error(msg.message);
  });

  // 5. 监听：有人进入编辑 (ENTER_EDIT)
  socket.on(PictureEditMessageTypeEnum.ENTER_EDIT, (msg: PictureEditResponseMessage) => {
    addLog(`🔒 用户 ${msg.user?.userName} 开始编辑`);

    if (msg.user) {
      editingUser.value = msg.user;

      // 判断是不是我 (注意 ID 类型转换)
      if (String(msg.user.id) === String(props.user.id)) {
        isEditing.value = true;
        message.success('你已获得编辑权限，请开始操作！');
      }
    }
  });

// 6. 监听：有人退出编辑 (EXIT_EDIT)
  socket.on(PictureEditMessageTypeEnum.EXIT_EDIT, (msg: PictureEditResponseMessage) => {
    // ✅ 修复报错：随便用一下 msg，比如打印出来，或者写进日志
    console.log('有人退出:', msg);
    addLog(`🔓 ${msg.message}`); // 顺便展示在面板上，完美！
  });

  // 7. 监听：编辑动作 (EDIT_ACTION)
  socket.on(PictureEditMessageTypeEnum.EDIT_ACTION, (msg: PictureEditResponseMessage) => {
    addLog(`⚡ ${msg.user?.userName} 执行了 [${msg.editAction}]`);
    // TODO: 这里后续要绑定到 Canvas 上，现在先看日志
  });
};

// --- 按钮事件 ---
const enterEdit = () => {
  if (socket) {
    socket.sendMessage({ type: PictureEditMessageTypeEnum.ENTER_EDIT });
  }
};

const exitEdit = () => {
  // 后端暂时没实现“主动退出”，这里我们先做个假动作或刷新页面
  // 目前 MVP 逻辑是：谁先点谁就一直占着，直到断开
  message.info('MVP版本：刷新页面可释放权限');
};

const doAction = (action: PictureEditActionEnum) => {
  if (socket) {
    socket.sendMessage({
      type: PictureEditMessageTypeEnum.EDIT_ACTION,
      editAction: action
    });
  }
};

// --- 生命周期 ---
onMounted(() => {
  initSocket();
});

onUnmounted(() => {
  if (socket) {
    socket.disconnect();
  }
});

// 监听图片 ID 变化，重新连接 (防止用户在详情页直接切换图片)
watch(() => props.pictureId, (newVal) => {
  if (newVal) {
    if (socket) socket.disconnect();
    logs.value = [];
    isEditing.value = false;
    editingUser.value = null;
    initSocket();
  }
});
</script>

<style scoped>
.picture-edit-console {
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eee;
}
.action-bar {
  margin-bottom: 12px;
}
.log-panel {
  background: #fff;
  border-radius: 4px;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  max-height: 150px;
  overflow-y: auto;
}
.log-title {
  font-size: 13px;
  font-weight: bold;
  color: #666;
  margin-bottom: 6px;
}
.log-item {
  font-size: 12px;
  color: #555;
  line-height: 1.8;
  border-bottom: 1px dashed #f0f0f0;
}
.log-time {
  color: #aaa;
  margin-right: 8px;
}
</style>
