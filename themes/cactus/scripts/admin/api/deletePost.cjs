const path = require('path');
const fs = require('hexo-fs');
/**
 * 刪除文章
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res
 * @param {import('hexo')} hexo
 */
function deletePost(req, res, hexo) {
    const postPath = decodeURIComponent(req.url || '');
    if (!postPath) {
        res.send(400, { error: "Missing post path" });
        return;
    }

    const fullPath = path.join(hexo.source_dir, postPath);
    if (!fs.existsSync(fullPath)) {
        res.send(404, { error: "Post not found" });
        return;
    }

    fs.unlinkSync(fullPath);
    hexo.log.info(`Deleted post: ${postPath}`);
    res.done({ success: true });
}

module.exports = deletePost;