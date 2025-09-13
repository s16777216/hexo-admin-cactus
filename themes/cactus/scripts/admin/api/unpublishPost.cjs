const fs = require('hexo-fs');
const path = require('path');
/**
 * 發布文章
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res
 * @param {import('hexo')} hexo
 */
function unpublishPost(req, res, hexo) {
    const source = req.body.source;
    if (!source) {
        res.send(400, { error: "Missing source" });
        return;
    }

    if(!fs.existsSync(path.join(hexo.source_dir, source))){
        res.send(400, { error: "Source file does not exist" });
        return;
    }

    // move file from _posts to _drafts
    const postsDir = hexo.source_dir + '_posts/';
    const draftsDir = hexo.source_dir + '_drafts/';
    const filePath = source.replace(/^_posts\//, '');
    const srcPath = path.join(postsDir, filePath);
    const destPath = path.join(draftsDir, filePath);

    fs.renameSync(srcPath, destPath);
    hexo.log.info(`Unpublished post: ${source}`);
    res.done({
        source: path.relative(hexo.source_dir, destPath).replaceAll(/\\/g, '/')
    });
}

module.exports = unpublishPost;