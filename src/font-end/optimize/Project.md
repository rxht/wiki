
# 前端项目优化

## 网络优化

1. DNS预解析：`link`标签的`rel`属性设置`dns-prefetch`，提前获取域名对应的`IP地址`；
2. 网站静态资源数据可使用CDN代理；
3. 第三方依赖库可以使用第三方CDN的引入方式（例如Echarts: https://www.jsdelivr.com/package/npm/echarts/dist/echarts.js）；
4. 使用 HTTP/2；
5. 减少不必要的HTTP 301 和 302 重定向；
6. 在 `Vite` 中使用 `vite-plugin-cdn2` 将指定第三方插件配置为CDN的引入方式

   安装 `npm install vite-plugin-cdn2 -D`
      ```typescript
      // vite.config.ts 文件中配置
      import { defineConfig } from "vite";
      import { cdn } from "vite-plugin-cdn2";
      export default defineConfig({
         plugins: [
            //  ... your plugin
            cdn({ modules: ["vue"] }),
         ],
      });
      ```


## 缓存优化

1. 网站静态数据资源可开启缓存功能（强缓存或协商缓存）；



## JS 优化

1. JS 去操作 `DOM` 时，尽量减少`DOM`的更新次数，避免频繁更新`DOM`；
2. 对于长列表的页面，每个节点都绑定事件的话会占用大量的内存，可以将事件绑定在父节点上，触发事件后再判定是哪个节点所触发的事件；
3. 在频繁触发的事件上使用防抖或节流函数（例如：scroll事件、resize事件、mousemove事件、mouseover事件等）






## 页面优化

1. 长列表页面使用虚拟滚动；
2. 减少触发回流的操作;
   - 改变 DOM 元素的几何属性（width、height、padding、margin、left、top等）
   - 改变 DOM 树的结构(节点的增减、移动等操作)
3. 减少动画所引起的回流操作；
   1. 优先使用`transform` 和 `opacity`属性，并且尽量使用`will-change` 来告诉渲染引擎，让它为元素创建独立的层。
   2. 对于弹框等其它一些动画效果可以将其设置为单独图层（设置为绝对定位、固定定位）




## 图片优化

1. 避免图片`src`属性为空，如果`src`为空字符串，浏览器还是会发起一个HTTP请求（IE 向页面所在的目录发送请求； Safari、Chrome、Firefox 向页面本身发送请求； Opera 不执行任何操作）；
2. 功能图标使用`iconfont`代替图片；
3. 使用图片懒加载；
4. 使用webp图片格式；



## 压缩优化

1. 从 HTTP1.1 开始，Web 客户端可以通过 HTTP 请求中的 Accept-Encoding 头来标识对压缩的支持（这个请求头会列出一系列的压缩方法），如果 Web 服务器看到请求中的这个头，就会使用客户端列出的方法中的一种来压缩响应。Web 服务器通过响应中的 Content-Encoding 头来告知 Web 客户端使用哪种方法进行的压缩，目前许多网站通常会压缩 HTML 文档，脚本和样式表的压缩也是值得的（包括 XML 和 JSON 在内的任何文本响应理论上都值得被压缩）。但是，图片和 PDF 文件不应该被压缩，因为它们本来已经被压缩了；

2. 图片压缩；
   
	* Vite
   
   	安装 `npm i vite-plugin-imagemin -D`

    ```typescript
    // vite.config.ts 文件中配置
    import { defineConfig} from "vite"
    import viteImagemin from 'vite-plugin-imagemin'
    export default defineConfig({
        plugins:[
            viteImagemin({
               gifsicle: {
                  optimizationLevel: 7,
                  interlaced: false
               },
               // 无损压缩配置，无损压缩下图片质量不会变差
               optipng: {
                  optimizationLevel: 7
               },
               mozjpeg: {
                  quality: 20
               },
               // 有损压缩配置，有损压缩下图片质量可能会变差
               pngquant: {
                  quality: [0.8, 0.9],
                  speed: 4
               },
               // svg 优化
               svgo: {
                  plugins: [
                     {
                        name: 'removeViewBox'
                     },
                     {
                        name: 'removeEmptyAttrs',
                        active: false
                     }
                  ]
               }
            })
        ]
    })
    ```

3. 代码压缩；
  
	* Vite
   
   	安装 `npm i terser -D`

    ```typescript
    // vite.config.ts 文件中配置
    import { defineConfig} from "vite"
    import viteImagemin from 'vite-plugin-imagemin'
    export default defineConfig({
      build: {  
         minify: 'terser', // 启用 terser 压缩  
         terserOptions: {  
            compress: {  
               pure_funcs: ['console.log'], // 只删除 console.log  
               drop_debugger: true, // 删除 debugger  
               drop_console: true, // 删除所有 console
            }  
         }  
      }
    })
    ```

4. 开启GZIP压缩（例如：Apache、Nginx、IIS、阿里云OSS、腾讯云COS、华为云OBS等）；

	* Nginx

   ```Nginx
   gzip  on;
   gzip_min_length 1k;
   gzip_buffers 4 16k;
   gzip_comp_level 6;
   gzip_types text/plain text/css text/xml application/javascript application/x-javascript application/xml application/json;
   gzip_vary on;
   gzip_disable "MSIE [1-6]\.";
   ```

      配置好后需要重新启动Nginx，看到请求响应头中有`Content-Encoding: gzip`，说明传输压缩配置已经生效；

	
	​     
	* Node 服务器

   	安装 `npm install compression —save`
   	
   ```javascript
   var compression = require('compression');
   var app = express();
   app.use(compression())
   ```

      重启服务，看到请求响应头中有`Content-Encoding: gzip`，说明传输压缩配置已经生效；

   
	* Vite

   	安装 `npm i vite-plugin-compression2 -D`

    ```typescript
    // vite.config.ts 文件中配置
    import { defineConfig} from "vite"
    import { compression } from 'vite-plugin-compression2'
    export default defineConfig({
        plugins:[
            // 就是使用这个插件实现的文件压缩
            compression({
                threshold: 2000, // 设置只有超过 2k 的文件才执行压缩
                deleteOriginalAssets: false, // 设置是否删除原文件
                skipIfLargerOrEqual: true, // 如果压缩后的文件大小与原文件大小一致或者更大时，不进行压缩
                // 其他的属性暂不需要配置，使用默认即可
            })
        ]
    })
    ```

      执行完Vite的build功能后在输出文件夹中会出现文件后缀为[.gz]的文件，说明配置已经生效；
