const api = require('./vultr-api');

(async () => {
    const data = await api.getRegions();
    console.log(data);
})();
