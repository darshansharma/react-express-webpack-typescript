"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var webpack = require('webpack');
var webpack_config_1 = __importDefault(require("./webpack.config"));
var webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
function createWebpackMiddleware(compiler, publicPath) {
    return webpack_dev_middleware_1.default(compiler, {
        publicPath: publicPath,
        stats: 'none',
    });
}
var middleware = function (app, _a) {
    var compiler = webpack(webpack_config_1.default);
    var middleware1 = createWebpackMiddleware(compiler, webpack_config_1.default.output.publicPath);
    app.use(middleware1);
    var fs = middleware1.fileSystem;
    app.get('*', function (req, res) {
        fs.readFile(path_1.default.join(compiler.outputPath, 'index.html'), function (err, file) {
            if (err) {
                res.sendStatus(404);
            }
            else {
                res.send(file.toString());
            }
        });
    });
};
exports.default = middleware;
