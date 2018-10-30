import path from 'path';
const webpack = require('webpack');
import webpackConfig from './webpack.config';
import webpackDevMiddleware from 'webpack-dev-middleware';

function createWebpackMiddleware(compiler, publicPath) {
	return webpackDevMiddleware(compiler, {
		publicPath,
		stats: 'none',
	})
}

const middleware=(app, {})=>{
	const compiler = webpack(webpackConfig);
	const middleware1 = createWebpackMiddleware(compiler, webpackConfig.output.publicPath);
	app.use(middleware1);

	const fs = middleware1.fileSystem;

	app.get('*', (req, res) => {
		fs.readFile(path.join(compiler.outputPath, 'index.html'), (err, file) => {
			if (err) {
				res.sendStatus(404);
			} else {
				res.send(file.toString());
			}
		});
	});
};

export default middleware;
