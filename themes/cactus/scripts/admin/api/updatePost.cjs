const matter = require('gray-matter');
const fs = require('hexo-fs');
const path = require('path');

/**
 * 更新文章內容
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res
 * @param {import('hexo')} hexo
 */
function updatePost(req, res, hexo) {
    let postPath = decodeURIComponent(req.url || '').replace(/^\//, '');
    
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

    // 4. 若title有變更，更新檔案名稱
    const oldFileName = path.basename(filePath, path.extname(filePath)).trim();
    const newFileName = toFileNameCase(matter(rawContent).data?.title.trim() || '');
    if (newFileName && newFileName !== oldFileName) {
        const newFileNameTemp = `${newFileName.replaceAll(/ /g, '-')}${path.extname(filePath)}`;
        const newFilePath = path.join(path.dirname(filePath), newFileNameTemp);
        fs.renameSync(filePath, newFilePath);

        // 更新 postPath 以反映新的檔案名稱
        postPath = path.relative(hexo.source_dir, newFilePath).replaceAll(/\\/g, '/');
    }

    // 5. 回傳成功訊息
    res.done({
        path: postPath
    });
}

/**
 * string 轉成檔名格式
 * @param {string} str 
 * @returns {string}
 */
function toFileNameCase(str) {
    return str.replaceAll(/ /g, '-');
}

module.exports = updatePost;