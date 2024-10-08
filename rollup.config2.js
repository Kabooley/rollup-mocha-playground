import html from '@rollup/plugin-html';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import OMT from '@surma/rollup-plugin-off-main-thread';


export default {
    // file path from stdin
    input: '-',
    cache: false,
    output: [
        {
            dir: 'output',
            format: 'amd',
        },
    ],

    plugins: [
        typescript({
            tsconfig: './browser/tsconfig.mocha-browser.json',
        }),
        commonjs(),
        resolve(),
        OMT(),
        html(),
    ],
};
