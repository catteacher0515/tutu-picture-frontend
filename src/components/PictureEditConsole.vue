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
import { ref, computed } from 'vue';
import type { LoginUserVO } from '@/api/user';
import {
  PictureEditActionEnum,
  PictureEditMessageTypeEnum,
  type PictureEditResponseMessage
} from '@/utils/PictureEditWebSocket';

// --- 1. 定义 Props (接收父组件数据) ---
interface Props {
  pictureId: number;
  user: LoginUserVO;       // 我是谁
  editingUser: LoginUserVO | null; // 当前谁在编辑 (由父组件控制)
}
const props = defineProps<Props>();

// --- 2. 定义 Emits (通知父组件做事) ---
const emit = defineEmits(['enter-edit', 'exit-edit', 'edit-action']);

// --- 3. 状态与计算属性 ---
const logs = ref<{ time: string; content: string }[]>([]);

// 计算属性：判断“我”是否是当前的编辑者
const isEditing = computed(() => {
  if (!props.editingUser || !props.user) return false;
  return props.editingUser.id === props.user.id;
});

// --- 4. 交互事件 (只负责通知父组件) ---
const enterEdit = () => {
  emit('enter-edit');
};

const exitEdit = () => {
  emit('exit-edit');
};

const doAction = (action: PictureEditActionEnum) => {
  emit('edit-action', action);
};

// --- 5. 辅助函数：写日志 ---
const addLog = (content: string) => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    content,
  });
  if (logs.value.length > 20) {
    logs.value.pop();
  }
};

// --- 6. 暴露给父组件的方法 (父组件收到 WS 消息后调用这里) ---
const handleWebSocketMessage = (msg: PictureEditResponseMessage) => {
  switch (msg.type) {
    case PictureEditMessageTypeEnum.INFO:
      // 过滤掉连接成功的冗余消息
      if (!msg.message.includes('连接成功')) {
        addLog(`📢 ${msg.message}`);
      }
      break;
    case PictureEditMessageTypeEnum.ERROR:
      addLog(`⚠️ ${msg.message}`);
      break;
    case PictureEditMessageTypeEnum.ENTER_EDIT:
      addLog(`🔒 用户 ${msg.user?.userName} 开始编辑`);
      break;
    case PictureEditMessageTypeEnum.EXIT_EDIT:
      addLog(`🔓 用户 ${msg.user?.userName} 退出编辑`);
      break;
    case PictureEditMessageTypeEnum.EDIT_ACTION:
      addLog(`⚡ ${msg.user?.userName} 执行了 [${msg.editAction}]`);
      break;
  }
};

// 暴露出去
defineExpose({
  handleWebSocketMessage,
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
