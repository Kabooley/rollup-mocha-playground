import { wrap } from 'https://cdn.jsdelivr.net/npm/comlink@4.4.1/+esm';

(async () => {
    if (window.Worker) {
        const worker = new Worker('./worker.js', { type: 'module' });
        const api = wrap(worker);
        const response = await api.callNResponse('asshole');
        console.log(response);
    }
})();
