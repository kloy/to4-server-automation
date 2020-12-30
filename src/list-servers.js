const fetch = require('node-fetch');

const apiKey = process.env.VULTR_API_KEY;
const baseUrl = 'https://api.vultr.com/v2';

(async () => {
    const response = await fetch(`${baseUrl}/instances`, {
        headers: {
            Authorization: `Bearer ${apiKey}`
        }
    });
    const data = await response.json();
    console.log('data');
    console.log(data);
})();
