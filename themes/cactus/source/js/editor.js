$(document).ready(function() {
    const postPath = window.location.pathname.replace(/^\/editor\//, '');

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



    async function fetchPost(){
        const res = await AjaxUtil.get(`/api/posts/${postPath}`)
        headerEasyMDE.value(res.header);
        contentEasyMDE.value(res.content);
    }

    async function onSaveButtonClick(){
        const content = contentEasyMDE.value();
        await AjaxUtil.put(`/api/posts/${postPath}`, {
            header: headerEasyMDE.value(),
            content: contentEasyMDE.value(),
        })
    }

    saveButton.on('click', onSaveButtonClick);

    fetchPost();
    contentEasyMDE.togglePreview();
});