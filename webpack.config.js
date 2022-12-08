// in order to construct an absolute path for the output file we need to use one of core NodeJS modules - 'path'
const path = require('path');

// Webpack uses NodeJS features.
// So to export configuration we need to initialize 'exports' prop with our config object:
module.exports = {
    // in 'development' mode Webpack does less optimisations
    mode: "development",
    // specify entry point (should be a RELATIVE path of a single file from which everything starts in our app)
    entry: './src/app.ts',
    // specify output file (should be an ABSOLUTE(why?) path and should match what we have in the
    // tsconfig.json in "outDir": "./dist" setting)
    output: {
        filename: 'bundle.js',
        // to build an absolute path to the directory where output file leaves we need to:
        // 1) pass a special global variable '__dirname' which tells us the absolute path to the currently executing file (webpack.config.js)
        // 2) pass a string value representing output directory name
        path: path.resolve(__dirname, 'dist'),
        // specify assets folder for Webpack devServer
        publicPath: "/dist"
    },
    // this tells Webpack to inline generated sourcemaps into resulting bundle file
    devtool: 'inline-source-map',
    // this sets options for Webpack devServer
    devServer: {
        // we need to tell Webpack from where it should serve static files (e.g. index.html)
        static: {
            directory: path.join(__dirname, '/')
        }
    },
    // by default Webpack is a bundler in the first place, it doesn't know what to do with TS files,
    // so to give it some directions we need to use 'module' key and assign a config object to it:
    module: {
        // this config object should have 'rules' array (array is used to be able to have several rules)
        rules: [
            // each rule is a JS object with specific keys:
            {
                // 1) TEST
                // the value of 'test' key is used by Webpack to perform a test on a file
                // to see if the file matches the condition (value)
                test: /\.ts$/,
                // 2) USE
                // the value of 'use' key tells Webpack which LOADER to use if the file passes the test,
                // by the way 'ts-loader (in our case) will use tsconfig.json so no need to additional setup
                use: 'ts-loader',
                // 3) EXCLUDE
                // here we exclude what should not be processed by Webpack
                exclude: /node_modules/
            }
        ],
    },
    resolve: {
        // this will tell Webpack what file extensions to look for
        // p.s. if we have 2 files with the same name but with different extensions then in the case of current setup,
        // the '.ts' version of the file will be bundled
        extensions: ['.ts', '.js']
    }
}