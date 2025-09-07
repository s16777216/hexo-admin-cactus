/**
 * 
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res 
 * @param {(err?: any) => void} next 
 */
function editorMiddlewareHandler(req, res, next) {
    // 將所有 /editor/ 開頭的請求重新導向到 /editor/
    req.url = '/'
    next();
}

/**
 * 設定編輯器中介軟體
 * @param {import('connect').Server} app 
 * @param {import('hexo')} hexo 
 */
function editorMiddleware(app, hexo) {
    hexo.log.info("[Cactus] Registering editor middleware");
    app.use("/editor/", editorMiddlewareHandler);
}

module.exports = {
    editorMiddleware
}