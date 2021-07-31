const mix = require('laravel-mix');
const path = require('path');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/admin/js/app.js', 'public/dist/admin/js')
    .react()
    .sass('resources/admin/sass/app.scss', 'public/dist/admin/css')
    .webpackConfig({
        output: { chunkFilename: 'dist/admin/js/[name].js?id=[chunkhash]' },
        resolve: {
            alias: {
                '@': path.resolve('resources/admin/js'),
            },
        },
    })
    .version();

// autoprefixer: start value has mixed support, consider using flex-start instead
mix.webpackConfig({
    stats: {
        children: true,
    }
});

// mix.browserSync('app.easyshops.localhost');
