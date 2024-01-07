# HTTP 预检请求

> 浏览器必须首先使用 [OPTIONS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS) 方法发起一个预检请求（preflight request），从而获知服务端是否允许该跨源请求。服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证（例如 [Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies) 和 [HTTP 认证](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication)相关数据）。



## 简单请求

不会触发 [CORS 预检请求](https://developer.mozilla.org/zh-CN/docs/Glossary/Preflight_request)。在废弃的 [CORS 规范](https://www.w3.org/TR/2014/REC-cors-20140116/#terminology)中称这样的请求为*简单请求*，但是目前的 [Fetch 规范](https://fetch.spec.whatwg.org/)（CORS 的现行定义规范）中不再使用这个词语。

其动机是，HTML 4.0 中的 [form](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/form) 元素（早于跨站 [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 和 [fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/fetch)）可以向任何来源提交简单请求，所以任何编写服务器的人一定已经在保护[跨站请求伪造攻击](https://developer.mozilla.org/zh-CN/docs/Glossary/CSRF)（CSRF）。在这个假设下，服务器不必选择加入（通过响应预检请求）来接收任何看起来像表单提交的请求，因为 CSRF 的威胁并不比表单提交的威胁差。然而，服务器仍然必须提供 [Access-Control-Allow-Origin](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) 的选择，以便与脚本*共享*响应。

若请求**满足所有下述条件**，则该请求可视为*简单请求*：

1. 使用下列方法之一：

    - [GET](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET)
    - [HEAD](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/HEAD)
    - [POST](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST)

2. 除了被用户代理自动设置的标头字段（例如 [Connection](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Connection)、[User-Agent](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/User-Agent) 或其他在 Fetch 规范中定义为[禁用标头名称](https://fetch.spec.whatwg.org/#forbidden-header-name)的标头），允许人为设置的字段为 Fetch 规范定义的[对 CORS 安全的标头字段集合](https://fetch.spec.whatwg.org/#cors-safelisted-request-header)。该集合为：

    - [Accept](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept)
    - [Accept-Language](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Language)
    - [Content-Language](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Language)
    - [Content-Type](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type)（需要注意额外的限制）
    - [Range](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Range)（只允许[简单的范围标头值](https://fetch.spec.whatwg.org/#simple-range-header-value) 如 `bytes=256-` 或 `bytes=127-255`）

3. `Content-Type` 标头所指定的媒体类型的值仅限于下列三者之一：
    - `text/plain`
    - `multipart/form-data`
    - `application/x-www-form-urlencoded`

4. 如果请求是使用 [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 对象发出的，在返回的 [XMLHttpRequest.upload](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/upload) 对象属性上没有注册任何事件监听器；也就是说，给定一个 [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 实例 `xhr`，没有调用 `xhr.upload.addEventListener()`，以监听该上传请求。

5. 请求中没有使用 [ReadableStream](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 对象。

::: tip
  备注： WebKit Nightly 和 Safari Technology Preview 为 Accept、Accept-Language 和 Content-Language 标头字段的值添加了额外的限制。如果这些标头字段的值是“非标准”的，WebKit/Safari 就不会将这些请求视为“简单请求”。WebKit/Safari 并没有在文档中列出哪些值是“非标准”的，不过我们可以在这里找到相关讨论：

  Require preflight for non-standard CORS-safelisted request headers Accept, Accept-Language, and Content-Language
  要求对非标准 CORS 安全列出的请求标头 Accept、Accept-Language 和 Content-Language 进行预检
  Allow commas in Accept, Accept-Language, and Content-Language request headers for simple CORS
  允许在简单 CORS 的 Accept、Accept-Language 和 Content-Language 请求标头中使用逗号
  Switch to a blacklist model for restricted Accept headers in simple CORS requests
  切换到黑名单模型，用于简单 CORS 请求中的受限制 Accept 标头
  其他浏览器并不支持这些额外的限制，因为它们不属于规范的一部分。
:::

**浏览器发送给服务器的请求报文：**

```http
GET /resources/public-data/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive
Origin: https://foo.example
```

请求标头字段 [`Origin`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Origin) 表明该请求来源于 `http://foo.example`。

**服务器响应：**

```http
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 00:23:53 GMT
Server: Apache/2
Access-Control-Allow-Origin: *
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Transfer-Encoding: chunked
Content-Type: application/xml

[…XML Data…]
```

本例中，服务端返回的 [`Access-Control-Allow-Origin`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) 标头的 `Access-Control-Allow-Origin: *` 值表明，该资源可以被**任意**外源访问。

使用 [`Origin`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Origin) 和 [`Access-Control-Allow-Origin`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) 就能完成最简单的访问控制。如果 `https://bar.other` 的资源持有者想限制他的资源*只能*通过 `https://foo.example` 来访问（也就是说，非 `https://foo.example` 域无法通过跨源访问访问到该资源），需要返回：`Access-Control-Allow-Origin: https://foo.example`

```http
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 00:23:53 GMT
Server: Apache/2
Access-Control-Allow-Origin: https://foo.example
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Transfer-Encoding: chunked
Content-Type: application/xml

[…XML Data…]
```

::: warning
**备注：** 当响应的是附带身份凭证的请求时，服务端**必须**明确 `Access-Control-Allow-Origin` 的值，而不能使用通配符“`*`”。
:::



## 预检请求

与[简单请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS#简单请求)不同，“需预检的请求”要求必须首先使用 [`OPTIONS`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS) 方法发起一个预检请求到服务器，以获知服务器是否允许该实际请求。"预检请求“的使用，可以避免跨域请求对服务器的用户数据产生未预期的影响。

**浏览器发送给服务器的请求报文：**

```http
OPTIONS /doc HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive
Origin: https://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```

从上面的报文中，我们看到，第 1 - 10 行使用 [`OPTIONS`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS) 方法发送了预检请求，浏览器根据上面的 JavaScript 代码片断所使用的请求参数来决定是否需要发送，这样服务器就可以回应是否可以接受用实际的请求参数来发送请求。OPTIONS 是 HTTP/1.1 协议中定义的方法，用于从服务器获取更多信息，是[安全](https://developer.mozilla.org/zh-CN/docs/Glossary/Safe/HTTP)的方法。该方法不会对服务器资源产生影响。

标头字段 [`Access-Control-Request-Method`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Request-Method) 告知服务器，实际请求将使用 `POST` 方法。

标头字段 [`Access-Control-Request-Headers`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Request-Headers) 告知服务器，实际请求将携带两个自定义请求标头字段：`X-PINGOTHER` 与 `Content-Type`。服务器据此决定，该实际请求是否被允许。

**服务器响应：**.

```http
HTTP/1.1 204 No Content
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2
Access-Control-Allow-Origin: https://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
Vary: Accept-Encoding, Origin
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
```

服务器的响应携带了 `Access-Control-Allow-Origin: https://foo.example`，从而限制请求的源域。同时，携带的 `Access-Control-Allow-Methods` 表明服务器允许客户端使用 `POST` 和 `GET` 方法发起请求（与 [`Allow`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Allow) 响应标头类似，但该标头具有严格的访问控制）。

标头字段 `Access-Control-Allow-Headers` 表明服务器允许请求中携带字段 `X-PINGOTHER` 与 `Content-Type`。与 `Access-Control-Allow-Methods` 一样，`Access-Control-Allow-Headers` 的值为逗号分割的列表。

最后，标头字段 [`Access-Control-Max-Age`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Max-Age) 给定了该预检请求可供缓存的时间长短，单位为秒，默认值是 5 秒。在有效时间内，浏览器无须为同一请求再次发起预检请求。以上例子中，该响应的有效时间为 86400 秒，也就是 24 小时。请注意，浏览器自身维护了一个[最大有效时间](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Max-Age)，如果该标头字段的值超过了最大有效时间，将不会生效。