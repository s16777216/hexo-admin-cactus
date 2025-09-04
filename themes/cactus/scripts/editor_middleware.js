/**
 * 
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res 
 * @param {(err?: any) => void} next 
 */
function testingFunc(req, res, next) {
    // 將所有 /editor/ 開頭的請求重新導向到 /editor/
    req.url = '/'
    next();
}

hexo.extend.filter.register("server_middleware", function (app) {
    hexo.log.info("[Cactus] Registering editor middleware");
    app.use("/editor/", testingFunc);
}, 1);