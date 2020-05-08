const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');




puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    // 聚焦输入框    
    await page.focus('xx');
    // 输入关键词
    await page.keyboard.sendCharacter('xx');
    //模拟点击按钮
    await page.click('.xx');
    //等页面加载完成
    page.on('load', async () => { 
        // 其他操作...

        // let html = data.toString();
        // let $ = cheerio.load(html);
    })
    await browser.close();


});


/***
 * https://zhaoqize.github.io/puppeteer-api-zh_CN/
 * https://zhuanlan.zhihu.com/p/76237595
 * 
 * page.goto：打开新页面
 * page.goBack ：回退到上一个页面
 * page.goForward ：前进到下一个页面
 * page.reload ：重新加载页面
 * page.waitForNavigation：等待页面跳转
 * 
 * 
 * page.waitForXPath：等待 xPath 对应的元素出现，返回对应的 ElementHandle 实例
 * page.waitForSelector ：等待选择器对应的元素出现，返回对应的 ElementHandle 实例
 * page.waitForResponse ：等待某个响应结束，返回 Response 实例
 * page.waitForRequest：等待某个请求出现，返回 Request 实例
 */
