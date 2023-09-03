const toString = Object.prototype.toString

// 判断val是否为type类型
export function is(val: unknown, type: string) {
  // 获取val的类型
  return toString.call(val) === `[object ${type}]`
}

// 判断val是否为Def类型
export function isDef<T = unknown>(val?: T): val is T {
  // 如果val不存在，则返回false
  return typeof val !== 'undefined'
}

// 判断val是否为UnDef类型
export function isUnDef<T = unknown>(val?: T): val is T {
  // 如果val存在，则返回false
  return !isDef(val)
}

// 判断val是否为Object类型
export function isObject(val: any): val is Record<any, any> {
  // 如果val不为null，且为Object类型，则返回true
  return val !== null && is(val, 'Object')
}

// 判断val是否为空
export function isEmpty<T = unknown>(val: T): val is T {
  // 如果val为数组或者字符串，则返回false
  if (isArray(val) || isString(val)) return val.length === 0

  // 如果val为Map或者Set，则返回false
  if (val instanceof Map || val instanceof Set) return val.size === 0

  // 如果val为对象，则返回keys的长度为0
  if (isObject(val)) return Object.keys(val).length === 0

  // 否则返回false
  return false
}

// 判断val是否为Date类型
export function isDate(val: unknown): val is Date {
  // 如果val为Date类型，则返回true
  return is(val, 'Date')
}

// 判断val是否为null
export function isNull(val: unknown): val is null {
  // 如果val为null，则返回true
  return val === null
}

// 判断val是否为null和UnDef类型
export function isNullAndUnDef(val: unknown): val is null | undefined {
  // 如果val为UnDef类型，且为null，则返回true
  return isUnDef(val) && isNull(val)
}

// 判断val是否为null或UnDef类型
export function isNullOrUnDef(val: unknown): val is null | undefined {
  // 如果val为UnDef类型或为null，则返回true
  return isUnDef(val) || isNull(val)
}

// 判断val是否为Number类型
export function isNumber(val: unknown): val is number {
  // 如果val为Number类型，则返回true
  return is(val, 'Number')
}

// 判断val是否为Promise类型
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  // 如果val为Promise类型，且为Object类型，且为then和catch方法，则返回true
  return (
    is(val, 'Promise') &&
    isObject(val) &&
    isFunction(val.then) &&
    isFunction(val.catch)
  )
}

// 判断val是否为String类型
export function isString(val: unknown): val is string {
  // 如果val为String类型，则返回true
  return is(val, 'String')
}

// 判断val是否为Function类型
export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export function isUrl(path: string): boolean {
  const reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/
  return reg.test(path)
}
