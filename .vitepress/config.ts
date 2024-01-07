import { DefaultTheme, defineConfig } from "vitepress";
import { author, license, name, repository } from "../package.json";

const isProd = process.env.NODE_ENV === "production";
const base = isProd ? `/${name}/` : "/";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "RXHT",
	description: "博客",
	srcDir: "src",
	head: [
		["link", { rel: "icon", href: `${base}icon.ico` }],
		["meta", { name: "theme-color", content: "#5f67ee" }],
		["meta", { name: "og:type", content: "website" }],
		["meta", { name: "og:locale", content: "zh-cn" }],
		["meta", { name: "og:site_name", content: "RXHT-博客" }],
		["meta", { name: "og:image", content: "" }],
		[
			"script",
			{},
			`
        var _hmt = _hmt || [];
        window._hmt = _hmt;
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?1c8747729d3e68104abbedf054aed8d2";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
      `,
		],
	],
	base,
	outDir: "docs",
	lastUpdated: true,
	cleanUrls: true,
	// https://vitepress.dev/reference/default-theme-config
	themeConfig: {
		search: {
			provider: "local",
		},
		// 导航菜单项的配置。更多详细信息，请参阅默认主题：导航。
		nav: nav(),
		// 您可以定义此选项以在导航中显示带有图标的社交帐户链接。
		socialLinks: [{ icon: "github", link: repository }],
		// 侧边栏菜单项的配置。更多详细信息，请参见默认主题：侧边栏。
		sidebar: {
			"/font-end/": { base: "/font-end/", items: sidebarFontEnd() },
			"/back-end/": { base: "/back-end/", items: sidebarBackEnd() },
			"/back-end/Python/": { base: "/back-end/Python/", items: sidebarPython() },
			"/back-end/Matlab/": { base: "/back-end/Matlab/", items: sidebarMatlab() },
			"/fable/": { base: "/fable/", items: sidebarFable() },
			"/echarts/": { base: "/echarts/", items: sidebarEcharts() },
			"/maths/": { base: "/maths/", items: sidebarMaths() },
		},
		// 编辑链接允许您显示用于编辑 Git 管理服务（例如 GitHub 或 GitLab）上的页面的链接。有关更多详细信息，请参阅默认主题：编辑链接。
		editLink: {
			pattern: `${repository}/edit/main/src/:path`,
			text: "在 GitHub 上编辑本页面",
		},
		// 页脚配置。您可以在页脚上添加消息或版权文本，但是，只有当页面不包含侧边栏时才会显示它。这是由于设计方面的考虑。
		footer: {
			message: `Released under the ${license} License.`,
			copyright: `Copyright © 2019-${new Date().getFullYear()} ${author}`,
		},
	},
	vite: {
		ssr: {
			noExternal: ['echarts'],
		},
	},
	markdown: {
		math: true
	}
});

/**
 * @description 网站右上角nav
 * @author rxh
 * @date 2023-12-22
 * @return {*}  {DefaultTheme.NavItem[]}
 */
function nav(): DefaultTheme.NavItem[] {
	return [
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
}


/**
 * @description 前端左侧目录结构
 * @author rxh
 * @date 2023-12-22
 * @return {*}  {DefaultTheme.SidebarItem[]}
 */
function sidebarFontEnd(): DefaultTheme.SidebarItem[] {
	return [
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
}

/**
 * @description 后端左侧目录结构
 * @author rxh
 * @date 2023-12-22
 * @return {*}  {DefaultTheme.SidebarItem[]}
 */
function sidebarBackEnd(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: "Python",
			link: "/Python/",
		},
		{
			text: "Matlab",
			link: "/Matlab/",
		}
	]
}

/**
 * @description Python左侧目录结构
 * @author rxht
 * @date 2023-12-24
 * @returns {*}  {DefaultTheme.SidebarItem[]}
 */
function sidebarPython(): DefaultTheme.SidebarItem[] {
	return [
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
	]
}

/**
 * @description Matlab左侧目录结构
 * @author rxht
 * @date 2023-12-24
 * @returns {*}  {DefaultTheme.SidebarItem[]}
 */
function sidebarMatlab(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: "记录",
			items: [
				{
					text: "香农编码",
					link: "shannonCoding",
				}
			]
		}
	]
}

/**
 * @description 寓言左侧目录结构
 * @author rxh
 * @date 2023-12-22
 * @return {*}  {DefaultTheme.SidebarItem[]}
 */
function sidebarFable(): DefaultTheme.SidebarItem[] {
	return [
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
	]
}

/**
 * @description Echarts左侧目录结构
 * @author rxht
 * @date 2023-12-22
 * @returns {*}  {DefaultTheme.SidebarItem[]}
 */
function sidebarEcharts(): DefaultTheme.SidebarItem[] {
	return [
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
	]
}


/**
 * @description 数学左侧目录结构
 * @author rxht
 * @date 2023-12-24
 * @returns {*}  {DefaultTheme.SidebarItem[]}
 */
function sidebarMaths(): DefaultTheme.SidebarItem[] {
	return [
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
	]
}
