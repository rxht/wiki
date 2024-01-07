
# HTTP 请求过程
> [渲染页面：浏览器的工作原理](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work)

1. 当我们在浏览器的地址栏输入内容按下回车时，[浏览器进程 (Browser Process)](../advanced/browserPrinciples#浏览器进程-browser-process) 会将对应的URL交给其子线程 (网络线程)；

2. 网络线程发起请求（如果输入的为IP地址则直接发起 [TCP握手](./RequestProcess#tcp-握手) 请求。如果为域名则发起 [DNS](./RequestProcess#dns-查询) 查询得到对应的，再发起[TCP握手](./RequestProcess#tcp-握手) 请求），最后发起资源请求；

3. 同时创建启动一个 [渲染进程 (Renderer Process)](../advanced/browserPrinciples#渲染进程-renderer-process)；

4. 在得到对应的资源数据（如果返回重定向的话则重新启动一个 [渲染进程 (Renderer Process)](../advanced/browserPrinciples#渲染进程-renderer-process)，关闭原本创建启动的 [渲染进程 (Renderer Process)](../advanced/browserPrinciples#渲染进程-renderer-process)）后将数据传给对应的 [渲染进程 (Renderer Process)](../advanced/browserPrinciples#渲染进程-renderer-process)；

5. 同时 [浏览器进程 (Browser Process)](../advanced/browserPrinciples#浏览器进程-browser-process) 会发送IPC消息告诉[渲染进程 (Renderer Process)](../advanced/browserPrinciples#渲染进程-renderer-process)确认导航；

6. [渲染进程 (Renderer Process)](../advanced/browserPrinciples#渲染进程-renderer-process) 接收到数据后发送IPC消息告诉[浏览器进程 (Browser Process)](../advanced/browserPrinciples#浏览器进程-browser-process) 导航已经提交，页面开始加载；

7. [渲染进程 (Renderer Process)](../advanced/browserPrinciples#渲染进程-renderer-process) 开始解析：

   - **HTML 解析**

     TML 解析涉及到[符号化](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMTokenList)和树的构造。HTML 标记包括开始和结束标记，以及属性名和值。如果文档格式良好，则解析它会简单而快速。解析器将标记化的输入解析到文档中，构建文档树。

     DOM 树描述了文档的内容。[``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/html) 元素是第一个标签也是文档树的根节点。树反映了不同标记之间的关系和层次结构。嵌套在其他标记中的标记是子节点。DOM 节点的数量越多，构建 DOM 树所需的时间就越长。

   - **CSS 解析**

     CSS 对象模型和 DOM 是相似的。DOM 和 CSSOM 是两棵树。它们是独立的数据结构。浏览器将 CSS 规则转换为可以理解和使用的样式映射。浏览器遍历 CSS 中的每个规则集，根据 CSS 选择器创建具有父、子和兄弟关系的节点树。

     与 HTML 一样，浏览器需要将接收到的 CSS 规则转换为可以使用的内容。因此，它重复了 HTML 到对象的过程，但对于 CSS。

     CSSOM 树包括来自用户代理样式表的样式。浏览器从适用于节点的最通用规则开始，并通过应用更具体的规则递归地优化计算的样式。换句话说，它级联属性值。

     构建 CSSOM 非常快，并且在当前的开发工具中没有以独特的颜色显示。相反，开发人员工具中的“重新计算样式”显示解析 CSS、构建 CSSOM 树和递归计算计算样式所需的总时间。在 web 性能优化方面，它是可轻易实现的，因为创建 CSSOM 的总时间通常小于一次 DNS 查询所需的时间。

   - **合并渲染树**

     将 DOM 和 CSSOM 组合成渲染树。计算样式树或渲染树的构建从 DOM 树的根开始，遍历每个可见节点。

     不会被显示的元素，如 [head](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/head) 元素及其子元素，以及任何带有 `display: none` 的节点，如用户代理样式表中的 `script { display: none; }`，都不会包含在渲染树中，因为它们不会出现在渲染输出中。应用了 `visibility: hidden` 的节点会包含在渲染树中，因为它们会占用空间。由于我们没有给出任何指令来覆盖用户代理默认值，因此上述代码示例中的 `script` 节点不会包含在渲染树中。

     每个可见节点都应用了 CSSOM 规则。渲染树包含所有可见节点的内容和计算样式，将所有相关样式与 DOM 树中的每个可见节点匹配起来，并根据 [CSS 级联](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Cascade)，确定每个节点的计算样式。

   - **布局（回流）**

     渲染树上运行布局以计算每个节点的几何体。*布局*是确定呈现树中所有节点的宽度、高度和位置，以及确定页面上每个对象的大小和位置的过程。回流是对页面的任何部分或整个文档的任何后续大小和位置的确定。

     构建渲染树后，开始布局。渲染树标识显示哪些节点（即使不可见）及其计算样式，但不标识每个节点的尺寸或位置。为了确定每个对象的确切大小和位置，浏览器从渲染树的根开始遍历它。

     在网页上，大多数东西都是一个盒子。不同的设备和不同的桌面意味着无限数量的不同的视区大小。在此阶段，考虑到视口大小，浏览器将确定屏幕上所有不同框的尺寸。以视口的大小为基础，布局通常从 body 开始，用每个元素的框模型属性排列所有 body 的子孙元素的尺寸，为不知道其尺寸的替换元素（例如图像）提供占位符空间。

     第一次确定节点的大小和位置称为布局。随后对节点大小和位置的重新计算称为回流。在我们的示例中，假设初始布局发生在返回图像之前。由于我们没有声明图像的尺寸，因此一旦知道图像的尺寸，就会出现回流。

   - **绘制（重绘）**

     将各个节点绘制到屏幕上，第一次出现的节点称为 **first meaningful paint (en-US)**。在绘制或光栅化阶段，浏览器将在布局阶段计算的每个框转换为屏幕上的实际像素。绘画包括将元素的每个可视部分绘制到屏幕上，包括文本、颜色、边框、阴影和替换的元素（如按钮和图像）。浏览器需要非常快地完成这项工作。

     为了确保平滑滚动和动画，占据主线程的所有内容，包括计算样式，以及回流和绘制，必须让浏览器在 16.67 毫秒内完成。在 2048x1536 分辨率的 iPad 上，有超过 314.5 万像素将被绘制到屏幕上。那是很多像素需要快速绘制。为了确保重绘的速度比初始绘制的速度更快，屏幕上的绘图通常被分解成数层。如果发生这种情况，则需要进行合成。

     绘制可以将布局树中的元素分解为多个层。将内容提升到 GPU 上的层（而不是 CPU 上的主线程）可以提高绘制和重新绘制性能。有一些特定的属性和元素可以实例化一个层，包括 [video](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video) 和 [canvas](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas)，任何 CSS 属性为 [opacity](https://developer.mozilla.org/zh-CN/docs/Web/CSS/opacity) 、3D [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)、[will-change](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change) 的元素，还有一些其他元素。这些节点将与子节点一起绘制到它们自己的层上，除非子节点由于上述一个（或多个）原因需要自己的层。

     分层确实可以提高性能，但是它以内存管理为代价，因此不应作为 web 性能优化策略的一部分过度使用。

   - **合成**

     当文档的各个部分以不同的层绘制，相互重叠时，必须进行合成，以确保它们以正确的顺序绘制到屏幕上，并正确显示内容。

     当页面继续加载资源时，可能会发生回流（回想一下我们迟到的示例图像），回流会触发重新绘制和重新组合。如果我们定义了图像的大小，就不需要重新绘制，只需要重新绘制需要重新绘制的层，并在必要时进行合成。但我们没有包括图像大小！从服务器获取图像后，渲染过程将返回到布局步骤并从那里重新开始。

8. [渲染进程 (Renderer Process)](../advanced/browserPrinciples#渲染进程-renderer-process) 解析完页面数据后会触发onload事件，并向 [浏览器进程 (Browser Process)](../advanced/browserPrinciples#浏览器进程-browser-process) 发送IPC消息告诉 [浏览器进程 (Browser Process)](../advanced/browserPrinciples#浏览器进程-browser-process) 页面加载完成；


## [DNS 查询](https://developer.mozilla.org/zh-CN/docs/Glossary/DNS)

当我们进行DNS查询时，实际做的就是将我们所查询的域名发送给DNS服务器，并得到域名所对应的[IP地址](https://developer.mozilla.org/zh-CN/docs/Glossary/IP_Address)，如果错误的话则会显示错误信息。当我们查询完之后，对应的IP地址会被缓存到浏览器中，再次进行访问同一个域名时会直接读取缓存，不需要再次进行DNS查询。


## [TCP 握手](https://developer.mozilla.org/en-US/docs/Glossary/TCP_handshake)

主机（通常是浏览器）一旦知道了网站的 IP 地址，它将尝试通过 TCP 三次握手（SYN、SYN-ACK、ACK，因为 TCP 有三个消息传输，用于协商和启动两台计算机之间的TCP 会话），与持有资源的服务器建立 TCP/IP 连接。
主机（通常是浏览器）向服务器发送 TCP SYNchronize 数据包。服务器接收 SYN 并发回 SYNchronize-ACKnowledgement。主机接收服务器的 SYN-ACK 并发送 ACKnowledge。服务器收到 ACK，并建立 TCP 套接字连接。

## [TLS协商](https://developer.mozilla.org/en-US/docs/Glossary/TLS)

传输层安全性协议 (Transport Layer Security，缩写作 TLS)，它的前身是安全套接层 (Secure Sockets Layer，缩写作 SSL)，是一个被应用程序用来在网络中安全通信的 protocol （通讯协议），防止电子邮件、网页、消息以及其他协议被篡改或是窃听。
所有现代浏览器都支持 TLS 协议，它们都要求服务器提供一个有效的digital certificate（数字证书）来确认身份以建立安全连接。如果客户端和服务器都能提供自己的数字证书，则它们可以互相认证。

## [HTTP 请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)

超文本传输协议（HTTP）是一个用于传输超媒体文档（例如 HTML）的应用层协议。它是为 Web 浏览器与 Web 服务器之间的通信而设计的，但也可以用于其他目的。HTTP 遵循经典的客户端—服务端模型，客户端打开一个连接以发出请求，然后等待直到收到服务器端响应。HTTP 是无状态协议，这意味着服务器不会在两个请求之间保留任何数据（状态）。
