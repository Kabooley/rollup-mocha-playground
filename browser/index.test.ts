/*********************************************************************
 *
 * *******************************************************************/
import 'mocha/mocha';
import * as chai from 'chai';
import * as Comlink from 'comlink';
import type { iFetchLibsApi } from './worker/fetchLibs.worker';

mocha.setup('tdd');

/**
 * - globalスコープに影響させないため即時関数で囲う
 * - 環境がサポートするならばasync/awaitは使うことができる（idb-keybalでもasync/awaitを使っていたしdone()は呼び出していなかった）
 * -
 *
 *
 *
 * */
(async () => {
    let worker: Worker;
    let api: Comlink.Remote<iFetchLibsApi>;

    function generateWorkerAndApi() {
        try {
            /***
             * NOTE: vite環境ではwebpack環境と異なるcomlinkの生成方法となる
             * webpackの場合：
             * */
            worker = new Worker(
                new URL('./worker/fetchLibs.worker.ts', import.meta.url),
                { type: 'module' }
            );
            // Stackblitz asshole don't understand this comlink instance
            api = Comlink.wrap<iFetchLibsApi>(worker);
        } catch (e) {
            console.error('Error during generating worker or api');
        }
    }

    suite('Environment should support WebWorker', () => {
        test('Environment should support WebWorker', () => {
            chai.expect(window.Worker).to.not.be.undefined;
            chai.expect(window.Worker).to.not.be.null;
        });
    });

    /***
     * Worker(): SecurityError, NetworkError, SyntaxError
     *
     *
     * */
    suite('Worker thread should be generated correctly', () => {
        test('generated successfully', () => {
            chai.expect(generateWorkerAndApi).to.not.throw();
        });
    });

    suite('Should localstorage db and store be generated', () => {
        test('', async () => {

        })
    });

    // suite('fetchLibs() api should fetch new dependency', () => {
    //     test()
    // })

    mocha.run();
})();

// import {
//     get,
//     set,
//     del,
//     promisifyRequest,
//     clear,
//     createStore,
//     keys,
//     values,
//     entries,
//     setMany,
//     update,
//     getMany,
//     delMany
//   } from 'idb-keyval';

//   const db = 'test-idb-keyval--db';
//   const _store = 'test-idb-keyval--store';
//   mocha.setup('tdd');

//   (async () => {
//     await promisifyRequest(indexedDB.deleteDatabase(db));
//     const store = createStore(db, _store);

//     suite('basics', () => {
//         test('get & set', async () => {
//             await set('foo', 'bar', store);
//             chai.assert.strictEqual(await get('foo', store), 'bar', `Value can be get'd`);
//             chai.assert.strictEqual(
//                 await get('food', store),
//                 undefined,
//                 `Non-existent values are undefined`,
//             )
//         });
//     });

//     mocha.run();
//   })()
