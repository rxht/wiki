import { defineConfig } from 'vitepress'
import { name, author, license, repository } from '../package.json'

const isProd = process.env.NODE_ENV === 'production'
const base = isProd ? `/${name}/` : '/'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RXHT",
  description: "博客",
  srcDir: 'src',
  head: [
    ['link', { rel: 'icon', href: `${base}icon.ico` }],
    [
      'script',
      {},
      `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?1c8747729d3e68104abbedf054aed8d2";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      `
    ]
  ],
  base,
  outDir: 'docs',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: repository },
      { icon: 'slack', link: repository }
    ],

    footer: {
      message: `Released under the ${license} License.`,
      copyright: `Copyright © 2019-${new Date().getFullYear()} ${author}`
    },
  }
})
