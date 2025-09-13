$(document).ready(function() {
    const postPath = window.location.pathname.replace(/^\/editor\//, '');

    const isPublished = decodeURIComponent(postPath).startsWith('_posts/');

    const editor = document.querySelector('#content-editor > textarea');
    const contentEasyMDE = new EasyMDE({ 
        element: editor,
        mode: "markdown",
        sideBySideFullscreen: false,
        lineNumbers: true,
    });

    const headerEditor = document.querySelector('#header-editor > textarea');
    const headerEasyMDE = new EasyMDE({ 
        element: headerEditor,
        toolbar: false,
        status: false,
        minHeight: "100px",
    });

    const saveButton = $('#save-button');
    const publishButton = $('#publish-button');
    const unpublishButton = $('#unpublish-button');
    const deleteButton = $('#delete-button');

    async function fetchPost(){
        const res = await AjaxUtil.get(`/api/posts/${postPath}`)
        headerEasyMDE.value(res.header);
        contentEasyMDE.value(res.content);
    }

    async function onSaveButtonClick(){
        await AjaxUtil.put(`/api/posts/${postPath}`, {
            header: headerEasyMDE.value(),
            content: contentEasyMDE.value(),
        })
    }

    async function onPublishButtonClick(){
        const match = decodeURIComponent(postPath).match(/_drafts\/(?<slug>.+)\.md/)
        const slug = match?.groups?.slug;
        if(!slug){
            alert("Only drafts can be published");
            return;
        }
        await AjaxUtil.post(`/api/posts/publish`, {
            slug: slug,
        });
        window.location.href = '/archives/';
    }

    async function onUnpublishButtonClick(){
        await AjaxUtil.post(`/api/posts/unpublish`, {
            source: decodeURIComponent(postPath),
        });
        window.location.href = '/archives/';
    }

    async function onDeleteButtonClick(){
        if(!confirm("Are you sure you want to delete this post? This action cannot be undone.")){
            return;
        }
        await AjaxUtil.delete(`/api/posts/${postPath}`);
        window.location.href = '/archives/';
    }

    saveButton.click(onSaveButtonClick);
    publishButton.click(onPublishButtonClick);
    unpublishButton.click(onUnpublishButtonClick);
    deleteButton.click(onDeleteButtonClick);

    function setupButtonState(){
        if(isPublished){
            publishButton.hide();
            unpublishButton.show();
            deleteButton.hide();
        }else {
            publishButton.show();
            unpublishButton.hide();
            deleteButton.show();
        }
    }

    setupButtonState();
    fetchPost();
    contentEasyMDE.togglePreview();
});