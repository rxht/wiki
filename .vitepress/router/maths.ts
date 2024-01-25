import { DefaultTheme } from "vitepress";

/** @type {Array<DefaultTheme.SidebarItem>} Maths 左侧目录结构 */
const router: Array<DefaultTheme.SidebarItem> = [
  {
    text: "几何学",
    items: [
      {
        text: "内切圆",
        link: "geometry/inscribedCircle",
      },
      {
        text: "距离&角度",
        link: "geometry/distanceAndAngle",
      }
    ]
  }
];
export default router; 
