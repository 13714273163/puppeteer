const puppeteer = require('puppeteer');
const fs = require('fs');

// 连接 MySQL：先安装 npm i mysql -D
var mysql = require('mysql');
// MySQL 的连接信息
var connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '123456',
    // database: 'guowf'
    host: 'xxxx',
    user: 'xxxx',
    password: 'xxxx',
    database: 'xxxx'
});
// 开始连接
connection.connect();

let result = ''
/* 爬虫的目标链接地址: 豆瓣电影 */
const url = `https://movie.douban.com/tag/#/?sort=R&range=0,10&tags=`;
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.more');
    result = await page.evaluate(() => {
        let $ = window.$;
        let nodeItems = $('.list-wp a');
        let links = [];
        /* 获取对应的元素节点 */
        if (nodeItems.length >= 1) {
            nodeItems.each((index, item) => {
                let elem = $(item);
                let id = elem.find('div').data('id');
                let title = elem.find('.title').text();
                let images = elem.find('img').attr('src').replace('s_ratio_poster', 'l_ratio_poster');
                links.push([
                    id,
                    title,
                    images
                ])
            })
        }
        return links;
    })

    await browser.close();

    // let sql = "INSERT INTO newsList(id,title) VALUES( ?, ?)";
    // 多条语句
    let sql = "INSERT INTO newsList(id,title,images) VALUES ?";
    // 连接 SQL 并实施语句
    // var result = [
    //     [34977892, '列夫·朗道：勇敢的人'],
    //     [34964048, '黑色画集～证言～'],
    //     [35032309, '相识风雨中']
    // ];
    connection.query(sql, [result], function (error1, response1) {
        if (error1) {
            throw error1;
        } else {
            console.log("\n新增成功！");
        }
    })

    connection.end()
    console.log(result)

    console.log("程序执行完毕");
});

