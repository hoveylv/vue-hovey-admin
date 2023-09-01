import { ResultEnum } from '@/enums/httpEnum'

export function resultSuccess<T = Recordable>(
  result: T,
  { message = 'ok' } = {}
) {
  return {
    code: ResultEnum.SUCCESS,
    result,
    message,
    type: 'success',
  }
}

export function resultPageSuccess<T = any>(
  page: number,
  pageSize: number,
  list: T[],
  { message = 'ok' } = {}
) {
  const pageData = pagination(page, pageSize, list)
  return {
    ...resultSuccess({
      items: pageData,
      total: list.length,
    }),
    message,
  }
}

export function resultError(
  message = 'Request failed',
  { code = ResultEnum.ERROR, result = null } = {}
) {
  return {
    code,
    result,
    message,
    type: 'error',
  }
}

export function pagination<T = any>(
  pageNo: number,
  pageSize: number,
  array: T[]
): T[] {
  const offset = (pageNo - 1) * Number(pageSize)
  return offset + Number(pageSize) >= array.length
    ? array.slice(offset, array.length)
    : array.slice(offset, offset + Number(pageSize))
}

export interface requestParams {
  method: string
  body: any
  headers?: { authorization?: string }
  query: any
}

export function getRequestToken({
  headers,
}: requestParams): string | undefined {
  return headers?.authorization
}
