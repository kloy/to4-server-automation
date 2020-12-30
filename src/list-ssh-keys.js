const api = require('./vultr-api');

(async () => {
    const data = await api.getSshKeys();
    console.log(data);
})();
