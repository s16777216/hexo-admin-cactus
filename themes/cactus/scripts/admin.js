const { protectMiddleware } = require('./admin/protect_middleware.cjs');
const { editorMiddleware } = require('./admin/editor_middleware.cjs');
const { backendApi } = require('./admin/backend_api.cjs');

hexo.extend.filter.register("server_middleware", function (app) {
    protectMiddleware(app, hexo);
}, 0);

hexo.extend.filter.register("server_middleware", function (app) {
    editorMiddleware(app, hexo);
}, 1);

hexo.extend.filter.register("server_middleware", function (app) {
    backendApi(app, hexo);
})