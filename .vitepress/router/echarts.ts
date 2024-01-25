import { DefaultTheme } from "vitepress";

/** @type {Array<DefaultTheme.SidebarItem>} Echarts 的左侧目录 */
const router: Array<DefaultTheme.SidebarItem> = [
  {
    text: "折线图",
    items: [
      {
        text: "y轴范围动态等分",
        link: "line/dynamicBisection"
      }
    ]
  },
  {
    text: "柱状图",
    items: [
      {
        text: "子弹图",
        link: "bar/bullet"
      }
    ]
  },
  {
    text: "饼图",
    items: [
      {
        text: "标签下划线",
        link: "pie/labelUnderline",
      }
    ]
  },
  {
    text: "雷达图",
    items: [
      {
        text: "不等分雷达图",
        link: "radar/unevenRadar",
      }
    ]
  }
];
export default router; 
