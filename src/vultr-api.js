const fetch = require("node-fetch");

const apiKey = process.env.VULTR_API_KEY;
const baseUrl = "https://api.vultr.com/v2";

const getInstances = async () => {
    const response = await fetch(`${baseUrl}/instances`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    });
    const data = await response.json();
    return data.instances;
};

const getInstance = async (instanceId) => {
    const response = await fetch(`${baseUrl}/instances/${instanceId}`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    });
    const data = await response.json();
    return data.instance;
};

const deleteInstance = async (instanceId) => {
    await fetch(`${baseUrl}/instances/${instanceId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    });
};

const createInstance = async ({
    osId = 0,
    plan = "",
    region = "",
    sshKeyId = "",
}) => {
    const response = await fetch(`${baseUrl}/instances`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            region,
            plan,
            os_id: osId,
            sshkey_id: [sshKeyId],
            activation_email: true,
            label: `[${region}] to4-server ${Date.now()}`,
            tag: "to4",
        }),
    });
    const data = await response.json();
    return data;
};

const getPlans = async () => {
    const response = await fetch(`${baseUrl}/plans`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    });
    const data = await response.json();
    return data.plans;
};

const getRegions = async () => {
    const response = await fetch(`${baseUrl}/regions`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    });
    const data = await response.json();
    return data.regions;
};

const getOs = async () => {
    const response = await fetch(`${baseUrl}/os`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    });
    const data = await response.json();
    return data.os;
};

const getSshKeys = async () => {
    const response = await fetch(`${baseUrl}/ssh-keys`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    });
    const data = await response.json();
    return data.ssh_keys;
};

module.exports = {
    getInstances,
    getInstance,
    deleteInstance,
    createInstance,
    getPlans,
    getRegions,
    getOs,
    getSshKeys,
};
