/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the Auth service API, e.g. http://localhost:3007/api/v1 */
  readonly VITE_AUTH_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
