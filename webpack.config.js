const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ['babel-polyfill', path.resolve(__dirname, 'src/index.js')],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'Api',
        libraryTarget: 'umd',
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'lodash',
            axios: 'axios',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    mode: 'development',
};
