import path from 'path'
import jsonPlugin from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve'
import typescriptPlugin from "rollup-plugin-typescript2"

const packageDir = path.resolve(__dirname, process.env.TARGET)

console.log(1333, packageDir)

const resolve = (p) => path.resolve(packageDir, p)

const pkg = require(resolve('package.json'))

const name = path.basename(packageDir)

const outputConfig = {
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    'cjs': {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    'global': {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife'
    }
}

const options = pkg.buildOptions

console.log(789, options, pkg)

function creatCOnfig(format, output) {
    output.name = options.name
    output.sourcemap = true

    return {
        input: resolve('src/index.ts'),
        output,
        plugins: [
            jsonPlugin(),
            typescriptPlugin({
                tsconfig: path.resolve(__dirname, 'tsconfig.json')
            }),
            resolvePlugin()
        ]
    }
}

export default options.formats.map(format => creatCOnfig(format, outputConfig[format]))