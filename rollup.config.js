import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import cleaner from 'rollup-plugin-cleaner';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'cjs'
    },
    plugins: [
        cleaner({
            targets: [
                './dist/'
            ]
        }),
        resolve(),
        postcss({
            minimize: true,
            modules: {
                generateScopedName: "[hash:base64:5]",
            },
            extract: 'dist/styles.css'
        }),
        commonjs(),

    ],
    external: ['mithril', 'mithril/stream', 'classnames', 'classnames/bind', 'validate.js']
};