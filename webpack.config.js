const path = require('path');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const buildPath = './build/';

module.exports = {
    entry: ['./src/app.js'],
    output: {
        path: path.join(__dirname, buildPath),
        filename: '[name].[hash].js',
        publicPath: `/${pkg.repository}/`,
    },
    target: 'web',
    devtool: 'source-map',
    stats: {
        warnings: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: path.resolve(__dirname, './node_modules/'),
            },
            {
                test: /\.(jpe?g|png|gif|svg|tga|gltf|babylon|mtl|pcb|pcd|prwm|obj|mat|mp3|bin|ogg)$/i,
                exclude: path.resolve(__dirname, './node_modules/'),
                type: 'asset/resource',
                generator: {
                  filename: 'assets/[path][name][ext][query]'
                }
            },
            {
                test: /\.(vert|frag|glsl|shader|txt)$/i,
                use: 'raw-loader',
                exclude: path.resolve(__dirname, './node_modules/'),
            },
            {
                type: 'javascript/auto',
                test: /\.(json)/,
                exclude: path.resolve(__dirname, './node_modules/'),
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.fbx/,
                use: 'file-loader',
                exclude: path.resolve(__dirname, './node_modules/'),
            },            
        ],
    },
    resolve: {
        alias: {
            lights$: path.resolve(__dirname, 'src/components/lights'),
            objects$: path.resolve(__dirname, 'src/components/objects'),
            scenes$: path.resolve(__dirname, 'src/components/scenes'),
            managers$: path.resolve(__dirname, 'src/components/managers'),
            resources$: path.resolve(__dirname, 'src/resources'),
            textures$: path.resolve(
                __dirname,
                'src/components/objects/Cactus/cactus_files/textures',
                'src/components/objects/Pebble/pebble_files1/textures',
                'src/components/objects/Bird/low_poly_bird/textures'
            ),            
        },
    },
    plugins: [
        new HtmlWebpackPlugin({ title: pkg.title, favicon: 'src/favicon.ico' }),
    ],
};