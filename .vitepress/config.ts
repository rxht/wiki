import { defineConfig } from 'vitepress'
import { name, license } from '../package.json'

const isProd = process.env.NODE_ENV === 'production'
const base = isProd ? `/${name}/` : '/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RXHT",
  description: "博客",
  head: [['link', { rel: 'icon', href: `${base}icon.ico` }]],
  base,
  outDir: 'docs',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
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
      { icon: 'github', link: 'https://github.com/rxht/wiki' }
    ],

    footer: {
      message: `Released under the ${license} License.`,
      copyright: 'Copyright © 2019-present Evan You'
    },
  }
})
