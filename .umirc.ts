import { defineConfig } from "umi";
// .umirc.ts

export default defineConfig({
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  routes: [
    { path: "/", component: "index"},
    { path: "/soso", component: "soso" },
    { path: "/app", component: "app" },
    { path: "/setweb", component: "setweb" },
    { path: '/read', component: "read" },
    { path: '/welcome', component: "welcome" }
  ],
  npmClient: 'pnpm',
}); 
