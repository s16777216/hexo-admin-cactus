const { parseCookie } = require('./cookieUtil.cjs');
const { verifyJWT } = require('./jwtUtil.cjs');

/**
 * 設定保護中介軟體
 * @param {import('connect').Server} app 
 * @param {import('hexo')} hexo
 */
function setupProtectMiddleware(app, hexo) {
    hexo.log.info("[Cactus] Registering protect middleware");
    app.use((req, res, next) => protectMiddleware(req, res, next, hexo));
}

/**
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res 
 * @param {(err?: any) => void} next 
 * @param {import('hexo')} hexo
 */
async function protectMiddleware(req, res, next, hexo) {
    // 定義所有需要保護的路徑
    const protectedPaths = [
        '/editor/', // 請注意這裡的斜線，確保匹配你重寫後的路徑
        '/private/'
    ];

    // 1. 處理JWT驗證邏輯
    const isProtected = protectedPaths.some(path => req.url.startsWith(path));

    if (!isProtected) return next();

    const cookies = parseCookie(req.headers.cookie || '');
    const token = cookies.token;
    try {
        await verifyJWT(token);
        next();
    } catch (err) {
        req.url = '/404';
        return next();
    }
}

module.exports = {
    setupProtectMiddleware
};