/**
 * 图片编辑消息类型枚举
 * 对应后端: PictureEditMessageTypeEnum.java
 */
export const PICTURE_EDIT_MESSAGE_TYPE_ENUM = {
  INFO: "INFO",             // 发送通知
  ERROR: "ERROR",           // 发送错误
  ENTER_EDIT: "ENTER_EDIT", // 进入编辑状态
  EXIT_EDIT: "EXIT_EDIT",   // 退出编辑状态
  EDIT_ACTION: "EDIT_ACTION", // 执行编辑操作
  USER_ENTER: "USER_ENTER", // 用户进入
  USER_EXIT: "USER_EXIT",   // 用户退出
};

/**
 * 图片编辑动作枚举
 * 对应后端: PictureEditActionEnum.java
 */
export const PICTURE_EDIT_ACTION_ENUM = {
  ZOOM_IN: "ZOOM_IN",       // 放大
  ZOOM_OUT: "ZOOM_OUT",     // 缩小
  ROTATE_LEFT: "ROTATE_LEFT", // 左旋
  ROTATE_RIGHT: "ROTATE_RIGHT" // 右旋
};
