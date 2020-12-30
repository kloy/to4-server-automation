const api = require('./vultr-api');

(async () => {
    const plans = await api.getPlans();
    plans.sort((a, b) => {
        return a.monthly_cost - b.monthly_cost;
    });
    console.log(plans);
})();
