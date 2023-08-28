export type LocaleType =
  | 'zh_CN'
  | 'vi'
  | 'uz'
  | 'uk'
  | 'tr'
  | 'ru'
  | 'pt-BR'
  | 'pl'
  | 'ko'
  | 'ka'
  | 'ja'
  | 'it'
  | 'id'
  | 'fr'
  | 'es'
  | 'en'
  | 'de'
  | 'ar'

// export const LOCALE: { [key: string]: LocaleType } = {
//   zh_CN: 'zh_CN',
//   vi: 'vi',
//   uz: 'uz',
//   uk: 'uk',
//   tr: 'tr',
//   ru: 'ru',
//   'pt-BR': 'pt-BR',
//   pl: 'pl',
//   ko: 'ko',
//   ka: 'ka',
//   ja: 'ja',
//   it: 'it',
//   id: 'id',
//   fr: 'fr',
//   es: 'es',
//   en: 'en',
//   de: 'de',
//   ar: 'ar',
// }

export interface AppConfig {
  language: LocaleType
}
