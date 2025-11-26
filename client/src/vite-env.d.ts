/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string; // todas as suas variáveis VITE_ aqui
  readonly NODE_ENV: "development" | "production" | "test";
  readonly PROD: boolean;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
