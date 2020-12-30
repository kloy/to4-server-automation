const api = require('./vultr-api');

(async () => {
    const data = await api.getOs();
    console.log(data);
})();
