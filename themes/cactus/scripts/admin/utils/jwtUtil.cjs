const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_super_secret_key_please_change_this_to_a_strong_key';

/**
 * 生成 JWT Token
 * @param {Object} payload 
 * @param {number} expiresIn 
 * @returns 
 */
function generateJWT(payload, expiresIn) {
    const token = jwt.sign(
            payload,
            SECRET_KEY,
            { expiresIn: expiresIn } // 設定 Token 的有效期限
        );
    return token;
}

/**
 * 驗證 JWT Token
 * @param {string} token 
 * @returns {Promise<Object>} 解析後的 payload
 * @throws {Error} 驗證失敗時拋出錯誤
 */
function verifyJWT(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return reject("Invalid token: " + err.message);
            }
            return resolve(decoded);
        });
    });
}

module.exports = {
    generateJWT,
    verifyJWT,
};
