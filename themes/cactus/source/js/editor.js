$(document).ready(function() {
    const editor = document.getElementById('editor');
    const easyMDE = new EasyMDE({ 
        element: editor,
        mode: "markdown",
        sideBySideFullscreen: false,
    });
});