## 操作流程
1. `/index` index.html
2. 把资源放在 public 文件中，然后开放 public 目录的静态资源
    * 当请求 `/public/xxx` 的时候，读取响应 public 目录中的具体资源
3. `/post` post.html
4. `/comment`
   * 接受表单提交数据
   * 存储表单提交的数据
   * 让表单重定向到 `/`
       * `statusCode` 重定向，状态码`302`
       * `setHeader` 在响应头中通过 Location 告诉客户端往哪重定向 `Location` `/`
5. 不使用原始的 `URL`，引入 `URL` 模块，使用 `parse` 方法将路径解析为一个方便操作的对象，第二个参数为 `true` 表示直接将查询字符串转为一个对象（通过 `query` 属性来访问），在提交表单的前提下
   

## Node 的控制台    
## REPL
- READ  =>  读取
- EVAL  =>  运算
- PRINT =>  打印
- LOOP  =>  循环


- 在控制台中输入 `node` 不加任何指令，然后敲击回车，即可打开 `node` 的控制台
- 跟浏览器的控制台大同小异
- 没有只能提示
- 只能识别 `node` 的API
- 核心模块可以直接在控制台使用，不同引用模块

### 模块系统
  - 核心模块
  - 第三方模块
  - 自己写的模块