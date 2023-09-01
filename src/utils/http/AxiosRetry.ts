import type { AxiosError, AxiosInstance } from 'axios'

export class AxiosRetry {
  /**
   * 重试
   */
  retry(axiosInstance: AxiosInstance, error: AxiosError) {
    // @ts-expect-error 这里首先无法确定config是否为存在，然后AxiosResponse上的config没有自定义的requestOptions属性
    const { config } = error.response
    const { waitTime, count } = config?.requestOptions?.retryRequest ?? {}
    config._retryCount = config._retryCount || 0
    if (config._retryCount >= count) return Promise.reject(error)
    config._retryCount += 1
    // 请求返回后config的header不正确造成重试请求失败,删除返回headers采用默认headers
    delete config.headers
    return this.delay(waitTime).then(() => axiosInstance(config))
  }

  /**
   * 延迟
   */
  private delay(waitTime: number) {
    return new Promise((resolve) => setTimeout(resolve, waitTime))
  }
}
