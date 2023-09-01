import type { UploadApiResult } from './model/uploadModel'
import { http } from '@/utils/http'
import type { UploadFileParams } from '@/types/axios'

/// Todo:上传地址
const uploadUrl = ''

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void
) {
  return http.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      // @ts-expect-error ///Todo:待处理
      onUploadProgress,
    },
    params
  )
}
