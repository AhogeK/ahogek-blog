/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_WEBSOCKET_URL: string;
  readonly PUBLIC_VIDEO_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}