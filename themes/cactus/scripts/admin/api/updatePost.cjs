const { default: matter } = require('gray-matter');
const fs = require('hexo-fs');
const path = require('path');

/**
 * 更新文章內容
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res
 * @param {import('hexo')} hexo
 */
function updatePost(req, res, hexo) {
    const postPath = decodeURIComponent(req.url || '');
    


    // 1. 確認是否有提供文章路徑
    if (!postPath && postPath !== '/') {
        res.send(400, "Bad Request: Missing post path");
        return;
    }

    // 2. 檢查文章是否存在
    const filePath = path.join(hexo.source_dir, postPath);
    const postPathExists = fs.existsSync(filePath);
    if (!postPathExists) {
        res.send(404, "Not Found: Post does not exist");
        return;
    }

    // 3. 更新文章內容
    /**
     * @type {{header?: string, content?: string}}
     */
    const post = req.body;
    const header = post.header || '';
    const content = post.content || '';
    const rawContent = `---\n${header}\n---\n${content}`;
    fs.writeFileSync(filePath, rawContent, {
        encoding: 'utf-8'
    });

    // 4. 回傳成功訊息
    res.done();
}

module.exports = updatePost;