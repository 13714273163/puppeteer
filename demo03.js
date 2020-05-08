const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
/* 爬虫的目标链接地址: 豆瓣读书 */

let allpages = 5

puppeteer.launch().then(async browser => {
    let timer, result
    let i = 1
    let page
    // await page.goto(url);
    // const result = await page.evaluate(() => {
    //     let list = []
    //     document.querySelectorAll('.book-item').forEach((item, index) => {
    //         let title = item.querySelector('h3').textContent
    //         let image = item.querySelector('img').getAttribute('src')
    //         list.push({
    //             title,
    //             image
    //         })
    //     })
    //     return list;
    // })

    async function get() {
        page = await browser.newPage();
        await page.goto(`https://market.douban.com/book/?utm_campaign=book_nav_freyr&utm_source=douban&utm_medium=pc_web&page=${i}&page_num=18&`);
        result = await page.evaluate(() => {
            let list = []
            document.querySelectorAll('.book-item').forEach((item, index) => {
                let title = item.querySelector('h3').textContent
                let image = item.querySelector('img').getAttribute('src')
                list.push({
                    title,
                    image
                })
            })
            return list;
        });
        fs.writeFile('./demo03.txt', JSON.stringify(result), { 'flag': 'a' }, function (err) {
            if (err) throw err;
            console.log('写入成功' + i);
            if (i < allpages) {
                i++
            } else {
                clearInterval(timer)
            }
        });
    }
    timer = setInterval(async function () {
        await get();
    }, 5000);
});

