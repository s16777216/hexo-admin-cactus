$(document).ready(function() {
    const postPath = window.location.pathname.replace(/^\/editor\//, '');

    const editor = document.getElementById('editor');
    const easyMDE = new EasyMDE({ 
        element: editor,
        mode: "markdown",
        sideBySideFullscreen: false,
    });

    const saveButton = $('#save-button');

    async function onSaveButtonClick(){
        const content = easyMDE.value();
        await AjaxUtil.put(`/api/posts/${postPath}`, content)
    }

    async function fetchPostContent(){
        const content = await AjaxUtil.get(`/api/posts/${postPath}`)
        easyMDE.value(content);
    }

    saveButton.on('click', onSaveButtonClick);
    fetchPostContent();

    const headerEditor = document.querySelector('#header-editor > textarea');
    const headerEasyMDE = new EasyMDE({ 
        element: headerEditor,
        toolbar: false,
        status: false,
        minHeight: "100px",
    });
});