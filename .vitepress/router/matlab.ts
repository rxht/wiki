import { DefaultTheme } from "vitepress";

/** @type {Array<DefaultTheme.SidebarItem>} Matlab 左侧目录结构 */
const router: Array<DefaultTheme.SidebarItem> = [
  {
    text: "记录",
    items: [
      {
        text: "香农编码",
        link: "shannonCoding",
      }
    ]
  }
];
export default router; 
