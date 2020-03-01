const puppeteer = require("puppeteer");

const BASE_URL = "https://instagram.com";
const TAG_URL = (tag = "istanbul") => `https://www.instagram.com/explore/tags/${tag}/`
const EXPLORE_URL = "https://www.instagram.com/explore/";
const POST_URL = "https://www.instagram.com/p/B3oibFKgBfP/";

const instagram = {
    browser: null,
    page: null,

    initialize: async() => {
        // instagram.browser = await puppeteer.launch();
        instagram.browser = await puppeteer.launch({
            headless: false
        });
        instagram.page = await instagram.browser.newPage();
    },

    login: async(username, password) => {
        await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        let loginButton = await instagram.page.$x('//*[@id="react-root"]/section/main/article/div[2]/div[2]/p/a');
        await loginButton[0].click();

        // await instagram.page.waitForNavigation({ waitUntil: 'networkidle2' });
        await instagram.page.waitFor(1000);

        await instagram.page.type('input[name="username"]', username, { delay: 50 });
        await instagram.page.type('input[name="password"]', password, { delay: 50 });

        let submitloginButton = await instagram.page.$x('/html/body/div[1]/section/main/div/article/div/div[1]/div/form/div[4]');
        await submitloginButton[0].click();

        await instagram.page.waitFor(3000);
    },

    getComments: async() => {
        await instagram.page.goto(POST_URL);
        // await instagram.page.waitForNavigation({ waitUntil: 'networkidle0' });
        await instagram.page.waitFor(1500);

        // let counter = 0;
        var moreMessagesButton = await instagram.page.$x('/html/body/div[1]/section/main/div/div/article/div[2]/div[1]/ul/li/div/button/span');
        if (moreMessagesButton.length > 0) {
            for (;;) {
                await moreMessagesButton[0].click();
                try {
                    await instagram.page.waitForXPath("/html/body/div[1]/section/main/div/div/article/div[2]/div[1]/ul/li/div/button/span");
                    moreMessagesButton = await instagram.page.$x('/html/body/div[1]/section/main/div/div/article/div[2]/div[1]/ul/li/div/button/span');
                } catch (e) { break; }
                if (!moreMessagesButton.length > 0) break;
            }
            await instagram.page.waitFor(100);
        }

        var comments = [];
        for (let i = 2;; i++) {
            try {
                let commentElement = await instagram.page.$(`ul.Mr508:nth-child(${i}) > div:nth-child(1) > li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1) > a:nth-child(1)`);
                let userElement = await instagram.page.$(`ul.Mr508:nth-child(${i}) > div:nth-child(1) > li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)`);
                let commentElementText = await (await commentElement.getProperty('textContent')).jsonValue();
                let userElementText = await (await userElement.getProperty('textContent')).jsonValue();
                // console.log(`${commentElementText} : ${userElementText}`);
                comments.push({
                    [commentElementText]: userElementText
                });
            } catch { break; }
        }
        let random = Math.floor(Math.random() * comments.length);
        // console.log(comments);
        console.dir(comments, { 'maxArrayLength': null })
        console.log("\n");
        console.log(comments.length);
        console.log("\n");
        console.log(comments[random]);
    },

    followinExplore: async() => { //still developing
        await instagram.page.goto(EXPLORE_URL, { waitUntil: "networkidle2" });
        await instagram.page.waitFor(1500);

        let xpath, post;
        for (let i = 1; 45; i++) {
            for (let j = 1; j < 4; j++) {
                xpath = `/html/body/div[1]/section/main/div/article/div[1]/div/div[${i}]/div[${j}]/a/div/div[2]`
                console.log(xpath)
                post = await instagram.page.$x(xpath);
                await post[0].click();

                await instagram.page.waitFor(1500);

                let followButton = await instagram.page.$x('/html/body/div[4]/div[2]/div/article/header/div[2]/div[1]/div[2]/button');
                await followButton[0].click();

                await instagram.page.waitFor(1000); //100
                // let unfollowButton = ;
                let temp = await instagram.page.$$('.piCib');

                // if (temp.length > 0) //onu zaten takip ediyosundur hallet


                await instagram.page.waitFor(250);

                let closeModalButton = await instagram.page.$x('/html/body/div[4]/button[1]');
                await closeModalButton[0].click();

                await instagram.page.waitFor(100);
            }
            await instagram.page.waitFor(500);
        }
    },

    likeTagsProcess: async(tags = []) => {
        for (let tag of tags) {
            await instagram.page.goto(TAG_URL(tag), { waitUntil: "networkidle2" });
            await instagram.page.waitFor(1000);

            let posts = await instagram.page.$$("article > div:nth-child(3) img[decoding='auto']")

            for (let i = 0; i < 3; i++) {
                let post = posts[i];
                await post.click();

                await instagram.page.waitFor('div[id="react-root"]');
                await instagram.page.waitFor(2000);

                let likeButton = await instagram.page.$x('/html/body/div[4]/div[2]/div/article/div[2]/section[1]/span[1]/button/span');
                await likeButton[0].click();

                await instagram.page.waitFor(1500)

                let closeModalButton = await instagram.page.$x('/html/body/div[4]/button[1]');
                await closeModalButton[0].click();

                await instagram.page.waitFor(1000);
            }
            await instagram.page.waitFor(5000);

        }
    }
}

module.exports = instagram;