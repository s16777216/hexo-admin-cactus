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

module.exports = {
    parseCookie
};