import { expose } from 'https://cdn.jsdelivr.net/npm/comlink@4.4.1/+esm';

const callNResponse = (m) => {
    return 'Dork, ' + m;
};

expose({
    callNResponse,
});
