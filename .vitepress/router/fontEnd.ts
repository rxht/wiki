import { DefaultTheme } from "vitepress";

/** @type {Array<DefaultTheme.SidebarItem>} 前端 左侧目录结构 */
const router: Array<DefaultTheme.SidebarItem> = [
  {
    text: '基础',
    items: [
      {
        text: '模块化',
        link: 'base/module'
      }
    ]
  },
  {
    text: '进阶',
    items: [
      {
        text: 'JS 多进程',
        link: 'advanced/multithreading'
      },
      {
        text: '浏览器底层原理',
        link: 'advanced/browserPrinciples'
      },
      {
        text: '事件循环机制',
        link: 'advanced/eventLoop'
      },
      {
        text: '前端基建',
        link: 'advanced/Infrastructure'
      },
      {
        text: 'HTTP',
        collapsed: true,
        items: [
          {
            text: '缓存',
            link: 'HTTP/Cache'
          },
          {
            text: '预检请求',
            link: 'HTTP/PreRequest'
          },
          {
            text: '请求过程',
            link: 'HTTP/RequestProcess'
          }
        ]
      }
    ]
  },
  {
    text: '优化',
    items: [
      {
        text: 'Core Web Vitals',
        link: 'optimize/CoreWebVitals'
      },
      {
        text: '项目优化',
        link: 'optimize/Project'
      }
    ]
  },
  {
    text: '架构',
    items: [
      {
        text: 'Vue 引入原子设计',
        link: 'architecture/atomDesign'
      }
    ]
  }
];
export default router; 
