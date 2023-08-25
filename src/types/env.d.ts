/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_TITLE: string
  VITE_APP_PORT: string
  VITE_APP_BASE_API: string
  VITE_APP_TARGET_URL: string
  VITE_APP_TARGET_BASE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'

  const Component: DefineComponent<{}, {}, any>
  export default Component
}
