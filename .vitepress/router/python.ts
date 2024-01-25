import { DefaultTheme } from "vitepress";

/** @type {Array<DefaultTheme.SidebarItem>} Python 左侧目录结构 */
const router: Array<DefaultTheme.SidebarItem> = [
  {
    text: "记录",
    items: [
      {
        text: "tkinter实现先弹出选择框后弹出输入框，并得到输入框的值",
        link: "tkinter/input",
      },
      {
        text: "Python+opencv+tkinter整合demo完成！",
        link: "tkinter/camera",
      },
      {
        text: "Tensorflow 释放内存",
        link: "tensorflow/clearMemory",
      }
    ]
  }
];
export default router; 
