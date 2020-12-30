const api = require('./vultr-api');

(async () => {
    try {
        const data = await api.createInstance();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();
