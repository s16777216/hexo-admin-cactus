const fs = require('hexo-fs');
const path = require('path');

/**
 * 取得單一文章內容
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res
 * @param {import('hexo')} hexo
 */
function getPost(req, res, hexo) {
    const postPath = decodeURIComponent(req.url || '');

    hexo.log.info(`[Cactus] Fetching post from path: ${postPath}`);
    // 1. 確認是否有提供文章路徑
    if (!postPath && postPath !== '/') {
        res.send(400, "Bad Request: Missing post path");
        return;
    }

    // 2. 檢查文章是否存在
    const filePath = path.join(hexo.source_dir, postPath);
    hexo.log.info(`[Cactus] Checking if post exists at path: ${filePath}`);
    const postPathExists = fs.existsSync(filePath);
    if (!postPathExists) {
        res.send(404, "Not Found: Post does not exist");
        return;
    }

    // 3. 讀取文章內容
    const post = fs.readFileSync(filePath, {
        encoding: 'utf-8'
    });
    if (!post) {
        res.send(500, "Internal Server Error: Unable to read post");
        return;
    }

    // 4. 回傳文章內容
    res.done(post);
}

module.exports = getPost;