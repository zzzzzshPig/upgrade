import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        name: 'index.js',
        format: 'umd',
        sourcemap: true
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript(),
        serve({
            open: true,
            port: 8000,
            contentBase: ''
        }),
        livereload()
    ]
}
