const fs = require('hexo-fs');
const path = require('path');

/**
 * 取得草稿列表
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res
 * @param {import('hexo')} hexo
 */
function getDrafts(req, res, hexo) {
    // 使用 fs 模块读取草稿文件夹
    const draftsDir = path.join(hexo.source_dir, '_drafts');
    const drafts = fs.readdirSync(draftsDir).filter(file => file.endsWith('.md')).map(file => {
        const filePath = path.join(draftsDir, file);
        const stats = fs.statSync(filePath);
        return {
            title: file.replace(/\.md$/, ''),
            date: stats.mtime,
            source: path.relative(hexo.source_dir, filePath).replaceAll(/\\/g, '/')
        };
    });
    res.done(drafts);
}

module.exports = getDrafts;