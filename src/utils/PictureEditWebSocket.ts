// src/utils/PictureEditWebSocket.ts

import type { LoginUserVO } from '@/api/user';

/**
 * 图片编辑消息类型枚举
 */
export enum PictureEditMessageTypeEnum {
  INFO = "INFO",
  ERROR = "ERROR",
  ENTER_EDIT = "ENTER_EDIT",
  EXIT_EDIT = "EXIT_EDIT",
  EDIT_ACTION = "EDIT_ACTION",
}

/**
 * 图片编辑动作枚举
 */
export enum PictureEditActionEnum {
  ZOOM_IN = "ZOOM_IN",
  ZOOM_OUT = "ZOOM_OUT",
  ROTATE_LEFT = "ROTATE_LEFT",
  ROTATE_RIGHT = "ROTATE_RIGHT",
}

/**
 * 发送给后端的消息结构
 */
export interface PictureEditRequestMessage {
  type: PictureEditMessageTypeEnum;
  editAction?: PictureEditActionEnum;
}

/**
 * 接收后端的响应结构
 */
export interface PictureEditResponseMessage {
  type: PictureEditMessageTypeEnum;
  message: string;
  editAction?: PictureEditActionEnum;
  user?: LoginUserVO;
}

/**
 * 事件处理器类型定义
 */
export type PictureEditEventHandler = (data: PictureEditResponseMessage) => void;

/**
 * ✅ 新增：定义构造函数配置项接口
 */
export interface PictureEditWebSocketOptions {
  onOpen?: () => void;
  onMessage?: (msg: PictureEditResponseMessage) => void;
  // 🟢 修复点：加上这一行注释，让 ESLint 忽略这里的 any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (err: any) => void;
  onClose?: (event: CloseEvent) => void;
}

/**
 * 图片编辑 WebSocket 管理类
 */
export default class PictureEditWebSocket {
  // ✅ 修改：ID 改为 string 类型，防止雪花算法精度丢失
  private pictureId: string;
  private socket: WebSocket | null;
  private eventHandlers: Map<PictureEditMessageTypeEnum, PictureEditEventHandler[]>;
  // ✅ 新增：保存配置项
  private options: PictureEditWebSocketOptions;

  // ✅ 修改：构造函数接收 options
  constructor(pictureId: string, options: PictureEditWebSocketOptions = {}) {
    this.pictureId = pictureId;
    this.socket = null;
    this.eventHandlers = new Map();
    this.options = options;
  }

  /**
   * 建立连接
   */
  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host;
    // 拼接地址
    const url = `${protocol}://${host}/api/ws/picture/edit?pictureId=${this.pictureId}`;

    console.log('🔗 [WebSocket] 尝试连接:', url);

    this.socket = new WebSocket(url);
    this.socket.binaryType = 'blob';

    // --- 监听事件 ---
    this.socket.onopen = () => {
      console.log('✅ [WebSocket] 连接已建立');
      // ✅ 触发配置中的 onOpen
      this.options.onOpen?.();
    };

    this.socket.onmessage = (event) => {
      try {
        const msg: PictureEditResponseMessage = JSON.parse(event.data);

        // ✅ 优先触发配置中的 onMessage (Vue 组件里的业务逻辑)
        this.options.onMessage?.(msg);

        // 分发给对应的内部监听器
        this.triggerEvent(msg.type, msg);
      } catch (e) {
        console.error('❌ [WebSocket] 消息解析失败', e);
      }
    };

    this.socket.onclose = (e) => {
      if (e.code === 4003 || e.code === 1006) {
        console.error('🔒 [WebSocket] 连接被拒绝 (可能未登录或无权限)');
      } else {
        console.log('🔒 [WebSocket] 连接已关闭', e.code, e.reason);
      }
      // ✅ 触发配置中的 onClose
      this.options.onClose?.(e);
    };

    this.socket.onerror = (error) => {
      console.error('❌ [WebSocket] 发生错误', error);
      // ✅ 触发配置中的 onError
      this.options.onError?.(error);
    };
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * 发送消息
   */
  sendMessage(msg: PictureEditRequestMessage) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    } else {
      console.warn('⚠️ [WebSocket] 连接未建立，无法发送指令');
    }
  }

  /**
   * 注册事件监听
   */
  on(type: PictureEditMessageTypeEnum, handler: PictureEditEventHandler) {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, []);
    }
    this.eventHandlers.get(type)?.push(handler);
  }

  /**
   * 内部触发事件
   */
  private triggerEvent(type: PictureEditMessageTypeEnum, data: PictureEditResponseMessage) {
    const handlers = this.eventHandlers.get(type);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}
