// .vitepress/theme/index.ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

export default {
  extends: DefaultTheme,
  async enhanceApp({ router }) {
    if (typeof global !== 'undefined' && typeof window !== 'undefined' ) {
      router.onAfterRouteChanged = (to: string) => {
        if (Object.prototype.hasOwnProperty.call(window, '_hmt') && typeof window['_hmt'] !== "undefined"){
          window['_hmt'].push(["_trackPageview", to]);
        }
      }
    }
  }
} satisfies Theme
