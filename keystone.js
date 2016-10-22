require('dotenv').config();

var keystone = require('keystone'),
    keystoneRestApi = require('keystone-rest-api'),
    webpack = require('webpack'),
    MemoryFS = require("memory-fs"),
    path = require('path'),
    devMiddleware = require('webpack-dev-middleware'),
    hotMiddleware = require('webpack-hot-middleware'),
    config = require('./webpack.config.js'),
    compiler = webpack(config);

var mem_fs = new MemoryFS();
compiler.outputFileSystem = mem_fs;

console.log("Environment:" + process.env.NODE_ENV);
var isDev = process.env.NODE_ENV == 'development';

keystone.init({
    'name': 'keystone-angular2-webpack-starter',
    'brand': 'keystone-angular2-webpack-starter',

    'static': 'src/public',
    'favicon': 'src/public/favicon.ico',

    'emails': 'templates/emails',

    'auto update': true,
    'session': true,
    'auth': true,
    'user model': 'User',
    'cookie secret': process.env.COOKIE_SECRET || '(my secret)'
});

// Load your project's Models
keystone.import('models');

keystone.set('routes', function (app) {
    if (isDev) {
        app.use(devMiddleware(compiler, {
            publicPath: config.output.publicPath
        }));

        app.use(hotMiddleware(compiler, {
            log: console.log
        }));
    }

    // Add routes with Keystone
    keystoneRestApi.createRest(keystone, {
        apiRoot: '/api/v1/'
    });

    app.get('*', function (req, res, next) {
        var filename = path.join(compiler.outputPath, 'index.html');
        console.log('file:' + filename);
        compiler.outputFileSystem.readFile(filename, function (err, result) {
            if (err) {
                return next(err);
            }
            res.set('content-type', 'text/html');
            res.send(result);
            res.end();
        });
    });
});

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
    _: require('lodash'),
    env: keystone.get('env'),
    utils: keystone.utils,
    editable: keystone.content.editable,
});


// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.
keystone.set('email locals', {
    logo_src: '/img/angular.png',
    logo_width: 194,
    logo_height: 76,
    theme: {
        email_bg: '#f9f9f9',
        link_color: '#2697de',
        buttons: {
            color: '#fff',
            background_color: '#2697de',
            border_color: '#1a7cb7',
        },
    },
});

// Load your project's email test routes
//keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
    users: 'users',
});

// Start Keystone to connect to your database and initialise the web server
keystone.start();
