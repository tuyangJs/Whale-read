import { defineConfig } from "umi";
// .umirc.ts;

export default defineConfig({
  routes: [
    { path: "/", component: "index",  name: '书架',hideChildrenInMenu:false,},
    { path: "/soso", component: "soso"  ,name: '在线搜索',hideChildrenInMenu:false,},
    { path: "/app", component: "app" ,name: '插件',hideChildrenInMenu:true,},
    { path: "/setweb", component: "setweb" ,name: '设置',hideChildrenInMenu:false,},
    { path: '/read', component: "read" ,name: '阅读',hideChildrenInMenu:false,},
  ],
  npmClient: 'pnpm',
    plugins: [
      '@umijs/plugins/dist/initial-state',
      '@umijs/plugins/dist/model',
    ],
    initialState: {},
    model: {},
}); 
