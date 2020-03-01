const ig = require("./instagram");

(async() => {
    await ig.initialize();

    // if you want to get comments from private account, you should login to account which is following the account
    // await ig.login("username","pass");

    await ig.getComments();
})();