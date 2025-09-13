$(document).ready(async function() {
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
            $("html").attr("is-login", true);
        } else {
            $("html").removeAttr("is-login");
        }
    });

    logoutButton.click(async function() {
        // 1. clear token value in cookie
        await AjaxUtil.get("/api/logout");
        // 2. back to home
        window.location.href = "/";
    });

    const draftList = $("#draft-list");
    const newPostButton = $("#new-post-button");
    async function fetchDrafts() {
        // not login
        if (!isLogin.value) return;
        // draftList not exist
        if (draftList.length === 0) return; 
        const drafts = await AjaxUtil.get("/api/drafts");
        if (drafts.length === 0) {
            draftList.append('<li class="list-item">No drafts</li>');
            return;
        }
        drafts.forEach((draft) => {
            const date = new Date(draft.date).toLocaleString();
            const title = draft.title;
            const source = encodeURIComponent(draft.source);
            const listItem = $(`
                <li class="list-item">
                    <time class="meta">${date}</time>
                    <span>
                        <a href="/editor/${source}" title="Edit this draft">${title}</a>
                    </span>
                </li>
            `);
            draftList.append(listItem);
        });
    }

    async function createNewPost() {
        const res = await AjaxUtil.post("/api/posts/new");
        window.location.href = `/editor/${res}`;
    }
    newPostButton.click(createNewPost);

    isLogin.value = await checkIsLogin();
    await fetchDrafts();
})
