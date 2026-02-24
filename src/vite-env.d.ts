/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL = https://eelepkal.com
    readonly VITE_TIMEOUT = 10000
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
