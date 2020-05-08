const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
/* 爬虫的目标链接地址: 豆瓣电影 */
const url = `https://movie.douban.com/tag/#/?sort=R&range=0,10&tags=`;
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time);
});
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.more');
    const result = await page.evaluate(() => { 
        let $ = window.$;
        let nodeItems = $('.list-wp a');
        let links = [];
        /* 获取对应的元素节点 */
        if (nodeItems.length >= 1) {
            nodeItems.each((index, item) => {
                let elem = $(item);
                let movieId = elem.find('div').data('id');
                let title = elem.find('.title').text();
                let images = elem.find('img').attr('src').replace('s_ratio_poster', 'l_ratio_poster');
                links.push({
                    movieId,
                    title,
                    images,
                })
            })
        }
        return links;
    })

    await browser.close();

    // 创建一个可以写入的流，写入到文件 demo01.txt 中
    var writerStream = fs.createWriteStream('demo01.txt');

    // 使用 utf8 编码写入数据
    writerStream.write(JSON.stringify(result), 'UTF8');

    // 标记文件末尾
    writerStream.end();

    // 处理流事件 --> data, end, and error
    writerStream.on('finish', function () {
        console.log("写入完成。");
    });

    writerStream.on('error', function (err) {
        console.log(err.stack);
    });

    console.log("程序执行完毕");
});