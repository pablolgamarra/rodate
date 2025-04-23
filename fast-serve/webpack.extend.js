const path = require('path');
const webpackConfig = {
	resolve: {
		alias: {
			'@common': path.resolve(__dirname, '..', 'src/common/'),
			'@services': path.resolve(__dirname, '..', 'src/services/'),
			'@models': path.resolve(__dirname, '..', 'src/models/'),
			'@context': path.resolve(__dirname, '..', 'src/context/'),
			'@hooks': path.resolve(__dirname, '..', 'src/hooks/'),
			'@controls': path.resolve(__dirname, '..', 'src/controls/'),
		},
	},
};

/**
 * For even more fine-grained control, you can apply custom webpack settings using below function
 * @param {object} initialWebpackConfig - initial webpack config object
 * @param {object} webpack - webpack object, used by SPFx pipeline
 * @returns webpack config object
 */
const transformConfig = function (initialWebpackConfig, webpack) {
	// transform the initial webpack config here, i.e.
	// initialWebpackConfig.plugins.push(new webpack.Plugin()); etc.

	return initialWebpackConfig;
};

module.exports = {
	webpackConfig,
	transformConfig,
};
