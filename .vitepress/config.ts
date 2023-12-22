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
		},
		// 编辑链接允许您显示用于编辑 Git 管理服务（例如 GitHub 或 GitLab）上的页面的链接。有关更多详细信息，请参阅默认主题：编辑链接。
		editLink: {
			pattern: `${repository}/edit/main/src/:path`,
			text: "Edit this page on GitHub",
		},
		// 页脚配置。您可以在页脚上添加消息或版权文本，但是，只有当页面不包含侧边栏时才会显示它。这是由于设计方面的考虑。
		footer: {
			message: `Released under the ${license} License.`,
			copyright: `Copyright © 2019-${new Date().getFullYear()} ${author}`,
		},
	},
});

/**
 * @description 网站右上角nav
 * @author rxh
 * @date 2023-12-22
 * @return {*}  {DefaultTheme.NavItem[]}
 */
function nav(): DefaultTheme.NavItem[] {
	return [
		{ text: "前端手册", link: "/font-end/" },
		{ text: "后端手册", link: "/back-end/" },
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
			text: "001",
			items: [
				{
					text: "Js基础知识-进阶",
					link: "basic/js",
				},
				{
					text: "Js基础知识-进阶",
					link: "basic/js",
				},
				{
					text: "Js基础知识-进阶",
					link: "basic/js",
				},
				{
					text: "Js基础知识-进阶",
					link: "basic/js",
				},
				{
					text: "Js基础知识-进阶",
					link: "basic/js",
				},
				{
					text: "Js基础知识-进阶",
					link: "basic/js",
				},
				{
					text: "Js基础知识-进阶",
					link: "basic/js",
				},
			],
		},
		{
			text: "002",
			items: [],
		},
	];
}

/**
 * @description 后端左侧目录结构
 * @author rxh
 * @date 2023-12-22
 * @return {*}  {DefaultTheme.SidebarItem[]}
 */
function sidebarBackEnd(): DefaultTheme.SidebarItem[] {
	return [];
}
