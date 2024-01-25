import { DefaultTheme } from "vitepress";

/** @type {Array<DefaultTheme.SidebarItem>} Three 左侧目录结构 */
const router: Array<DefaultTheme.SidebarItem> = [
  {
    text: "案例",
    items: [
      {
        text: "居中四方体",
        link: "example/centeredCube"
      },
      {
        text: "自定义标签",
        link: "example/customLabel"
      }
    ]
  },
];
export default router; 
