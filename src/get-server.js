const api = require('./vultr-api');

(async () => {
    const data = await api.getInstance('60567b69-5c92-4cf0-9d4d-6372e38ec6d5');
    console.log(data);
})();
