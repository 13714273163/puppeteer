// 连接 MySQL：先安装 npm i mysql -D
var mysql = require('mysql');
// MySQL 的连接信息
var connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '123456',
    // database: 'guowf'
    host: 'sdm699633211.my3w.com',
    user: '',
    password: '',
    database: 'sdm699633211_db'
});
// 开始连接
connection.connect();

// 引入 http 模块：http 是提供 Web 服务的基础
const http = require("http");

// 引入 url 模块：url 是对用户提交的路径进行解析
const url = require("url");

// 引入 qs 模块：qs 是对路径进行 json 化或者将 json 转换为 string 路径
const qs = require("querystring");

// 用 http 模块创建服务
/**
 * req 获取 url 信息 (request)
 * res 浏览器返回响应信息 (response)
 */
http.createServer(function (req, res) {

    // 设置 cors 跨域
    res.setHeader("Access-Control-Allow-Origin", "*");
    // 设置 header 类型
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // 跨域允许的请求方式
    res.setHeader('Content-Type', 'application/json');
    console.log(req.method)
    if (req.method == 'OPTIONS') {
        res.statusCode = 200;
        res.end();
    }
    if (req.method == "POST") { // 接口 POST 形式
        // 获取前端发来的路由地址
        let pathName = req.url;
        // 接收发送过来的参数
        let tempResult = "";
        // 数据接入中
        req.addListener("data", function (chunk) {
            tempResult += chunk;
        });
        // 数据接收完成
        req.addListener("end", function () {
            // var result = JSON.stringify(qs.parse(tempResult));
            var result = tempResult;
            console.log("\n参数为：");
            console.log(result);

            if (pathName == "/sendMessage") { // 提交信息

                console.log("\n【API - 提交信息】");

                result = JSON.parse(result);

                let id = result.id;
                let title = result.title;
                if (!title) {
                    res.end("内容为空！");
                    return;
                } else if (title.length > 140) {
                    res.end("字数超过限制！");
                    return;
                } else {
                    // 新增的 SQL 语句及新增的字段信息
                    let addSql = "INSERT INTO newsList(id,title) VALUES( ?, ?)";
                    let addSqlParams = [id, title];
                    // 连接 SQL 并实施语句
                    connection.query(addSql, addSqlParams, function (error1, response1) {
                        if (error1) { // 如果 SQL 语句错误
                            throw error1;
                        } else {
                            console.log("\n新增成功！");
                            // 返回数据
                            res.write(JSON.stringify({
                                code: "100",
                                message: "success"
                            }));
                            // 结束响应
                            res.end();
                        }
                    })
                }

            }
            // 接口信息处理完毕
        })
        // 数据接收完毕

    } else if (req.method == "GET") { // 接口 GET 形式

        console.log("\n【GET 形式】");

        // 解析 url 接口
        let pathName = url.parse(req.url).pathname;

        console.log("\n接口为：" + pathName);

        if (pathName == "/getMessage") { // 获取信息

            // 解析 url 参数部分
            let params = url.parse(req.url, true).query;

            console.log("\n参数为：");
            console.log(params);

            // 新增的 SQL 语句及新增的字段信息
            let readSql = "SELECT * FROM newsList";

            // 连接 SQL 并实施语句
            connection.query(readSql, function (error1, response1) {
                if (error1) {
                    throw error1;
                } else {

                    let newRes = JSON.parse(JSON.stringify(response1));
                    console.log(newRes);

                    // 返回数据
                    res.write(JSON.stringify({
                        code: "100",
                        message: "success",
                        data: {
                            lists: newRes
                        }
                    }));

                    // 结束响应
                    res.end();
                }
            });
            // 查询完毕
        } else if (pathName == "/") { // 首页
            res.writeHead(200, {
                "Content-Type": "text/html;charset=UTF-8"
            });

            res.write('参数错误');

            res.end();
        }

    }

}).listen(3000); // 监听的端口

// 获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var year = date.getFullYear(); // 年
    var month = date.getMonth() + 1; // 月
    var strDate = date.getDate(); // 日
    var hour = date.getHours(); // 时
    var minute = date.getMinutes(); // 分
    var second = date.getMinutes(); // 秒
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    // 返回 yyyy-mm-dd hh:mm:ss 形式
    var currentdate = year + "-" + month + "-" + strDate + " " + hour + ":" + minute + ":" + second;
    return currentdate;
}