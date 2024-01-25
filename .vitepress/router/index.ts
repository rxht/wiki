import { DefaultTheme } from 'vitepress'

import fontEndRouter from './fontEnd'
import backEndRouter from './backEnd'
import pythonRouter from './python'
import matlabRouter from './matlab'
import fableRouter from './fable'
import echartsRouter from './echarts'
import threeRouter from './three'
import cesiumRouter from './cesium'
import mathsRouter from './maths'

/** @type {DefaultTheme.Sidebar} 侧边栏菜单项的配置。更多详细信息，请参见默认主题：侧边栏 */
export const sidebar: DefaultTheme.Sidebar = {
  "/font-end/": { base: "/font-end/", items: fontEndRouter },
  "/back-end/": { base: "/back-end/", items: backEndRouter },
  "/back-end/Python/": { base: "/back-end/Python/", items: pythonRouter },
  "/back-end/Matlab/": { base: "/back-end/Matlab/", items: matlabRouter },
  "/fable/": { base: "/fable/", items: fableRouter },
  "/echarts/": { base: "/echarts/", items: echartsRouter },
  "/three/": { base: "/three/", items: threeRouter },
  "/cesium/": { base: "/cesium/", items: cesiumRouter },
  "/maths/": { base: "/maths/", items: mathsRouter },
}

/** @type {Array<DefaultTheme.NavItem>} 导航菜单项的配置。更多详细信息，请参阅默认主题：导航。 */
export const nav: Array<DefaultTheme.NavItem> = [
  { text: "UI组件库", link: "https://rxht.github.io/ui/" },
  { text: "合集", link: "/compilation/" },
  {
    text: "友情链接", items: [
      {
        text: "测试 - Balance",
        link: "https://heshiqi1.github.io/blog/"
      },
      {
        text: "前端 - Chatty garden",
        link: "https://yyi0708.github.io/chatty-garden/"
      }
    ]
  },
];
