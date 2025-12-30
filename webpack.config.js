const path = require('path');

module.exports = {
    entry: './src/main.tsx',
    module: {
        rules: [
            {
                test: /\.ts|\.tsx$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            react: 'preact/compat',
            'react-dom': 'preact/compat',
        },
    },
    output: {
        filename: 'dist.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: [
            {
                directory: path.join(__dirname, 'public'),
                publicPath: '/',
                watch: true,
            },
            {
                directory: path.join(__dirname, 'dist'),
                publicPath: '/dist',
                watch: true,
            },
        ],
        compress: true,
        port: 8080,
        open: true,
        hot: false,
    },
};
