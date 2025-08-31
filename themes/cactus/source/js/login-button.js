$(document).ready(async function() {
    console.log("Login-button script is ready");

    const loginButton = $("#login-button");
    const logoutButton = $("#logout-button");

    async function checkIsLogin() {
        try{
            await AjaxUtil.get("/api/isLogin");
            return true;
        }catch(error){
            return false;
        }
    }

    const isLogin = new ReactiveVar(false);

    isLogin.addListener((value) => {
        if (value) {
            $("html").attr("isLogin", "true");
        } else {
            $("html").attr("isLogin", "false");
        }
    });

    /**
     * @param {boolean} isLogin 
     */
    function updateLoginButtonIcon(isLogin) {
        if (isLogin) {
            loginButton.hide();
            logoutButton.show();
        } else {
            logoutButton.hide();
            loginButton.show();
        }
    }

    // isLogin.addListener(updateLoginButtonIcon);

    logoutButton.click(async function() {
        // 1. clear token value in cookie
        await AjaxUtil.get("/api/logout");
        // 2. back to home
        window.location.href = "/";
    });

    isLogin.value = await checkIsLogin();
})
