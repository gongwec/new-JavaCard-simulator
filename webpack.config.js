const path = require('path');

module.exports = {
    entry: './public/javascripts/api.js',
    output: {
        filename: 'main.js',
        library: 'webpackmain',
        libraryTarget: 'window',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',

    //The below code tries to convert the bundle to support es2015, in order
    //to enable the simulator can be run on the IE browser, but failed.

    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             use:[
    //                 {
    //                     loader: "babel-loader",
    //
    //                 }
    //             ]
    //         }
    //     ]
    // }

    // node: {
    //     fs: 'empty'
    // }
};