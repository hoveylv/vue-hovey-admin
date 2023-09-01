/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_USE_MOCK: boolean
  VITE_PUBLIC_PATH: string
  VITE_GLOB_API_URL: string
  VITE_GLOB_UPLOAD_URL: string
  VITE_GLOB_API_URL_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'

  const Component: DefineComponent<{}, {}, any>
  export default Component
}
