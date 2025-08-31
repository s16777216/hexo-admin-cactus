$(document).ready(function() {
    console.log("Login-form script is ready");

    const loginForm = $('#login-form');

    loginForm.on('submit', async function(e) {
        e.preventDefault();
        console.log("Login form submitted");

        const data = $(this).serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        try {
            await ajaxLogin(data.username, data.password);
            console.log("Login successful");
            window.location.href = "/";
        } catch (error) {
            console.error("Login failed:", error);
        }
    });

    /**
     * Handles user login via AJAX.
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<void>} login token
     */
    async function ajaxLogin(username, password){
        await AjaxUtil.post("/api/login", { username, password });
        return;
    }
})
