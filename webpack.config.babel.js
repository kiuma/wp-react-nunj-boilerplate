import CleanWebpackPlugin from "clean-webpack-plugin";
import NpmInstallPlugin from "npm-install-webpack-plugin";
import webpack from "webpack";
import path from "path";
import merge from "webpack-merge";

const src = path.join(__dirname, 'src'),
    TARGET = process.env.npm_lifecycle_event,
    PATHS = {
        app: path.join(src, 'app'),
        templates: path.join(src, 'app', 'templates'),
        styles: path.join(src, 'app', 'styles'),
        build: path.join(__dirname, 'build')
    };

process.env.BABEL_ENV = TARGET;

const commonConfig = {
    cache: true,
    context: src,
    output: {
        path: PATHS.build,
        filename: 'build.js',
        publicPath: '/'
    },
    module: {
        loaders: [

            {
                test: /\.nunj$/,
                loader: 'file',
                query: {
                    regExp: "templates\\/(.*)\\.nunj",
                    name: '[1].html'
                },
                include: PATHS.templates

            },
            {
                test: /\.nunj$/,
                loader: 'nunjucks-html',
                query: {
                    searchPaths: [
                        PATHS.templates
                    ]
                },
                include: PATHS.templates
            },
            {
                test: /\.s?css$/,
                loaders: ['style', 'css', 'sass']
            },
            // Set up jsx. This accepts js too thanks to RegExp
            {
                test: /\.jsx?$/,
                // Enable caching for improved performance during development
                // It uses default OS directory by default. If you need something
                // more custom, pass a path to it. I.e., babel?cacheDirectory=<path>
                loader: 'babel?cacheDirectory',
                include: PATHS.app

            }

        ]
    }
};

let config;

switch (TARGET) {
    case 'clean':
        config = merge(commonConfig, {
            plugins: [
                new CleanWebpackPlugin(['dist', 'build'], {
                    root: __dirname,
                    verbose: true,
                    dry: false
                })
            ]
        });
        break;
    case 'start':
        config = merge(commonConfig, {
            resolve: {
                extensions: ['', '.js', '.jsx']
            },
            entry: {
                app: PATHS.app
            },
            devServer: {
                contentBase: PATHS.build,
// Enable history API fallback so HTML5 History API based
// routing works. This is a good default that will come
// in handy in more complicated setups.
                historyApiFallback: true,
                hot: true,
                inline: true,
                progress: true,
// Display only errors to reduce the amount of output.
                stats: 'errors-only',
// Parse host and port from env so this is easy to customize.
//
// If you use Vagrant or Cloud9, set
// host: process.env.HOST || '0.0.0.0';
//
// 0.0.0.0 is available to all network devices unlike default
// localhost
                host: process.env.HOST,
                port: process.env.PORT
            },
            plugins: [
                new webpack.HotModuleReplacementPlugin(),
                new NpmInstallPlugin({
                    save: true // --save
                })
            ]
        });
        break;
    default:

        config = merge(commonConfig, {
            resolve: {
                extensions: ['', '.js', '.jsx']
            },
            entry: {
                app: PATHS.app
            }
        });
        break;
}

export default config;

