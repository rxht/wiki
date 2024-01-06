---
prev:
  text: '返回前端手册'
  link: '../'
---

# 浏览器原理



## 前言

::: info
进程（process）：是程序的一次执行过程，是一个动态概念，是程序在执行过程中分配和管理资源的基本单位
线程（thread）：是CPU调度和分派的基本单位，它可与同属一个进程的其他的线程共享进程所拥有的全部资源。
:::

线程是跑在进程里面的，一个进程里面可能有一个或者多个线程，而一个线程，只能隶属于一个进程。
浏览器一般为多进程程序，例如Chrome。但是由于进程与进程之间的内存空间是无法共享的，所以需要使用IPC机制（Inter Process Communication）来进行通讯。

## 多进程架构的好处

1. 更高的容错性，现代的WEB应用是非常复杂的，但是又无法保证其WEB应用没有任何BUG，当渲染进程执行到BUG位置的时候有可能就会直接崩溃，但是在多进程架构下每一个Tab页面都是一个单独的进程，所以当其中一个Tab页面崩溃的话也不会影响到其他Tab页面。如下图所示：
2. 更高的安全性和沙盒性（sanboxing），浏览器为了更好更安全的执行并加载网络上的资源（JS、HTML、CSS、图片、视频、音频等）设计了不同访问权限的多线程架构（例如：渲染进程无法直接读取/操作本地文件），并提供了运行沙盒。
3. 更高的响应速度，在单进程的架构中，各个任务相互竞争抢夺CPU资源，使得浏览器响应速度变慢，多进程架构就解决了这样的一个问题。

![image-20240106160532035](browserPrinciples/image-20240106160532035.png)



## 浏览器架构

在Chrome中，主要的进程有4个：
1. **浏览器进程 (Browser Process)：**负责浏览器的TAB的前进、后退、地址栏、书签栏的工作和处理浏览器的一些不可见的底层操作，比如网络请求和文件访问。
2. **渲染进程 (Renderer Process)：**负责一个Tab内的显示相关的工作，也称渲染引擎。
3. **插件进程 (Plugin Process)：**负责控制网页使用到的各种插件。
4. **GPU进程 (GPU Process)：**负责处理整个应用程序的GPU任务。

![image-20240106155201674](browserPrinciples/image-20240106155201674.png)

### 浏览器进程 (Browser Process)

1. UI线程 (UI thread): 控制浏览器上的按钮及输入框
2. 网络线程 (network thread / network service process): 处理网络请求，从网上获取数据。
3. 存储线程 (storage thread): 控制文件等的访问

### 渲染进程 (Renderer Process)

1. 主线程 (main thread)
2. 工作线程 (work thread)
3. 合成器线程 (compositor thread)
4. 光栅化线程 (raster thread)

### 插件进程 (Plugin Process)

### GPU进程 (GPU Process)
