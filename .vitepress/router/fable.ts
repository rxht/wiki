import { DefaultTheme } from "vitepress";

/** @type {Array<DefaultTheme.SidebarItem>} 小故事 左侧目录结构 */
const router: Array<DefaultTheme.SidebarItem> = [
  {
    text: "0-3岁",
    items: [
      {
        text: "小明钓鱼",
        link: "0-3/goFishing",
      },
      {
        text: "小明生日",
        link: "0-3/birthday",
      },
      {
        text: "小明爬山",
        link: "0-3/mountainClimbing",
      }
    ]
  }
];
export default router; 
