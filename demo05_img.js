const puppeteer = require('puppeteer');
const fs = require("fs");
const request = require("request");
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://image.baidu.com');
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    await page.focus('#kw');
    await page.keyboard.sendCharacter('狗');
    await page.click('.s_search');
    page.on('load', async () => {
        console.log('page loading done, start fetch ...');
        const srcs = await page.evaluate(() => {
            const images = document.querySelectorAll('img.main_img');
            return Array.prototype.map.call(images, img => img.src);
        });
        console.log(`get ${srcs.length} image, start download`);

        srcs.forEach(async (src, index) => {
            let filename = `${index}.jpg`;
            // 这里有些问题，base64或者undefined没兼容
            request(src).pipe(fs.createWriteStream("./images" + filename));
        });
        await browser.close();
    })
})();


