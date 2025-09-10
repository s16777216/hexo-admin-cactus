
const path = require('path');
const { CookieUtils, JwtUtils } = require('./utils/index.cjs')

class BackendServer {
    /**
     * @param {import('connect').Server} app 
     * @param {import('hexo')} hexo 
     * @param {string} baseUrl 
     */
    constructor(app, hexo, baseUrl) {
        this.app = app;
        this.hexo = hexo;
        this.baseUrl = baseUrl;
    }

    start() {
        this.hexo.log.info("Backend Server started");
    }
    /**
     * @callback Handler
     * @param {import('http').IncomingMessage} req 
     * @param {import('http').ServerResponse} res 
     * @param {import('hexo')} hexo
     */

    /**
     * 設定 API 路由
     * @param {string} method 
     * @param {string} url 
     * @param {Handler} handler 
     */
    use(method, url, handler) {
        method = method.toUpperCase();
        const fullUrl = path.join(this.baseUrl, url).replaceAll(/\\/g, '/');
        this.hexo.log.warn(`Setup API route: ${method.padStart(7)} | ${fullUrl}`);

        this.app.use(fullUrl, async (req, res, next) => {
            if (req.method !== method) {
                return next();
            }

            const promise = new Promise((resolve, reject) => {
                req.body = '';
                req.on('data', function (chunk) {
                    req.body += chunk;
                });
                req.on('end', function () {
                    try {
                        if (!req.body) return;
                        req.body = JSON.parse(req.body);
                    } catch (error) {
                        this.hexo.log.error("Failed to parse request body:", error);
                    }finally{
                        resolve();
                    }
                });
            });

            await promise;

            const done = function (val) {
                if (!val) {
                    res.statusCode = 204
                    return res.end('');
                }
                res.setHeader('Content-type', 'application/json')
                res.end(JSON.stringify(val))
            }
            res.done = done
            res.send = function (num, data) {
                res.statusCode = num
                res.end(data)
            }

            try {
                await handler(req, res, this.hexo);
            }catch (error) {
                this.hexo.log.error(`Error in handler for ${method} ${fullUrl}:`, error.stack);
                res.send(500, "Internal Server Error");
            }
        });
    }

    /**
     * @param {string} url 
     * @param {Handler} handler 
     */
    get(url, handler) {
        this.use('GET', url, handler);
    }

    /**
     * @param {string} url 
     * @param {Handler} handler 
     */
    post(url, handler) {
        this.use('POST', url, handler);
    }

    /**
     * @param {string} url 
     * @param {Handler} handler 
     */
    put(url, handler) {
        this.use('PUT', url, handler);
    }

    /**
     * @param {string} url 
     * @param {Handler} handler 
     */
    delete(url, handler) {
        this.use('DELETE', url, handler);
    }
}

/**
 * 
 * @param {import('http').ClientRequest} req 
 * @param {import('http').ServerResponse} res 
 */
function loginAPI(req, res) {
    try {
        const username = req.body.username;
        const password = req.body.password;

        // 1. Validate user credentials
        const isValidUser = (username === "admin" && password === "admin");
        if (!isValidUser) {
            res.send(401, "Unauthorized");
            return;
        }

        // 2. Generate JWT token
        const token = JwtUtils.generateJWT({ username }, 3600);

        // 3. put token to cookie, timeout 1 hour, make cookie removable
        res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Max-Age=3600; Path=/`);

        // 4. Send response
        res.done();
    } catch (error) {
        hexo.log.error("Login API error:", error);
        res.send(500, "Internal Server Error");
    }
}

function logoutAPI(req, res) {
    try {
        // 1. set cookie to expire immediately
        res.setHeader("Set-Cookie", `token=; HttpOnly; Max-Age=0; Path=/`);
        res.done();
    } catch (error) {
        hexo.log.error("Logout API error:", error);
        res.send(500, "Internal Server Error");
    }
}

async function isLogin(req, res, next) {
    const cookies = CookieUtils.parseCookie(req.headers.cookie);
    const token = cookies.token;
    if (!token) {
        return res.send(401, "Unauthorized");
    }

    try{
        await JwtUtils.verifyJWT(token);
        return res.done();
    }catch(err){
        hexo.log.warn("Token verification failed:", err.message);
        return res.send(401, "Unauthorized");
    }
}
/**
 * 
 * @param {import('connect').Server} app 
 * @param {import('hexo')} hexo 
 */
function backendApi(app, hexo) {
    const backend = new BackendServer(app, hexo, "/api");

    backend.post("/login", loginAPI);
    backend.get("/logout", logoutAPI);
    backend.get("/isLogin", isLogin);
    backend.get("/posts", require('./api/getPost.cjs'));
    backend.put("/posts", require('./api/updatePost.cjs'));

    backend.start();
}

module.exports = {
    backendApi
};