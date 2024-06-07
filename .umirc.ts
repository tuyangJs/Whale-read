import { defineConfig } from "umi";
const code = defineConfig({
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      layout: false,
      routes: [
        { path: "/", component: "index", },
        { path: "/soso", component: "soso", },
        { path: "/app", component: "app", },
        { path: "/setweb", component: "setweb", },
        { path: '/read', component: "read", },
        { path: '/devtools', component: "devtools", },
        { path: '/about', component: "about", },
      ],
    },

  ],
  mountElementId: 'Whale_Read',
  history: {
    type: 'hash',
  },
  npmClient: 'pnpm',
})

export default code;
