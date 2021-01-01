const api = require("./vultr-api");
const provision = require("./provisioners/to4server.js");

async function createInstance({
    osId = 0,
    plan = "",
    region = "",
    sshKeyId = "",
}) {
    console.log("Creating instances");
    const data = await api.createInstance({
        osId,
        plan,
        region,
        sshKeyId,
    });
    console.log("Instance created");
    console.log(data);
}

async function deleteInstance(instanceId) {
    console.log("Deleting instance");
    await api.deleteInstance(instanceId);
    console.log("Deleted instance");
}

async function listInstances() {
    console.log("Requesting instances");
    const data = await api.getInstances();
    console.log("Retrieved instances");
    data.forEach((instance) => {
        console.log(
            `
            label: ${instance.label}
            id: ${instance.id}
            main_ip: ${instance.main_ip}
            region: ${instance.region}
            tag: ${instance.tag}
        ` + "\n"
        );
    });
}

async function provisionInstance(instanceIp, serverName, adminPassword) {
    console.log("Provisioning instance");
    await provision(instanceIp, serverName, adminPassword);
    console.log("Provisioned instance");
}

module.exports = {
    createInstance,
    deleteInstance,
    listInstances,
    provisionInstance,
};
