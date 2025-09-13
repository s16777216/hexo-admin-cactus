const path = require("path");

/**
 * 建立新文章
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res
 * @param {import('hexo')} hexo
 */
async function newPost(req, res, hexo) {
    /**
     * @type {string}
     */
    const title = req.body.title || "New Post";
    const result = await hexo.post.create({
        title: title,
        layout: "draft",
    } , false);

    const newPostPath = path.relative(hexo.source_dir, result.path).replaceAll(/\\/g, '/');
    res.done(newPostPath);
}

module.exports = newPost;