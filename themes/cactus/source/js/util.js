/**
 * @typedef {Object} AjaxUtilError
 * @property {number} status - HTTP status code
 * @property {string} error - Error message
 * @property {string} message - Error message
 */
class AjaxUtil{
    /**
     * 
     * @param {string} url 
     * @throws {AjaxUtilError}
     */
    static async get(url) {
        const promise = new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: url,
                success: function (response) {
                    resolve(response);
                },
                error: function (xhr, status, error) {
                    reject({
                        status: xhr.status,
                        error: error,
                        message: xhr.responseJSON?.message || "Unknown error"
                    });
                }
            });
        });
        return promise;
    }

    /**
     * 
     * @param {string} url 
     * @param {Object} data 
     * @throws {AjaxUtilError}
     */
    static async post(url, data = {}) {
        const promise = new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    resolve(response);
                },
                error: function (xhr, status, error) {
                    reject({
                        status: xhr.status,
                        error: error,
                        message: xhr.responseJSON?.message || "Unknown error"
                    });
                }
            });
        });
        return promise;
    }

    /**
     * 
     * @param {string} url 
     * @param {Object} data 
     * @throws {AjaxUtilError}
     */
    static async put(url, data = {}) {
        const promise = new Promise((resolve, reject) => {
            $.ajax({
                type: "PUT",
                url: url,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (response) {
                    resolve(response);
                },
                error: function (xhr, status, error) {
                    reject({
                        status: xhr.status,
                        error: error,
                        message: xhr.responseJSON?.message || "Unknown error"
                    });
                }
            });
        });
        return promise;
    }

    /**
     * 
     * @param {string} url 
     * @throws {AjaxUtilError}
     */
    static async delete(url) {
        const promise = new Promise((resolve, reject) => {
            $.ajax({
                type: "DELETE",
                url: url,
                success: function (response) {
                    resolve(response);
                },
                error: function (xhr, status, error) {
                    reject({
                        status: xhr.status,
                        error: error,
                        message: xhr.responseJSON?.message || "Unknown error"
                    });
                }
            });
        });
        return promise;
    }
}

/**
 * A reactive variable that notifies listeners of changes.
 * @template T
 */
class ReactiveVar {
    /**
     * @param {T} initialValue
     */
    constructor(initialValue) {
        this._value = initialValue;
        this._listeners = [];
    }

    /**
     * @returns {T}
     */
    get value() {
        return this._value;
    }

    /**
     * @param {T} newValue
     */
    set value(newValue) {
        this._value = newValue;
        this.notify();
    }

    /**
     * @param {function(T): void} listener
     */
    addListener(listener) {
        this._listeners.push(listener);
        listener(this._value);
    }

    /**
     * @param {function(T): void} listener
     */
    removeListener(listener) {
        this._listeners = this._listeners.filter(l => l !== listener);
    }

    notify() {
        this._listeners.forEach(listener => listener(this._value));
    }
}


class CookieUtil {
    /**
     * Set a cookie
     * @param {string} name
     * @param {string} value
     * @param {number} days
     */
    static setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    /**
     * Get a cookie
     * @param {string} name
     * @returns {string|null}
     */
    static getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    /**
     * Remove a cookie
     * @param {string} name
     */
    static removeCookie(name) {
        this.setCookie(name, "", -1);
    }
}

/**
 * Show a toast message
 * @returns {void}
 */
function showMessage({
    message,
    duration = 3000,
    type = "info", // info, success, warning, error
    position = "top-right" // top-left, top-right, bottom-left, bottom-right, top-center, bottom-center
}) {
    let _gravity = "";
    let _position = "";
    switch (position) {
        case "top-left":
            _gravity = "top";
            _position = "left";
            break;
        case "top-right":
            _gravity = "top";
            _position = "right";
            break;
        case "bottom-left":
            _gravity = "bottom";
            _position = "left";
            break;
        case "bottom-right":
            _gravity = "bottom";
            _position = "right";
            break;
        case "top-center":
            _gravity = "top";
            _position = "center";
            break;
        case "bottom-center":
            _gravity = "bottom";
            _position = "center";
            break;
        default:
            _gravity = "top";
            _position = "right";
            break;
    }

    switch (type) {
        case "success":
            message = '✔️ ' + message;
            break;
        case "warning":
            message = '⚠️ ' + message;
            break;
        case "error":
            message = '❌ ' + message;
            break;
        default:
            break;
    }

    Toastify({
        text: message,
        duration: duration,
        className: type,
        gravity: _gravity,
        position: _position
    }).showToast();
}