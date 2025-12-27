// src/utils/PictureEditWebSocket.ts

// ⚠️ 确保你的 @/api/user 文件里有 LoginUserVO 的定义
import type { LoginUserVO } from '@/api/user';

/**
 * 图片编辑消息类型枚举
 * (必须和后端 PictureEditMessageTypeEnum 保持一致)
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
 * (必须和后端 PictureEditActionEnum 保持一致)
 */
export enum PictureEditActionEnum {
  ZOOM_IN = "ZOOM_IN",
  ZOOM_OUT = "ZOOM_OUT",
  ROTATE_LEFT = "ROTATE_LEFT",
  ROTATE_RIGHT = "ROTATE_RIGHT",
  // CROP = "CROP", // ⚠️ 后端暂时未实现 CROP，这里先注释掉或者留着但别触发
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
 * 图片编辑 WebSocket 管理类
 * 负责建立连接、发送指令、分发消息
 */
export default class PictureEditWebSocket {
  private pictureId: number;
  private socket: WebSocket | null;
  // 事件监听列表：一种消息类型 -> 对应多个处理函数
  private eventHandlers: Map<PictureEditMessageTypeEnum, PictureEditEventHandler[]>;

  constructor(pictureId: number) {
    this.pictureId = pictureId;
    this.socket = null;
    this.eventHandlers = new Map();
  }

  /**
   * 建立连接
   */
  connect() {
    // 👇 1. 动态获取当前域名 (适配 localhost 和 线上环境)
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host; // 例如 localhost:5173

    // 👇 2. 拼接地址
    // 关键点：保留 /api 前缀，触发 vite.config.ts 的代理转发
    // 最终转发给后端：ws://localhost:8081/ws/picture/edit?pictureId=xxx
    const url = `${protocol}://${host}/api/ws/picture/edit?pictureId=${this.pictureId}`;

    console.log('🔗 [WebSocket] 尝试连接:', url);

    // 👇 3. 创建实例 (浏览器会自动携带当前域下的 Cookie)
    this.socket = new WebSocket(url);
    this.socket.binaryType = 'blob';

    // --- 监听事件 ---
    this.socket.onopen = () => {
      console.log('✅ [WebSocket] 连接已建立');
    };

    this.socket.onmessage = (event) => {
      try {
        // 解析后端发来的 JSON
        const msg: PictureEditResponseMessage = JSON.parse(event.data);
        // 分发给对应的监听器
        this.triggerEvent(msg.type, msg);
      } catch (e) {
        console.error('❌ [WebSocket] 消息解析失败', e);
      }
    };

    this.socket.onclose = (e) => {
      // 正常关闭是 1000，非正常可能是 400x
      if (e.code === 4003 || e.code === 1006) {
        console.error('🔒 [WebSocket] 连接被拒绝 (可能未登录或无权限)');
      } else {
        console.log('🔒 [WebSocket] 连接已关闭', e.code, e.reason);
      }
    };

    this.socket.onerror = (error) => {
      console.error('❌ [WebSocket] 发生错误', error);
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
   * @param type 消息类型
   * @param handler 回调函数
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
