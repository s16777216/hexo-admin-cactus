/**
 * 發布文章
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res
 * @param {import('hexo')} hexo
 */
async function publishPost(req, res, hexo) {
    const slug = req.body.slug;
    if (!slug) {
        res.send(400, { error: "Missing slug" });
        return;
    }
    await hexo.post.publish({
        slug: slug
    }, false);
    hexo.log.info(`Published post: ${slug}`);
    res.done();
}

module.exports = publishPost;