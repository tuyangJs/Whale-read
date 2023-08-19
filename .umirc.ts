import { defineConfig } from "umi";

export default defineConfig({
  
  routes: [
    { path: "/", component: "index" },
    { path: "/soso", component: "soso" },
    { path: "/set", component: "set" },
    { path: '/read', component: "read" }
  ],
  npmClient: 'pnpm',
});
