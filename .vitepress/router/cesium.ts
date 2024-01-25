import { DefaultTheme } from "vitepress";

/** @type {Array<DefaultTheme.SidebarItem>} Cesium 左侧目录结构 */
const router: Array<DefaultTheme.SidebarItem> = [
  {
    text: "基础",
    items: [
      {
        text: "vite 环境搭建 Cesium",
        link: "base/quickstart"
      }
    ]
  },
];
export default router; 
