// 把当前模块的依赖项都声明在文件模块最上方
// 把 HTML 文件全部放在 view 目录下
/*
    浏览器收到 HTML 响应内容之后，就要开始从上到下以此解析，
    当在解析的过程中，如果发现：
    link
    script
    img
    iframe
    video
    audio
    等具有 src 或者 link 的 href 属性标签（外部链接）的时候，浏览器会自动对这些 静态 资源发起新的请求


    为了方便统一的静态资源，我们约定把所有的静态资源都存放在 public 目录
    统一处理：
        如果请求路径是以 /public/ 开头的，则我认为你要获取 public 中的某个资源
        所以我们就直接可以把请求路径当作文件路径来直接进行读取

    哪些资源能被用户访问，那些资源不能被用户访问，现在可以通过代码来进行非常灵活的操作

    在服务端中，文件的路径就不要写相对路径了
    因为这个时候所有的资源都是通过 url 表示来获取的
    我的服务器开放了 /public/ 目录
    所以这里的请求路径都写成：/public/xxx
    / 在这里就是 url 根路径的意思
    浏览器在真正发请求的时候会自动把 http://127.0.0.1:3000 拼上

    在以后的开发中，所有的资源路径都可以想象成 url 地址
*/

/*
    以前表单是如何提交的？
    表单中需要提交的表单控件元素必须具有 name 属性

    表单提交分为两种：
        1. 默认的提交行为
        2. 表单异步提交

    action 就是表单提交的地址，说白了就是请求的 url 地址
    method 请求方法
        get
        post
*/

var http = require('http')  // http 服务器模块
var fs = require('fs')  // fs 文件模块
var template = require('art-template')  // 模板
var url = require('url')    // url 路劲模块

var comments = []   // 定义一个数组，用来存储留言的内容

/*
    http://127.0.0.1:3000/comment?name=123&text=1231231
    对于这种表单提交的请求路径，由于其中具有用户动态填写的内容
    所有你不可能通过去判断完整的 url 路径来处理这个请求

    结论：对于我们来讲，其实只需要判断，如果你的请求路径是 /comment 的时候，那我就认为你提交表单的请求过来了
*/

/*
    var server = http.createServer()
    server.on()
    server.listen()
*/
http
    .createServer(function(req, res) {
        // 使用 url.parse 方法将路径解析为一个方便操作的对象，第二个参数为 true 表示直接将查询字符串转为一个对象（通过 query 属性来访问）
        var parseObj = url.parse(req.url, true)
        
        // 该路径不包含 问号 之后的哪些内容
        var pathName = parseObj.pathname    // 127.0.0.1:3000/comment?name=xxx&messahe=xxx

        if(pathName === '/') {
            fs.readFile('./view/index.html', function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                var htmlStr = template.render(data.toString(), {
                    comments: comments
                })
                res.end(htmlStr)
            })
        } else if (pathName === '/comment') {
            // 注意：这个时候无论 /comment？xxx 之后是什么，我都不用担心了，因为我的 pathName 不包含 ？ 之后的哪个路径
            // 我们已经使用 url 模块的 parse 方法把请求路径中的查询字符串给解析成一个对象了
            // 所以接下来要做的就是：
            //      1. 获取表单提交的数据
            //      2. 生成日期到数据对象中，然后存储到数组中
            //      3. 让用户重定向到首页 / 
            //      4. 当用户重新请求 / 的时候，我数组中的数据已经发生变化了，所以用户看到的数据也发生了变化
            var comment = parseObj.query
            comment.dateTime = '2019-11-2 17:22:22'
            comments.unshift(comment)
            // 服务端这个时候已经把数据存储号了，接下来就是让用户重新请求 / 首页，就可以看到最新的留言内容了
            
            // 如何通过服务器让客户端重定向？
            //      1. 状态码设置为 302 重定向
            //          statusCode
            //      2. 在响应头中通过 Location 告诉客户端往哪重定向
            //          setHeader
            // 如果客户端发现受到服务器的响应的状态码是 302 (默认 200)就会自动去响应头中找 Location，然后对该地址发起新的请求
            // 所以你就能看到客户端自动跳转了
            //res.end(JSON.stringify(parseObj.query))

            res.statusCode = 302
            res.setHeader('Location', '/')
            res.end()
        } else if (pathName === '/index') {
            fs.readFile('./view/index.html', function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                var htmlStr = template.render(data.toString(), {
                    comments: comments
                })
                res.end(htmlStr)
            })
        } else if (pathName === '/post') {
            fs.readFile('./view/post.html', function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                res.end(data)
            })
        } else if (pathName.indexOf('/public/') === 0) {
            fs.readFile('.' + pathName, function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                res.end(data)
            })
        } else {
            fs.readFile('./view/404.html', function(err, data) {
                if (err) {
                    return res.end('404 Not Found')
                }
                res.end(data)
            })
        }
    })
    .listen(3000, function() {
        console.log(123)
    })


