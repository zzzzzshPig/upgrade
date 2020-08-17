import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
    input: 'app.ts',
    output: {
        dir: 'dist',
        name: 'app.js',
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript(),
        serve({
            open: false,
            port: 8000,
            contentBase: ''
        }),
        livereload()
    ]
}
