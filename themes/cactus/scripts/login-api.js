
const path = require('path');
const jwt = require('jsonwebtoken');

class BackendServer {
    constructor(app, baseUrl) {
        this.app = app;
        this.baseUrl = baseUrl;
    }

    start() {
        hexo.log.info("Backend Server started");
    }

    /**
     * 設定 API 路由
     * @param {string} method 
     * @param {string} url 
     * @param {Function} handler 
     */
    use(method, url, handler) {
        method = method.toUpperCase();
        const fullUrl = path.join(this.baseUrl, url).replaceAll(/\\/g, '/');
        hexo.log.warn(`Setup API route: ${method.padStart(7)} | ${fullUrl}`);

        this.app.use(fullUrl, async function (req, res, next) {
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
                        hexo.log.error("Failed to parse request body:", error);
                        req.body = {};
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

            handler(req, res);
        });
    }

    get(url, handler) {
        this.use('GET', url, handler);
    }

    post(url, handler) {
        this.use('POST', url, handler);
    }

    put(url, handler) {
        this.use('PUT', url, handler);
    }

    delete(url, handler) {
        this.use('DELETE', url, handler);
    }
}

const SECRET_KEY = 'your_super_secret_key_please_change_this_to_a_strong_key';
/**
 * 生成 JWT Token
 * @param {Object} payload 
 * @param {number} expiresIn 
 * @returns 
 */
function generateJWTToken(payload, expiresIn) {
    
    const token = jwt.sign(
        payload,
        SECRET_KEY,
        { expiresIn: expiresIn } // 設定 Token 的有效期限
    );
    return token;
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
        const token = generateJWTToken({ username }, 3600);

        // 3. put token to cookie, timeout 1 hour, make cookie removable
        res.setHeader("Set-Cookie", `token=${token}; HttpOnly; Max-Age=3600`);

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
        res.setHeader("Set-Cookie", `token=; HttpOnly; Max-Age=0`);

        res.done();
    } catch (error) {
        hexo.log.error("Logout API error:", error);
        res.send(500, "Internal Server Error");
    }
}

/**
 * 解析 Cookie 字串
 * @param {string} cookieString 
 * @returns {{[key: string]: string}} cookies
 */
function parseCookie(cookieString = '') {
    const cookies = {};
    cookieString.split(';').forEach(cookie => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies[name] = value;
    });
    return cookies;
}

function isLogin(req, res, next) {
    const cookies = parseCookie(req.headers.cookie);
    const token = cookies.token;
    if (!token) {
        return res.send(401, "Unauthorized");
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.send(401, "Unauthorized");
        }
        return res.done();
    });
}

hexo.extend.filter.register("server_middleware", function (app) {
    const backend = new BackendServer(app, "/api");

    backend.post("/login", loginAPI);
    backend.get("/logout", logoutAPI);
    backend.get("/isLogin", isLogin);

    backend.start();
});