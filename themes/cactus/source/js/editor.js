$(document).ready(function() {
    const searchPath = decodeURIComponent(window.location.pathname.replace(/^\/editor\//, ''));
    const postPath = new ReactiveVar(searchPath);

    const isPublished = decodeURIComponent(postPath.value).startsWith('_posts/');

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
        const res = await AjaxUtil.get(`/api/posts/${encodeURIComponent(postPath.value)}`);
        headerEasyMDE.value(res.header);
        contentEasyMDE.value(res.content);
    }

    async function onSaveButtonClick(){
        try{
            saveButton.addClass('loading');
            const res = await AjaxUtil.put(`/api/posts/${encodeURIComponent(postPath.value)}`, {
                header: headerEasyMDE.value(),
                content: contentEasyMDE.value(),
            })
            postPath.value = res.path;
            showMessage({ 
                message: "Post saved successfully", 
                type: "success",
                position: "bottom-center",
            });
        }catch(e){
            console.error(e);
            showMessage({ 
                message: "Failed to save post", 
                type: "error",
                position: "bottom-center",
            });
        }finally{
            saveButton.removeClass('loading');
        }
    }

    async function onPublishButtonClick(){
        try{
            publishButton.addClass('loading');
            const match = postPath.value.match(/_drafts\/(?<slug>.+)\.md/)
            const slug = match?.groups?.slug;
            if(!slug){
                alert("Only drafts can be published");
                return;
            }
            await AjaxUtil.post(`/api/posts/publish`, {
                slug: slug,
            });
            window.location.href = '/archives/';
        }catch(e){
            console.error(e);
            showMessage({ 
                message: "Failed to publish post", 
                type: "error",
                position: "bottom-center",
            });
        }finally{
            publishButton.removeClass('loading');
        }
    }

    async function onUnpublishButtonClick(){
        try{
            unpublishButton.addClass('loading');
            await AjaxUtil.post(`/api/posts/unpublish`, {
                source: postPath.value,
            });
            window.location.href = '/archives/';
        }catch(e){
            console.error(e);
            showMessage({ 
                message: "Failed to unpublish post", 
                type: "error",
                position: "bottom-center",
            });
        }finally{
            unpublishButton.removeClass('loading');
        }
    }

    async function onDeleteButtonClick(){
        try{
            if(!confirm("Are you sure you want to delete this post? This action cannot be undone.")){
                return;
            }
            deleteButton.addClass('loading');
            await AjaxUtil.delete(`/api/posts/${encodeURIComponent(postPath.value)}`);
            window.location.href = '/archives/';
        }catch(e){
            console.error(e);
            showMessage({
                message: "Failed to delete post",
                type: "error",
                position: "bottom-center",
            });
        }finally{
            deleteButton.removeClass('loading');
        }
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

    postPath.addListener((newPath) => {
        history.replaceState(null, '', `/editor/${encodeURIComponent(newPath)}`);
    })
    setupButtonState();
    fetchPost();
    contentEasyMDE.togglePreview();
});