// import html from '@rollup/plugin-html';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import OMT from '@surma/rollup-plugin-off-main-thread';

const generateHtmlPlugin = () => {
    let ref1;
    return {
        // ここに定義されるようなメソッドの呼び出しは順番があるらしい
        // https://rollupjs.org/plugin-development/#build-hooks
        buildStart(options) {
            if (options.input !== undefined) {
                console.log(`This is custom plugin options: ${options.input}`);
                ref1 = this.emitFile({
                    type: 'chunk',
                    id: options.input[0],
                });
            }
        },
        generateBundle(options, bundle) {
            // Mapping js files to script tags
            let scriptTags = [];
            for (const filename in bundle) {
                const file = bundle[filename];
                if (
                    (file.isAsset || file.fileName.endsWith('.js')) &&
                    !file.fileName.includes('.worker')
                ) {
                    scriptTags.push(
                        `<script src="${file.fileName}" type="module"></script>`
                    );
                }
            }

            this.emitFile({
                type: 'asset',
                fileName: 'index.html',
                source: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <link href="../node_modules/mocha/mocha.css" rel="stylesheet" />
              <title>Title</title>
             </head>
            <body>
              <div id="mocha"></div>
              ${scriptTags.join('\n')}
            </body>
            </html>`,
            });
        },
    };
};

export default {
    // file path from stdin
    input: '-',
    cache: false,
    output: [
        {
            dir: 'output',
            format: 'es',
            plugins: [
                // このプラグインは実行されているみたいだけど、出力されたworkerはamdではなくesのまま
                {
                    name: 'custom-output-format',
                    generateBundle(options, bundle) {
                        for (const filename in bundle) {
                            const file = bundle[filename];
                            if (file.fileName.includes('.worker')) {
                                console.log(
                                    'custom-output-format: change format to amd'
                                );

                                bundle[filename].format = 'amd';
                            }
                        }
                    },
                },
            ],
        },
        // 複数のchunkをビルドするとき、output.dirを指定しなくてはならない。output.fileを指定してはならない
        // {
        //     dir: 'output',
        //     file: 'output/*.worker-*.js',
        //     format: 'amd',
        // },
    ],

    plugins: [
        typescript({
            tsconfig: './browser/tsconfig.mocha-browser.json',
        }),
        commonjs(),
        resolve(),
        OMT(),
        // html()
        generateHtmlPlugin(),
    ],
};
