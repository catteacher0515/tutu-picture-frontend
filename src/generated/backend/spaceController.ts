// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request'

/** 此处后端没有提供注释 POST /space/add */
export async function addSpace(body: API.SpaceAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/space/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
